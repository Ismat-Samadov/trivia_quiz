# ICTA Analytics Bot & API

A unified FastAPI + Telegram Bot application for employee analytics and data visualization. This application provides both REST API endpoints and an interactive Telegram bot powered by Google Gemini AI.

🌐 **Live Application**: [https://icta-dataanalyst.onrender.com](https://icta-dataanalyst.onrender.com)
🤖 **Telegram Bot**: [@icta_analyst_bot](https://t.me/icta_analyst_bot)

## 📋 Features

### 🤖 Telegram Bot
- **Interactive Analytics**: Chat with the bot for data insights
- **AI-Powered Responses**: Gemini AI analyzes employee data and answers questions
- **Visual Charts**: Generates overtime, delay, and performance charts
- **Commands**:
  - `/start` - Welcome message
  - `/attendance` - View attendance data
  - `/holiday` - View holiday data
  - `/analytics` - Generate comprehensive analytics with charts

### 🔗 REST API Endpoints
- `GET /` - API status
- `GET /attendance` - Employee attendance records
- `GET /holiday` - Holiday/leave records
- `GET /permission` - Permission/break records
- `GET /data` - Processed work hours data
- `GET /monthly_fines_bonuses` - Monthly calculations
- `GET /task_1` - Task 1 dataset
- `GET /task_2` - Task 2 dataset

## 📊 Data Sources

The application uses data from Excel files uploaded to PostgreSQL database in the `icta` schema:

| File | Table | Records | Description |
|------|-------|---------|-------------|
| `attendance.xlsx` | `icta.attendance` | 246 rows | Daily attendance with entry/exit times |
| `holiday.xlsx` | `icta.holiday` | 3 rows | Employee leave periods |
| `permission.xlsx` | `icta.permission` | 6 rows | Permission/break records |
| `data.xlsx` | `icta.data` | 192 rows | Processed work hours, overtime, delays |
| `monthly_fines_bonuses.xlsx` | `icta.monthly_fines_bonuses` | 12 rows | Monthly performance calculations |
| `task.xlsx` | `icta.task_1`, `icta.task_2` | 248, 20 rows | Task-specific datasets |

## 🏗️ Architecture

```
┌─────────────────────┐
│   Combined App      │
├─────────────────────┤
│  FastAPI Server     │ ← REST API Endpoints
│  (Main Thread)      │
├─────────────────────┤
│  Telegram Bot       │ ← Bot Commands & AI
│  (Background Thread)│
├─────────────────────┤
│  PostgreSQL DB      │ ← Data Storage
│  (icta schema)      │
├─────────────────────┤
│  Google Gemini AI   │ ← AI Responses
└─────────────────────┘
```

## 🚀 Deployment

### Render Deployment Commands

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
python app.py
```

### Environment Variables

Set these in Render's environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `PGHOST` | PostgreSQL host | `ep-frosty-voice-a2s9itd4.eu-central-1.aws.neon.tech` |
| `PGDATABASE` | Database name | `tg_db` |
| `PGUSER` | Database user | `tg_db_owner` |
| `PGPASSWORD` | Database password | `your_password` |
| `BOT_TOKEN` | Telegram bot token | `7569355956:AAE...` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSyBo3WEmP772...` |

## 📱 Telegram Bot Usage

### Getting Started
1. Open Telegram and search for [@icta_analyst_bot](https://t.me/icta_analyst_bot)
2. Send `/start` to begin
3. Use commands or ask questions in natural language

### Example Interactions

**Commands:**
```
/start
/attendance
/analytics
```

**Natural Language Queries:**
```
"Which employee has the most overtime?"
"Show me the attendance patterns for July"
"What are the total fines for each department?"
"Compare overtime between IT and Marketing departments"
```

## 🔍 API Usage Examples

### Get Attendance Data
```bash
curl https://icta-dataanalyst.onrender.com/attendance
```

### Get Monthly Analytics
```bash
curl https://icta-dataanalyst.onrender.com/monthly_fines_bonuses
```

### Response Format
```json
[
  {
    "Date": "2024-07-01T00:00:00",
    "Department": "IT",
    "Employee": "Aynur",
    "Entry": "9:05",
    "Exit": "14:50"
  }
]
```

## 📈 Analytics Features

### Automated Calculations
- **Work Hours**: Entry to exit time calculations
- **Overtime**: Hours worked beyond 8-hour standard
- **Delays**: Hours below 8-hour standard
- **Fines**: Penalty calculations based on delay thresholds
- **Bonuses**: Reward calculations based on overtime thresholds

### Fine/Bonus Structure
| Condition | Fine/Bonus Rate |
|-----------|----------------|
| Delay > 3 hours | 2% fine |
| Delay > 10 hours | 3% fine |
| Delay > 20 hours | 5% fine |
| Overtime > 3 hours | 2% bonus |
| Overtime > 10 hours | 3% bonus |
| Overtime > 20 hours | 5% bonus |

### Generated Charts
- Total Overtime by Employee
- Average Overtime by Employee  
- Total Delay by Employee
- Total Fines by Employee
- Total Bonuses by Employee
- Overtime and Delay by Department
- Overtime vs Delay Scatter Plot

## 🔧 Technical Stack

- **Backend**: FastAPI (Python)
- **Bot Framework**: python-telegram-bot
- **AI**: Google Gemini Pro
- **Database**: PostgreSQL (Neon)
- **Data Processing**: Pandas, NumPy
- **Visualization**: Matplotlib, Seaborn
- **Deployment**: Render
- **Environment**: Python 3.9+

## 📦 Dependencies

```
fastapi==0.115.0
python-telegram-bot==21.6
google-generativeai
pandas==2.2.3
matplotlib==3.9.2
seaborn==0.13.2
psycopg2-binary==2.9.9
python-dotenv==1.0.1
uvicorn[standard]
```

## 🛠️ Local Development

1. **Clone & Setup**:
```bash
git clone <repository>
cd telegram
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Environment Variables**:
Create `.env` file with all required variables

3. **Run Application**:
```bash
python app.py
```

4. **Access**:
- API: `http://localhost:8000`
- Bot: Active on Telegram

## 🗃️ Database Schema

### icta.attendance
- Date, Department, Employee, Entry, Exit

### icta.holiday  
- Department, Employee, Start, End

### icta.permission
- Date, Department, Employee, Start, End

### icta.data
- Date, Department, Employee, Adjusted_Work_Hours, Overtime, Delay

### icta.monthly_fines_bonuses
- Employee, Department, Month, Delay, Overtime, Fine, Bonus

## 🤝 Support

For questions or issues:
1. Check the API status at: https://icta-dataanalyst.onrender.com
2. Test bot functionality via Telegram
3. Review logs in Render dashboard

## 📄 License

This project is part of the ICTA Data Analyst assessment.

---

**🚀 Deployment Status**: 
- 🌐 **API**: [https://icta-dataanalyst.onrender.com](https://icta-dataanalyst.onrender.com)
- 🤖 **Bot**: [@icta_analyst_bot](https://t.me/icta_analyst_bot)