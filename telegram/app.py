import logging
import requests
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import psycopg2
from sqlalchemy import create_engine
from fastapi import FastAPI
from contextlib import asynccontextmanager
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters
from dotenv import load_dotenv
import os
import asyncio
import threading
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

# Set Gemini API Key
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

# Database connection parameters
db_params = {
    "dbname": os.getenv('PGDATABASE'),
    "user": os.getenv('PGUSER'),
    "password": os.getenv('PGPASSWORD'),
    "host": os.getenv('PGHOST'),
    "port": "5432"
}

# Bot Token
BOT_TOKEN = os.getenv('BOT_TOKEN')

# Lifespan events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting Telegram bot...")
    
    # Run Telegram bot in a separate thread
    bot_thread = threading.Thread(target=run_telegram_bot, daemon=True)
    bot_thread.start()
    
    logger.info("FastAPI + Telegram Bot started successfully!")
    
    yield
    
    # Shutdown
    global telegram_app
    if telegram_app:
        await telegram_app.stop()
        await telegram_app.shutdown()
    logger.info("Application shut down successfully!")

# Initialize FastAPI app
app = FastAPI(lifespan=lifespan)

def get_db_connection():
    """Creates a connection to the PostgreSQL database"""
    try:
        return psycopg2.connect(**db_params)
    except Exception as e:
        logger.error(f"Database connection error: {e}")
        return None

def get_sqlalchemy_engine():
    """Creates SQLAlchemy engine for pandas operations"""
    connection_string = f"postgresql://{db_params['user']}:{db_params['password']}@{db_params['host']}:{db_params['port']}/{db_params['dbname']}"
    return create_engine(connection_string)

# ==================== FastAPI ENDPOINTS ====================

@app.get("/")
async def root():
    return {"message": "ICTA Analytics API with Telegram Bot"}

@app.get("/attendance")
async def get_attendance():
    """Fetch attendance data from the database"""
    try:
        engine = get_sqlalchemy_engine()
        attendance_query = 'SELECT "Date", "Department", "Employee", "Entry", "Exit" FROM icta.attendance;'
        attendance_df = pd.read_sql(attendance_query, engine)
        return attendance_df.to_dict(orient='records')
    except Exception as e:
        logger.error(f"Error fetching attendance data: {e}")
        return {"error": "Failed to fetch attendance data"}

@app.get("/holiday")
async def get_holiday():
    """Fetch holiday data from the database"""
    conn = get_db_connection()
    holiday_query = 'SELECT "Department", "Employee", "Start", "End" FROM icta.holiday;'
    holiday_df = pd.read_sql(holiday_query, conn)
    conn.close()
    return holiday_df.to_dict(orient='records')

@app.get("/permission")
async def get_permission():
    """Fetch permission data from the database"""
    conn = get_db_connection()
    permission_query = 'SELECT "Date", "Department", "Employee", "Start", "End" FROM icta.permission;'
    permission_df = pd.read_sql(permission_query, conn)
    conn.close()
    return permission_df.to_dict(orient='records')

@app.get("/data")
async def get_data():
    """Fetch processed data from the database"""
    conn = get_db_connection()
    data_query = 'SELECT "Date", "Department", "Employee", "Adjusted_Work_Hours", "Overtime", "Delay" FROM icta.data;'
    data_df = pd.read_sql(data_query, conn)
    conn.close()
    return data_df.to_dict(orient='records')

@app.get("/monthly_fines_bonuses")
async def get_monthly_fines_bonuses():
    """Fetch monthly fines and bonuses data from the database"""
    conn = get_db_connection()
    monthly_query = 'SELECT "Employee", "Department", "Month", "Delay", "Overtime", "Fine", "Bonus" FROM icta.monthly_fines_bonuses;'
    monthly_df = pd.read_sql(monthly_query, conn)
    conn.close()
    return monthly_df.to_dict(orient='records')

@app.get("/task_1")
async def get_task_1():
    """Fetch task 1 data from the database"""
    conn = get_db_connection()
    task1_query = 'SELECT * FROM icta.task_1;'
    task1_df = pd.read_sql(task1_query, conn)
    conn.close()
    return task1_df.to_dict(orient='records')

@app.get("/task_2")
async def get_task_2():
    """Fetch task 2 data from the database"""
    conn = get_db_connection()
    task2_query = 'SELECT * FROM icta.task_2;'
    task2_df = pd.read_sql(task2_query, conn)
    conn.close()
    return task2_df.to_dict(orient='records')

# ==================== TELEGRAM BOT FUNCTIONS ====================

def fetch_data_from_db(table_name):
    """Fetch data directly from database"""
    conn = get_db_connection()
    try:
        if table_name == "attendance":
            query = 'SELECT "Date", "Department", "Employee", "Entry", "Exit" FROM icta.attendance;'
        elif table_name == "holiday":
            query = 'SELECT "Department", "Employee", "Start", "End" FROM icta.holiday;'
        elif table_name == "permission":
            query = 'SELECT "Date", "Department", "Employee", "Start", "End" FROM icta.permission;'
        else:
            return pd.DataFrame()
        
        df = pd.read_sql(query, conn)
        return df
    except Exception as e:
        logger.error(f"Error fetching {table_name} data: {e}")
        return pd.DataFrame()
    finally:
        conn.close()

# Start command
async def start(update: Update, context) -> None:
    await update.message.reply_text('Welcome to the ICTA Analytics Bot! Use /attendance, /holiday, or /analytics to get insights.')

# Attendance command
async def attendance(update: Update, context) -> None:
    attendance_df = fetch_data_from_db("attendance")
    if not attendance_df.empty:
        await update.message.reply_text(f"Attendance Data:\n{attendance_df.head()}")
    else:
        await update.message.reply_text("No attendance data found.")

# Holiday command
async def holiday(update: Update, context) -> None:
    holiday_df = fetch_data_from_db("holiday")
    if not holiday_df.empty:
        await update.message.reply_text(f"Holiday Data:\n{holiday_df.head()}")
    else:
        await update.message.reply_text("No holiday data found.")

# Analytics command with chart functionality for monthly evaluation
async def analytics(update: Update, context) -> None:
    attendance_df = fetch_data_from_db("attendance")
    holiday_df = fetch_data_from_db("holiday")
    permission_df = fetch_data_from_db("permission")

    if attendance_df.empty:
        await update.message.reply_text("No data available for analytics.")
        return

    # Data processing as per your example
    attendance_df['Entry'] = pd.to_datetime(attendance_df['Entry'], format='%H:%M')
    attendance_df['Exit'] = pd.to_datetime(attendance_df['Exit'], format='%H:%M')
    attendance_df['Work_Hours'] = (attendance_df['Exit'] - attendance_df['Entry']).dt.total_seconds() / 3600
    attendance_df['Overtime'] = attendance_df['Work_Hours'] - 8
    attendance_df['Overtime'] = attendance_df['Overtime'].apply(lambda x: x if x > 0 else 0)
    attendance_df['Delay'] = 8 - attendance_df['Work_Hours']
    attendance_df['Delay'] = attendance_df['Delay'].apply(lambda x: x if x > 0 else 0)

    # Convert permission Start and End times to datetime to calculate permission hours
    if not permission_df.empty:
        permission_df['Start'] = pd.to_datetime(permission_df['Start'], format='%H:%M', errors='coerce')
        permission_df['End'] = pd.to_datetime(permission_df['End'], format='%H:%M', errors='coerce')
        permission_df['Permission_Hours'] = (permission_df['End'] - permission_df['Start']).dt.total_seconds() / 3600

        # Merge attendance with permission data
        attendance_with_permission = pd.merge(attendance_df, 
                                              permission_df[['Date', 'Department', 'Employee', 'Permission_Hours']], 
                                              on=['Date', 'Department', 'Employee'], how='left')
    else:
        attendance_with_permission = attendance_df
        attendance_with_permission['Permission_Hours'] = 0

    attendance_with_permission['Adjusted_Work_Hours'] = attendance_with_permission['Work_Hours'] - attendance_with_permission['Permission_Hours'].fillna(0)

    # Holiday data processing
    if not holiday_df.empty:
        holiday_df['Start'] = pd.to_datetime(holiday_df['Start'])
        holiday_df['End'] = pd.to_datetime(holiday_df['End'])
        leave_dates = []
        for idx, row in holiday_df.iterrows():
            leave_dates += pd.date_range(row['Start'], row['End']).to_list()

        attendance_with_permission['On_Leave'] = attendance_with_permission['Date'].isin(leave_dates)
    else:
        attendance_with_permission['On_Leave'] = False

    attendance_with_permission['Date'] = pd.to_datetime(attendance_with_permission['Date'])
    attendance_with_permission['Is_Weekend'] = attendance_with_permission['Date'].dt.weekday >= 5

    attendance_with_permission = attendance_with_permission[~(attendance_with_permission['On_Leave'] & attendance_with_permission['Is_Weekend'])]
    attendance_with_permission = attendance_with_permission[~attendance_with_permission['On_Leave']]

    # Monthly data extraction
    attendance_with_permission['Month'] = attendance_with_permission['Date'].dt.to_period('M')

    monthly_data = attendance_with_permission.groupby(['Employee', 'Department', 'Month']).agg({
        'Delay': 'sum',
        'Overtime': 'sum'
    }).reset_index()

    # Fines and Bonuses
    monthly_data['Fine'] = 0.0
    monthly_data['Bonus'] = 0.0
    monthly_data.loc[monthly_data['Delay'] > 3, 'Fine'] = 0.02
    monthly_data.loc[monthly_data['Delay'] > 10, 'Fine'] = 0.03
    monthly_data.loc[monthly_data['Delay'] > 20, 'Fine'] = 0.05
    monthly_data.loc[monthly_data['Overtime'] > 3, 'Bonus'] = 0.02
    monthly_data.loc[monthly_data['Overtime'] > 10, 'Bonus'] = 0.03
    monthly_data.loc[monthly_data['Overtime'] > 20, 'Bonus'] = 0.05

    # Generate charts
    try:
        # 1. Total Overtime by Employee
        plt.figure(figsize=(10, 6))
        monthly_data.groupby('Employee')['Overtime'].sum().plot(kind='bar', title="Total Overtime by Employee", color='skyblue')
        plt.xlabel('Employee')
        plt.ylabel('Total Overtime (Hours)')
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.savefig("total_overtime.png")
        await update.message.reply_photo(photo=open('total_overtime.png', 'rb'))

        # 2. Total Delay by Employee
        plt.figure(figsize=(10, 6))
        monthly_data.groupby('Employee')['Delay'].sum().plot(kind='bar', title="Total Delay by Employee", color='red')
        plt.xlabel('Employee')
        plt.ylabel('Total Delay (Hours)')
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.savefig("total_delay.png")
        await update.message.reply_photo(photo=open('total_delay.png', 'rb'))

        # Clean up
        plt.close('all')
        
    except Exception as e:
        await update.message.reply_text(f"Error generating charts: {str(e)}")

# Enhanced Gemini response generation function
def generate_gemini_response(user_query, monthly_data):
    # Create a more detailed prompt for better AI responses
    prompt = f"""
    You are an expert data analyst for ICTA company. You have access to employee performance data.
    
    EMPLOYEE DATA SUMMARY:
    {monthly_data.to_string(index=False)}
    
    DATA EXPLANATION:
    - Employee: Employee name
    - Department: IT or Marketing
    - Month: Time period (2024-07, 2024-08, 2024-09)
    - Delay: Hours employee was late/absent (penalty metric)
    - Overtime: Extra hours worked beyond 8-hour standard (bonus metric)
    - Fine: Penalty rate (0.02 = 2%, 0.03 = 3%, 0.05 = 5%)
    - Bonus: Reward rate based on overtime performance
    
    FINE STRUCTURE:
    - Delay > 3 hours: 2% fine
    - Delay > 10 hours: 3% fine  
    - Delay > 20 hours: 5% fine
    
    BONUS STRUCTURE:
    - Overtime > 3 hours: 2% bonus
    - Overtime > 10 hours: 3% bonus
    - Overtime > 20 hours: 5% bonus
    
    USER QUESTION: {user_query}
    
    Please provide a detailed, professional analysis in a conversational tone. Include specific numbers, trends, and actionable insights. Keep your response concise but informative (2-3 paragraphs maximum).
    """
    
    try:
        # Call Gemini API with enhanced configuration
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        generation_config = genai.types.GenerationConfig(
            temperature=0.3,  # Lower temperature for more factual responses
            max_output_tokens=500,  # Reasonable length for Telegram
            top_p=0.8,
        )
        
        response = model.generate_content(
            prompt,
            generation_config=generation_config
        )
        
        return response.text.strip()
        
    except Exception as e:
        logger.error(f"Gemini API error: {e}")
        # Fallback response with basic data summary
        total_employees = monthly_data['Employee'].nunique()
        avg_overtime = monthly_data['Overtime'].mean()
        avg_delay = monthly_data['Delay'].mean()
        
        return f"""I'm having trouble connecting to AI services right now, but here's a quick summary of your data:
        
📊 **Quick Stats:**
• Total Employees: {total_employees}
• Average Overtime: {avg_overtime:.1f} hours/month
• Average Delays: {avg_delay:.1f} hours/month

Your question: "{user_query}"

Please try again in a moment, or use /analytics for detailed charts."""

# Enhanced Gemini query handler with better UX
async def gemini_query(update: Update, context) -> None:
    user_query = update.message.text.strip()
    
    # Send "typing" action to show bot is processing
    await update.message.chat.send_action(action="typing")
    
    # Check for common greetings or simple queries
    simple_responses = {
        "hi": "Hello! 👋 I'm your ICTA Analytics Assistant. Ask me about employee performance, overtime, delays, or use /analytics for charts!",
        "hello": "Hi there! 👋 I can help you analyze employee data. Try asking about overtime trends or department performance!",
        "help": "I can help you analyze employee data! Try these:\n• 'Which employee has the most overtime?'\n• 'Show IT department performance'\n• 'Compare departments'\n• Use /analytics for visual charts",
        "thanks": "You're welcome! 😊 Feel free to ask more questions about the employee data!",
        "thank you": "Happy to help! 😊 Ask me anything about employee performance or use /analytics for detailed charts."
    }
    
    # Check for simple responses first
    query_lower = user_query.lower()
    for key, response in simple_responses.items():
        if key in query_lower:
            await update.message.reply_text(response)
            return
    
    # Fetch data for analytics
    attendance_df = fetch_data_from_db("attendance")
    holiday_df = fetch_data_from_db("holiday")
    permission_df = fetch_data_from_db("permission")

    if attendance_df.empty:
        await update.message.reply_text("❌ No data available for analysis. Please contact the administrator.")
        return

    # Calculate monthly data like in the analytics function (simplified version)
    try:
        # Show that we're processing data
        processing_msg = await update.message.reply_text("🔍 Analyzing employee data...")
        
        attendance_df['Entry'] = pd.to_datetime(attendance_df['Entry'], format='%H:%M')
        attendance_df['Exit'] = pd.to_datetime(attendance_df['Exit'], format='%H:%M')
        attendance_df['Work_Hours'] = (attendance_df['Exit'] - attendance_df['Entry']).dt.total_seconds() / 3600
        attendance_df['Overtime'] = attendance_df['Work_Hours'] - 8
        attendance_df['Overtime'] = attendance_df['Overtime'].apply(lambda x: x if x > 0 else 0)
        attendance_df['Delay'] = 8 - attendance_df['Work_Hours']
        attendance_df['Delay'] = attendance_df['Delay'].apply(lambda x: x if x > 0 else 0)

        attendance_df['Date'] = pd.to_datetime(attendance_df['Date'])
        attendance_df['Month'] = attendance_df['Date'].dt.to_period('M')
        
        monthly_data = attendance_df.groupby(['Employee', 'Department', 'Month']).agg({
            'Delay': 'sum',
            'Overtime': 'sum'
        }).reset_index()

        # Fines and Bonuses calculations
        monthly_data['Fine'] = 0.0
        monthly_data['Bonus'] = 0.0
        monthly_data.loc[monthly_data['Delay'] > 3, 'Fine'] = 0.02
        monthly_data.loc[monthly_data['Delay'] > 10, 'Fine'] = 0.03
        monthly_data.loc[monthly_data['Delay'] > 20, 'Fine'] = 0.05
        monthly_data.loc[monthly_data['Overtime'] > 3, 'Bonus'] = 0.02
        monthly_data.loc[monthly_data['Overtime'] > 10, 'Bonus'] = 0.03
        monthly_data.loc[monthly_data['Overtime'] > 20, 'Bonus'] = 0.05

        # Update processing message
        await processing_msg.edit_text("🤖 Generating AI analysis...")

        # Generate a response using Gemini based on the monthly_data
        gemini_response = generate_gemini_response(user_query, monthly_data)

        # Delete processing message and send final response
        await processing_msg.delete()
        await update.message.reply_text(f"🤖 **AI Analysis:**\n\n{gemini_response}")
        
    except Exception as e:
        logger.error(f"Error in gemini_query: {e}")
        await update.message.reply_text(f"❌ Error processing your query: {str(e)}\n\nTry using /analytics for visual charts instead!")

# ==================== TELEGRAM BOT SETUP ====================

telegram_app = None

def setup_telegram_bot():
    """Set up the Telegram bot"""
    global telegram_app
    telegram_app = Application.builder().token(BOT_TOKEN).build()
    
    # Add handlers
    telegram_app.add_handler(CommandHandler("start", start))
    telegram_app.add_handler(CommandHandler("attendance", attendance))
    telegram_app.add_handler(CommandHandler("holiday", holiday))
    telegram_app.add_handler(CommandHandler("analytics", analytics))
    telegram_app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, gemini_query))
    
    # Add error handler for bot conflicts
    async def error_handler(update, context):
        """Handle bot errors gracefully"""
        logger.error(f"Bot error: {context.error}")
        if "Conflict" in str(context.error):
            logger.info("Bot conflict detected - another instance might be running")
        
    telegram_app.add_error_handler(error_handler)

def run_telegram_bot():
    """Run the Telegram bot"""
    try:
        setup_telegram_bot()
        # Create new event loop for this thread
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        logger.info("Starting Telegram bot polling...")
        
        # Clear any existing webhooks to prevent conflicts
        async def clear_webhook():
            await telegram_app.bot.delete_webhook(drop_pending_updates=True)
            logger.info("Cleared existing webhooks")
        
        loop.run_until_complete(clear_webhook())
        
        # Disable signal handling since we're not in the main thread
        telegram_app.run_polling(
            stop_signals=None,
            drop_pending_updates=True,  # Clear pending updates
            allowed_updates=["message", "callback_query"]  # Only handle specific updates
        )
    except Exception as e:
        logger.error(f"Error running Telegram bot: {e}")
        import traceback
        logger.error(traceback.format_exc())

# ==================== STARTUP ====================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))