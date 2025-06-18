import requests
from bs4 import BeautifulSoup

def fetch_jobs_from_remoteok():
    url = "https://remoteok.com/remote-dev-jobs"
    headers = {"User-Agent": "Mozilla/5.0"}
    resp = requests.get(url, headers=headers)
    if resp.status_code != 200:
        print("Failed to fetch RemoteOK jobs.")
        return []

    soup = BeautifulSoup(resp.text, "html.parser")
    jobs = []
    for row in soup.find_all("tr", class_="job"):
        t = row.find("h2", itemprop="title")
        c = row.find("h3", itemprop="name")
        href = row.get("data-href")
        if t and c and href:
            jobs.append({
                "title": t.text.strip(),
                "company": c.text.strip(),
                "source": "remoteok",
                "link": "https://remoteok.com" + href
            })
    return jobs
