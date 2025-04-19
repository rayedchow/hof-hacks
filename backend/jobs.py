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
    return client.dataset(run["defaultDatasetId"]).iterate_items()

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
