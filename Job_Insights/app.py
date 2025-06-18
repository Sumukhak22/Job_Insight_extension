import os
import time
import yagmail
from threading import Thread
from flask import (
    Flask, request, jsonify,
    send_from_directory, session, redirect
)
from mongodb import (
    insert_jobs, find_jobs,
    insert_user
)
from scraper import fetch_jobs_from_remoteok as fetch_jobs

# ——— CONFIG —————————————————————————————————————————————
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
GMAIL_USER     = "your_email_id"
GMAIL_APP_PASS = "your_app_password"

# ——— FLASK SETUP ————————————————————————————————————————
app = Flask(
    __name__,
    static_folder=BASE_DIR,
    static_url_path=""       
)
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret")

# ——— AUTH ROUTES ————————————————————————————————————————

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return send_from_directory(BASE_DIR, "login.html")
    name  = request.form.get("name")
    email = request.form.get("email")
    if not (name and email):
        return "Name and email required", 400
    insert_user({"name": name, "email": email})
    session["user_name"]  = name
    session["user_email"] = email
    return redirect("/")

@app.route("/logout", methods=["GET"])
def logout():
    session.pop("user_name", None)
    session.pop("user_email", None)
    return redirect("/login")

@app.route("/", methods=["GET"])
def index():
    if "user_email" not in session:
        return redirect("/login")
    return send_from_directory(BASE_DIR, "index.html")

# ——— JOB ENDPOINTS ——————————————————————————————————————

@app.route("/mongostore", methods=["POST"])
def store_to_mongo():
    jobs = fetch_jobs()
    insert_jobs(jobs)
    return jsonify({"status": "success", "inserted": len(jobs)})

@app.route("/scrape", methods=["POST"])
def scrape_jobs():
    if "user_email" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    data    = request.get_json()
    title   = data.get("title")
    company = data.get("company")
    results = find_jobs(title=title, company=company, limit=10)
    return jsonify({"jobs": results})

# ——— MAIL ENDPOINT ——————————————————————————————————————

@app.route("/mail", methods=["POST"])
def mail_jobs():
    if "user_email" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data    = request.get_json()
    title   = data.get("title")
    company = data.get("company")
    jobs    = find_jobs(title=title, company=company, limit=10)

    if jobs:
        parts = []
        for j in jobs:
            p = f"Title: {j['title']}\nCompany: {j['company']}\nSource: {j['source']}"
            if j.get("link"):
                p += f"\nLink: {j['link']}"
            parts.append(p)
        body = "Here are your job results:\n\n" + "\n\n".join(parts)
    else:
        body = "No jobs found matching your query."

    yag = yagmail.SMTP(user=GMAIL_USER, password=GMAIL_APP_PASS)
    yag.send(
        to=session["user_email"],
        subject="Your Job Scraper Results",
        contents=body
    )
    return jsonify({"status": "email sent"})

# ——— SCHEDULER ——————————————————————————————————————————

@app.route("/api", methods=["GET"])
def api_scheduler():
    def background_job():
        while True:
            insert_jobs(fetch_jobs())
            time.sleep(24 * 3600)
    Thread(target=background_job, daemon=True).start()
    return jsonify({"status": "scheduler started"})

if __name__ == "__main__":
    app.run(debug=True)
