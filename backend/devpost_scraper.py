import requests
from bs4 import BeautifulSoup
import json
import time

BASE_URL = "https://devpost.com"


def get_project_links(username):
    """
    Fetches the portfolio page for a given username and extracts project URLs.
    """
    url = f"{BASE_URL}/{username}"
    resp = requests.get(url)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    projects = []
    # Select all project links in the portfolio
    for a in soup.select("a.link-to-software"):  # links to software pages
        href = a.get("href")
        if href:
            full_url = href if href.startswith("http") else BASE_URL + href
            projects.append(full_url)
    return list(dict.fromkeys(projects))  # dedupe while preserving order


def get_project_details(project_url):
    """
    Visits a Devpost project page and extracts structured details.
    """
    resp = requests.get(project_url)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    details = {}
    # Title
    title_tag = soup.select_one("#app-details-left h1")
    details["title"] = title_tag.get_text(strip=True) if title_tag else None

    # Extract each H2 section and its following content
    content_div = soup.select_one("#app-details-left")
    if content_div:
        for header in content_div.find_all('h2'):
            section = header.get_text(strip=True)
            content = []
            for sib in header.find_next_siblings():
                if sib.name == 'h2':
                    break
                if sib.name in ['p', 'ul', 'ol']:
                    text = sib.get_text(separator="\n", strip=True)
                    if text:
                        content.append(text)
            details[section] = "\n\n".join(content)

    # Built With tags
    built = soup.select("#built-with span.cp-tag")
    details["built_with"] = [tag.get_text(strip=True) for tag in built]

    return details


def scrape_username(username, delay=1):
    """
    Orchestrates scraping for a given username.

    Returns a dict keyed by project slug with project detail dictionaries.
    """
    project_urls = get_project_links(username)
    results = {}
    for url in project_urls:
        slug = url.rstrip('/').split('/')[-1]
        try:
            details = get_project_details(url)
            results[slug] = details
        except Exception as e:
            print(f"Error scraping {url}: {e}")
        time.sleep(delay)
    return results


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Scrape Devpost portfolio for a user")
    parser.add_argument("username", help="Devpost username (e.g. voomp)")
    parser.add_argument("-o", "--output", help="Output JSON file", default="projects.json")
    parser.add_argument("-d", "--delay", type=float, help="Delay between requests in seconds", default=1.0)
    args = parser.parse_args()

    data = scrape_username(args.username, delay=args.delay)
    with open(args.output, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"Wrote {len(data)} projects to {args.output}")
