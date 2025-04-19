import os
import time
import json
import random
from typing import Dict, Any, Optional, List

from fastapi import FastAPI, Body, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from apify_client import ApifyClient

# Import Selenium components
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import (
    TimeoutException,
    NoSuchElementException,
    WebDriverException
)

# Import custom form filling functions
from formfiller import safe_send_keys, fill_form_page

# Initialize Apify client
client = ApifyClient("apify_api_U1UYuCx46PyRSPFWvdugKAdMfOpYxc2NLRgX")

# Create FastAPI app
app = FastAPI(title="Job Application Automation API")

# Add CORS middleware to allow cross-origin requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Define models
class JobSearch(BaseModel):
    search: str
    location: str

class UserData(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    githubUsername: Optional[str] = None
    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zipCode: Optional[str] = None
    country: Optional[str] = None
    
    class Config:
        # Allow extra fields and arbitrary types from frontend
        extra = "allow"
        arbitrary_types_allowed = True

class JobData(BaseModel):
    id: str
    company: str
    positionName: str
    externalApplyLink: Optional[str] = None
    url: Optional[str] = None
    
    class Config:
        # Allow extra fields that might be in the job data
        extra = "allow"

class ApplicationRequest(BaseModel):
    job: JobData
    user: UserData

class ApplicationResponse(BaseModel):
    success: bool
    message: str
    job_id: str
    company: str
    details: Optional[Dict[str, Any]] = None

# Application tracking
application_status: Dict[str, Dict[str, Any]] = {}

# Function to get jobs from Apify
def get_jobs(search: str, location: str):
    """Get jobs from the Indeed scraper on Apify."""
    run_input = {
        "position": search,
        "country": "US",
        "location": location,
        "maxItems": 50,
        "saveOnlyUniqueItems": True,
    }
    run = client.actor("hMvNSpz3JnHgl5jkh").call(run_input=run_input)
    return client.dataset(run["defaultDatasetId"]).iterate_items()

def setup_webdriver():
    """Configure and initialize the Selenium WebDriver with advanced anti-bot detection."""
    chrome_options = Options()
    
    # Non-headless mode - Browser will be visible to the user
    # Explicitly make sure headless mode is disabled
    chrome_options.add_argument("--start-maximized")  # Start with maximized browser
    
    # Additional options for stability
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    
    # Anti-bot detection measures
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_argument("--disable-extensions")
    
    # Set a realistic window size (like a standard laptop screen)
    chrome_options.add_argument("--window-size=1366,768")
    
    # Add a user agent that appears more like a regular browser
    chrome_options.add_argument("--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36")
    
    # Disable automation info bar and other automation flags
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    
    # Additional preferences to appear more human-like
    prefs = {
        "credentials_enable_service": False,
        "profile.password_manager_enabled": False,
        "profile.default_content_setting_values.notifications": 2,  # Block notifications
        "plugins.always_open_pdf_externally": True  # Don't open PDFs in browser
    }
    chrome_options.add_experimental_option("prefs", prefs)
    
    # Create the WebDriver
    driver = webdriver.Chrome(options=chrome_options)
    
    # Execute CDP commands to further disguise automation
    # This removes the 'navigator.webdriver' flag that many bot detectors check
    driver.execute_cdp_cmd('Page.addScriptToEvaluateOnNewDocument', {
        'source': '''
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            })
        '''
    })
    
    # Add additional stealth techniques
    driver.execute_cdp_cmd('Network.setUserAgentOverride', {
        "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
    })
    
    return driver

def process_application(job_id: str, job_url: str, user_data: UserData):
    """Process a job application using Selenium."""
    driver = None
    application_status[job_id] = {
        "status": "processing",
        "message": "Starting application process - Browser window opening for interactive form filling",
        "timestamp": time.time()
    }
    
    form_filled = False  # Track if we successfully filled any form fields
    screenshot_path = None
    
    try:
        # Set up the WebDriver
        driver = setup_webdriver()
        
        print(f"Starting application for job {job_id} at {job_url}")
        
        # Navigate to the job URL
        driver.get(job_url)
        print(f"Loaded job page: {job_url}")
        
        # Wait for page to load (adjust timeout as needed)
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        
        # Look for common application button patterns
        apply_buttons = driver.find_elements(By.XPATH, 
            "//a[contains(text(), 'Apply') or contains(@class, 'apply') or contains(@id, 'apply')]"
        )
        
        if apply_buttons:
            print(f"Found {len(apply_buttons)} possible apply buttons")
            # Click the first apply button
            apply_buttons[0].click()
            print("Clicked apply button")
            
            # Wait for application form page to load
            print("Waiting for application form to load...")
            time.sleep(5)  # Allow longer time for page transition for better user experience
            
            # Try to fill the form with user data
            # Assume we're on an application form
            try:
                # Wait for form elements to be present
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.TAG_NAME, "form"))
                )
                
                # Create a fake resume path - in a real scenario, this would be provided or stored
                # This is just a placeholder
                fake_resume_path = "/path/to/resume.pdf"
                
                # Look for common form fields
                # First name field
                try:
                    first_name_field = driver.find_element(By.XPATH, 
                        "//input[contains(@id, 'first') or contains(@name, 'first') or @placeholder='First Name']"
                    )
                    safe_send_keys(driver, first_name_field, user_data.firstName, "First Name")
                    # Pause briefly for visual feedback
                    time.sleep(random.uniform(0.2, 0.5))
                except NoSuchElementException:
                    print("First name field not found")
                
                # Last name field
                try:
                    last_name_field = driver.find_element(By.XPATH, 
                        "//input[contains(@id, 'last') or contains(@name, 'last') or @placeholder='Last Name']"
                    )
                    safe_send_keys(driver, last_name_field, user_data.lastName, "Last Name")
                except NoSuchElementException:
                    print("Last name field not found")
                
                # Email field
                try:
                    email_field = driver.find_element(By.XPATH, 
                        "//input[contains(@type, 'email') or contains(@id, 'email') or contains(@name, 'email')]"
                    )
                    safe_send_keys(driver, email_field, user_data.email, "Email")
                except NoSuchElementException:
                    print("Email field not found")
                
                # Phone field
                try:
                    phone_field = driver.find_element(By.XPATH, 
                        "//input[contains(@type, 'tel') or contains(@id, 'phone') or contains(@name, 'phone')]"
                    )
                    safe_send_keys(driver, phone_field, user_data.phone, "Phone")
                except NoSuchElementException:
                    print("Phone field not found")
                
                # Take a screenshot for verification
                screenshot_path = f"application_{job_id}.png"
                driver.save_screenshot(screenshot_path)
                print(f"Saved form screenshot to {screenshot_path}")
                
                # Inform the user they can now complete the form manually
                print("\n=====================================================")
                print(f"BROWSER WINDOW OPEN FOR JOB: {job_id} at {job.company}")
                print("Please complete the application form manually.")
                print("THE BROWSER WILL REMAIN OPEN UNTIL YOU CLOSE IT.")
                print("Close the browser window when you've finished the application.")
                print("=====================================================\n")
                
                # Update application status to inform frontend
                application_status[job_id] = {
                    "status": "manual_interaction",
                    "message": "Browser open for manual completion. Please close the browser when finished.",
                    "timestamp": time.time()
                }
                
                # Mark that we successfully filled at least some form fields
                form_filled = True
                
                # Update application status
                application_status[job_id] = {
                    "status": "success",
                    "message": "Successfully filled application form",
                    "timestamp": time.time()
                }
                
                return {
                    "success": True,
                    "message": "Application form filled successfully",
                    "details": {"screenshot": screenshot_path}
                }
                
            except (TimeoutException, NoSuchElementException) as e:
                error_msg = f"Error filling application form: {str(e)}"
                print(error_msg)
                application_status[job_id] = {
                    "status": "failed",
                    "message": error_msg,
                    "timestamp": time.time()
                }
                return {"success": False, "message": error_msg}
        else:
            msg = "No apply button found on the page"
            print(msg)
            application_status[job_id] = {
                "status": "failed",
                "message": msg,
                "timestamp": time.time()
            }
            return {"success": False, "message": msg}
            
    except Exception as e:
        error_msg = f"Error processing application: {str(e)}"
        print(error_msg)
        application_status[job_id] = {
            "status": "failed",
            "message": error_msg,
            "timestamp": time.time()
        }
        return {"success": False, "message": error_msg}
    finally:
        # Always show manual interaction message if we have a driver
        if driver:
            print("\n=====================================")
            print("BROWSER WINDOW IS OPEN FOR MANUAL INTERACTION")
            print("Please complete the application form manually")
            print("THE BROWSER WILL REMAIN OPEN UNTIL YOU CLOSE IT")
            print("Close the browser window when you've finished")
            print("=====================================\n")
            
            # Update status to indicate manual interaction needed
            application_status[job_id] = {
                "status": "manual_interaction",
                "message": "Browser open for manual completion. Please close the browser when finished.",
                "timestamp": time.time()
            }
            
            # Now wait for the browser to be manually closed
            # This will happen regardless of what path the code took above
            try:
                # Keep checking if browser is still open
                while True:
                    try:
                        # This will throw an exception when the browser is closed
                        current_url = driver.current_url
                        time.sleep(2)  # Check every 2 seconds
                    except Exception:
                        # Browser was closed
                        break
                print("Browser was closed by the user. Completing application process.")
            except Exception as e:
                print(f"Error while waiting for browser to close: {str(e)}")
            
            # Record success after manual interaction
            status_message = "Application completed manually by user"
            print(status_message)
            application_status[job_id] = {
                "status": "success",
                "message": status_message,
                "timestamp": time.time()
            }
            
            # Don't call driver.quit() - it should already be closed by user

@app.post("/apply", response_model=ApplicationResponse)
async def apply_for_job(data: Any = Body(...)):
    """Apply for a job using the provided job and user data. This is a synchronous process that waits
    for the browser to be closed before returning."""
    try:
        # Convert raw data to our models
        print(f"Received application data: {data}")
        
        # Extract job and user data safely
        job_data = data.get('job') if isinstance(data, dict) else data.job
        user_data = data.get('user') if isinstance(data, dict) else data.user
        
        # Validate data by parsing through our models
        job = JobData(**job_data)
        user = UserData(**user_data)
        
        # Get the job URL
        job_url = job.externalApplyLink or job.url
        print(job.externalApplyLink)
        if not job_url:
            try:
                # If no direct URL is provided, try to use the job ID to create a URL
                # In production, you would query a database or API for the job URL
                job_url = f"https://www.indeed.com/viewjob?jk={job.id}"
                print(f"Using simulated job URL: {job_url}")
            except Exception as e:
                print(f"Error looking up job: {str(e)}")
                return ApplicationResponse(
                    success=False,
                    message=f"Could not determine job URL: {str(e)}",
                    job_id=job.id,
                    company=job.company
                )
            
        # Check if application is already in progress
        if job.id in application_status and application_status[job.id].get('status') == 'processing':
            return ApplicationResponse(
                success=False,
                message="Application already in progress",
                job_id=job.id,
                company=job.company,
                details={"status": application_status[job.id].get('status')}
            )
        
        # Process application synchronously - this will wait until the browser is closed
        result = process_application(job.id, job_url, user)
        
        # Return the actual result after the browser is closed
        return ApplicationResponse(
            success=result.get('success', False),
            message=result.get('message', "Application process completed"),
            job_id=job.id,
            company=job.company,
            details={"status": "completed"}
        )
    except Exception as e:
        print(f"Unexpected error processing application request: {str(e)}")
        return ApplicationResponse(
            success=False,
            message=f"Error processing application: {str(e)}",
            job_id=getattr(job, 'id', 'unknown'),
            company=getattr(job, 'company', 'unknown'),
            details={"error": str(e)}
        )

@app.get("/apply/{job_id}/status")
async def get_application_status(job_id: str):
    """Get the current status of a job application."""
    if job_id not in application_status:
        raise HTTPException(status_code=404, detail="Application not found")
        
    return {
        "job_id": job_id,
        **application_status[job_id]
    }

@app.post("/jobs")
async def jobs_endpoint(job_search: JobSearch = Body(...)):
    """Get jobs matching the search criteria."""
    # Get the search parameters from the request body
    search, location = job_search.search, job_search.location
    
    # Use the get_jobs function to fetch jobs from Apify
    jobs = list(get_jobs(search, location))
    
    return jobs

@app.get("/")
async def root():
    return {"message": "Job Application Automation API is running"}

# For running the application with uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
