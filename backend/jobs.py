from random import randint
from apify_client import ApifyClient
from fastapi import FastAPI, Body
from pydantic import BaseModel
from typing import List, Dict, Any
from fastapi.middleware.cors import CORSMiddleware

client = ApifyClient("apify_api_U1UYuCx46PyRSPFWvdugKAdMfOpYxc2NLRgX")

# Create FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class JobSearch(BaseModel):
    search: str
    location: str

first_jobs = [
    {
        "id": "jjzkkzsukk4849k",
        "location": "Burlington, MA",
        "company": "Veracode",
        "positionName": "Solutions Architect Intern",
        "url": "https://boards.greenhouse.io/embed/job_app?token=7843495002",
        "value": 63,
        "isExpired": False,
        "jobType": "Full-time",
        "postedAt": "2025-04-19T13:55:26-04:00",
        "description": "Looking for an internship in an innovative, high-growth company in one of the hottest segments of the security market?  Look no further than Veracode! Veracode is seeking a Solutions Architecture intern to join our 12-week Summer Internship Program."
    },
    {
        "id": "7jfkfklltopuuumz85",
        
    },
    {
        "id": "988ghgjfklhi38jdkl",

    }
]

def get_jobs(search: str, location: str):
    run_input = {
        "position": search,
        "country": "US",
        "location": location,
        "maxItems": 50,
        # "parseCompanyDetails": True,
        "saveOnlyUniqueItems": True,
        # "followApplyRedirects": True,
    }
    run = client.actor("hMvNSpz3JnHgl5jkh").call(run_input=run_input)
    jobs = []
    for job in client.dataset(run["defaultDatasetId"]).iterate_items():
        new_job = {
            "company": job["company"],
            "description": job["description"],
            "id": job["id"],
            "isExpired": job["isExpired"],
            "jobType": job["jobType"],
            "location": job["location"],
            "positionName": job["positionName"],
            "postedAt": job["postedAt"],
            "url": job["url"] or job["externalApplyLink"],
            "value": randint(30, 95)
        }
        jobs.append(new_job)
    
    return jobs

@app.post("/jobs")
async def jobs_endpoint(job_search: JobSearch = Body(...)):
    # Get the search parameter from the request body
    search, location = job_search.search, job_search.location
    
    # Use the existing get_jobs function
    jobs = list(get_jobs(search, location))
    
    return jobs

# For running the application with uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
