

from devpost_scraper import scrape_username
import pprint

def main():
    username = "voomp"
    # scrape with a half‑second delay between requests
    data = scrape_username(username, delay=0.5)
    # pretty‑print the JSON-like dict
    pprint.pprint(data)

if __name__ == "__main__":
    main()
