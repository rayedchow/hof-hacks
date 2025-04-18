from apify_client import ApifyClient

# Initialize the ApifyClient with your API token
client = ApifyClient("apify_api_U1UYuCx46PyRSPFWvdugKAdMfOpYxc2NLRgX")

# Prepare the Actor input
run_input = {
    "position": "software engineer intern",
    "country": "US",
    "location": "New York",
    "maxItems": 10,
    # "parseCompanyDetails": True,
    "saveOnlyUniqueItems": True,
    # "followApplyRedirects": True,
}

# Run the Actor and wait for it to finish
run = client.actor("hMvNSpz3JnHgl5jkh").call(run_input=run_input)

# Fetch and print Actor results from the run's dataset (if there are any)
for item in client.dataset(run["defaultDatasetId"]).iterate_items():
    print(item)