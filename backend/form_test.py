from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
import time
from selenium.common.exceptions import NoSuchElementException

# Create driver
driver = webdriver.Chrome()
driver.get("https://boards.greenhouse.io/embed/job_app?token=7843495002")

time.sleep(2)  # wait for page to load

# Function to get element label from formfiller.py
def get_element_label(driver, element, form=None):
    """Attempts to find the label or descriptive text for a given element."""
    element_id = element.get_attribute("id")
    element_name = element.get_attribute("name")

    # 1. Check for associated <label> using 'for' attribute
    if element_id:
        try:
            # Search relative to the form if possible
            if form:
                label_element = form.find_element(By.CSS_SELECTOR, f"label[for='{element_id}']")
            else:
                label_element = driver.find_element(By.CSS_SELECTOR, f"label[for='{element_id}']")
            label_text = label_element.text.strip()
            if label_text:
                return label_text
        except NoSuchElementException:
            pass # No label found for this ID

    # 2. Check parent elements for label text or legend (for fieldsets)
    try:
        # Look up to a few parent levels for text that might serve as a label
        parent = element.find_element(By.XPATH, "./...") # Direct parent
        for _ in range(3): # Check up to 3 levels up
            parent_text = parent.text.strip().split('\n')[0] # Get first line of text in parent
            if parent_text:
                 # Try to refine this - check if the text looks like a label
                 # This is heuristic and might need adjustment
                 if len(parent_text) < 100: # Simple check to avoid large blocks of text
                     return parent_text

            # Check if parent is a <label> itself wrapping the input
            if parent.tag_name.lower() == 'label':
                 label_text = parent.text.strip()
                 if label_text:
                     return label_text

            # Check for <legend> in parent <fieldset>
            if parent.tag_name.lower() == 'fieldset':
                 try:
                      legend_element = parent.find_element(By.TAG_NAME, 'legend')
                      legend_text = legend_element.text.strip()
                      if legend_text:
                          return legend_text
                 except NoSuchElementException:
                      pass # No legend in this fieldset

            parent = parent.find_element(By.XPATH, "./...") # Move up one level
    except:
        pass # Silently fail if parent searching goes wrong

    # 3. Check for aria-label or placeholder attributes
    aria_label = element.get_attribute("aria-label")
    if aria_label:
        return aria_label.strip()

    placeholder = element.get_attribute("placeholder")
    if placeholder:
        return placeholder.strip()

    # 4. Fallback to name or type
    return element_name or element.get_attribute("type") or "Unknown Element"

# --- Step 1: Extract text fields ---
def extract_fields():
    fields = []
    try:
        # Try to find a form element first
        form = driver.find_element(By.TAG_NAME, "form")
    except NoSuchElementException:
        form = None  # No form found, will search in entire document
        
    # Text inputs (only text-related fields)
    text_inputs = driver.find_elements(By.XPATH, "//input[@type='text' or @type='email' or @type='tel' or @type='number' or @type='password']")
    for el in text_inputs:
        # Get what the field is asking for using the more sophisticated label detection
        field_label = get_element_label(driver, el, form)
        fields.append({
            "type": "text",
            "name": field_label,  # Use the label instead of just the technical attribute
            "element": el
        })

    # Textareas
    text_areas = driver.find_elements(By.TAG_NAME, "textarea")
    for el in text_areas:
        field_label = get_element_label(driver, el, form)
        fields.append({
            "type": "textarea",
            "name": field_label,
            "element": el
        })

    return fields

# Step 2: Send field metadata to AI function
fields = extract_fields()

# Field descriptions for AI
field_descriptions = [
    {"type": f["type"], "name": f["name"]}
    for f in fields
]

def your_ai_function(desc):
	values = {}
	for field in desc:
		values[field["name"]] = "A"
	print(desc)
	print(values)
	return values

# === AI FUNCTION CALL (already written) ===
# It should return a dictionary: {field_name: field_value}
ai_field_values = your_ai_function(field_descriptions)
# ==========================================

# Step 3: Enter values into form
for field in fields:
    name = field["name"]
    value = ai_field_values.get(name)

    if value is None:
        continue  # Skip if AI didn’t return a value

    if field["type"] in ["text", "textarea"]:
        field["element"].clear()
        field["element"].send_keys(value)

    elif field["type"] == "dropdown":
        Select(field["element"]).select_by_visible_text(value)

    elif field["type"] == "file":
        # value should be a file path
        field["element"].send_keys(value)