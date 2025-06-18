# Job Insight Pro – Smart Market Analysis Extension

Job Insight Pro is a Chrome extension paired with a Python Flask backend that automates the collection, analysis, and reporting of job listings from online platforms. It helps job seekers and recruiters stay updated with real-time market trends through curated email reports.

## Features

- **Smart Job Market Insights** - Automated analysis from multiple job platforms
- **Chrome Extension Interface** - Easy-to-use browser extension for seamless access
- **Automated Email Reports** - Auto-generated job summary reports delivered to your inbox
- **User Authentication** - Secure login and session management system
- **Data Persistence** - MongoDB storage for user profiles and job data

## Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Chrome Extension (HTML, JavaScript) |
| **Backend** | Python Flask |
| **Database** | MongoDB |
| **Email Service** | Yagmail (Gmail SMTP) |

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/job-insight-pro.git
cd job-insight-pro
```

### 2. Chrome Extension Setup

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer Mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the `extension/` folder from the cloned repository

### 3. Backend Configuration

#### Install Dependencies

```bash
pip install -r requirements.txt
```

#### Generate Gmail App Password

1. Visit [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Select **Mail** and your device type
3. Click **Generate**
4. Copy the 16-character password

#### Configure Application

Open `app.py` and update the following credentials:

```python
sender_email = "your-email@gmail.com"
sender_password = "your-app-password"
```

### 4. Start the Application

```bash
python app.py
```

The Flask server will be available at `http://localhost:5000/`

## Usage

1. **Launch Extension** - Click the Job Insight Pro icon in your Chrome toolbar
2. **Authentication** - Log in using your registered credentials
3. **Configure Preferences** - Set your job search parameters and notification preferences
4. **Receive Insights** - Get automated email reports with curated job market analysis


##**Built with ❤️ for smarter job market analysis**
