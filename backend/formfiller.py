
import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys # Import Keys
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import (
    NoSuchElementException,
    StaleElementReferenceException,
    TimeoutException,
    ElementClickInterceptedException,
    WebDriverException,
    InvalidArgumentException
)

def safe_send_keys(driver, element, text, element_name="field"):
    """Safely sends keys to an element after waiting for it to be ready."""
    try:
        # Wait for the element to be visible and enabled
        WebDriverWait(driver, 5).until(
             EC.visibility_of(element)
        )
        # Wait for the element to be clickable (useful for inputs that might be overlaid)
        WebDriverWait(driver, 5).until(
             EC.element_to_be_clickable(element)
        )
        element.clear()
        element.send_keys(text)
        print(f"  • Successfully filled '{element_name}'.")
    except (TimeoutException, ElementClickInterceptedException):
         print(f"  • Warning: {element_name} not visible or clickable within timeout, skipping.")
    except StaleElementReferenceException:
        print(f"  • Warning: {element_name} became stale, skipping.")
    except Exception as e:
        print(f"  • Error filling '{element_name}': {e}")

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
        parent = element.find_element(By.XPATH, "./..") # Direct parent
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

            parent = parent.find_element(By.XPATH, "./..") # Move up one level
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


def fill_form_page(driver, resume_path):
    """
    Fills text fields, attempts to handle dropdowns using keyboard simulation,
    and uploads resume on the current page.

    Args:
        driver: The Selenium WebDriver instance.
        resume_path: The absolute path to the resume file.
    """
    print("-" * 30)
    print("Attempting to fill form fields on the current page...")

    try:
        # Wait for the form element to be present
        form = WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.TAG_NAME, "form"))
        )
        print("Form element found.")
    except TimeoutException:
        print("Error: Could not find a <form> element on the page within timeout.")
        return # Cannot proceed without a form
    except Exception as e:
        print(f"An error occurred while finding the form: {e}")
        return

    # 1. Fill text-based inputs and textareas with "A"
    text_selectors = [
        "input[type='text']",
        "input[type='email']",
        "input[type='tel']",
        "input[type='number']",
        "input[type='password']",
        "textarea"
    ]
    print("Attempting to fill text fields and textareas with 'A'...")
    for sel in text_selectors:
        try:
            # Find elements within the *form*
            fields = form.find_elements(By.CSS_SELECTOR, sel)
            # print(f"Found {len(fields)} elements for selector '{sel}'.") # Debugging
            for field in fields:
                 label = get_element_label(driver, field, form)
                 print(f"Filling field '{label}' (Selector: {sel})")
                 safe_send_keys(driver, field, "A", f"text field '{label}'")

        except StaleElementReferenceException:
             print(f"  • Warning: Elements for selector '{sel}' became stale, skipping remaining for this selector.")
        except Exception as e:
             print(f"  • An error occurred while trying to find/process elements for selector '{sel}': {e}")


    # 2. Handle dropdowns using keyboard simulation (Enter, Down, Down, Enter)
    print("Attempting to handle dropdowns using keyboard simulation...")
    try:
        # Find both standard selects and potentially custom dropdown containers
        # We will try to interact with the visible, enabled element.
        # Common custom dropdown patterns: div/span with specific classes or roles, often siblings to hidden selects.
        # This XPath is a guess for interactive elements related to selects or custom dropdowns.
        dropdown_elements_xpath = "//select[not(contains(@style, 'display: none')) and not(@disabled)] | //*[(@role='combobox' or @role='listbox' or contains(@class, 'select2-container') or contains(@class, 'chosen-container')) and not(contains(@style, 'display: none')) and not(@disabled)] | //select[contains(@style, 'display: none')]//following-sibling::*[not(contains(@style, 'display: none')) and not(@disabled)][1]"

        dropdown_elements = form.find_elements(By.XPATH, dropdown_elements_xpath)
        # print(f"Found {len(dropdown_elements)} potential dropdown elements.") # Debugging

        for dropdown_elem in dropdown_elements:
             try:
                 label = get_element_label(driver, dropdown_elem, form)
                 print(f"Processing potential dropdown '{label}' (Tag: {dropdown_elem.tag_name})...")

                 # Ensure the element is visible and enabled before interacting
                 if dropdown_elem.is_displayed() and dropdown_elem.is_enabled():
                    print(f"  • Element is visible and enabled. Attempting keyboard simulation.")
                    try:
                         # Click to focus the element first
                         dropdown_elem.click()
                         time.sleep(0.5) # Short pause after clicking to ensure focus/open

                         print("  • Sending Keys.ENTER")
                         dropdown_elem.send_keys(Keys.ENTER)
                         time.sleep(0.5) # Pause to allow dropdown to open

                         print("  • Sending Keys.ARROW_DOWN")
                         dropdown_elem.send_keys(Keys.ARROW_DOWN)
                         time.sleep(0.2) # Small pause between key presses

                         print("  • Sending Keys.ARROW_DOWN")
                         dropdown_elem.send_keys(Keys.ARROW_DOWN)
                         time.sleep(0.2) # Small pause between key presses

                         print("  • Sending Keys.ENTER")
                         dropdown_elem.send_keys(Keys.ENTER)
                         print("  • Keyboard simulation complete for dropdown.")
                         time.sleep(0.5) # Pause after selection

                    except StaleElementReferenceException:
                         print(f"  • Warning: Dropdown element '{label}' became stale during keyboard interaction, skipping.")
                    except (ElementClickInterceptedException, WebDriverException) as e:
                         print(f"  • Warning: Could not interact with dropdown '{label}' via click/send_keys: {e}. Skipping.")
                    except Exception as e:
                         print(f"  • An unexpected error occurred during keyboard simulation for dropdown '{label}': {e}")
                 else:
                    print(f"  • Element '{label}' is not visible or enabled, skipping.")

             except StaleElementReferenceException:
                print(f"  • Warning: Dropdown element became stale before processing, skipping.")
             except Exception as e:
                print(f"  • An unexpected error occurred while processing a dropdown element: {e}")


    except Exception as e:
        print(f"  • An error occurred while trying to find dropdown elements: {e}")


    # 3. Upload resume.pdf to file inputs identified as resume/CV
    print("Attempting to handle file uploads (resume/CV)...")
    try:
        # Find all file inputs within the form context
        file_inputs = form.find_elements(By.CSS_SELECTOR, "input[type='file']")
        # print(f"Found {len(file_inputs)} file input elements.") # Debugging

        resume_attached = False # Flag to ensure we only attach resume once if multiple file inputs match
        for field in file_inputs:
            if resume_attached:
                 # print("Resume already attached, skipping other file inputs.") # Debugging
                 break # Exit loop if resume is already attached

            try:
                fld_id = field.get_attribute("id")
                fld_name = field.get_attribute("name") or ""
                # Use the improved label getting function
                label = get_element_label(driver, field, form)

                print(f"Processing file input: '{label}' (ID: {fld_id or 'N/A'}, Name: {fld_name or 'N/A'})")

                # Identify if this is a resume/CV field
                # Check label, name, ID, and nearby text (in parent/sibling elements)
                field_identifier = f"{label.lower()}|{fld_name.lower()}|{fld_id.lower() if fld_id else ''}"

                # Also check text of nearby parent/sibling elements for keywords
                nearby_text = ""
                try:
                    # Check text in parent div/span within 3 levels up
                    parent = field.find_element(By.XPATH, "./..")
                    for _ in range(3):
                         nearby_text += parent.text.lower() + " "
                         parent = parent.find_element(By.XPATH, "./..")
                except:
                    pass # Ignore errors during nearby text check

                is_resume_field = False
                for kw in ["resume", "cv", "curriculum vitae"]:
                    if kw in field_identifier or kw in nearby_text:
                        is_resume_field = True
                        break

                if is_resume_field:
                    print(f"  • Identified as a potential resume/CV upload field.")
                    print(f"  • Attaching resume file: '{os.path.basename(resume_path)}'")

                    # Ensure the resume file exists
                    if not os.path.exists(resume_path):
                        print(f"  • Error: Resume file not found at '{resume_path}'. Cannot attach.")
                        continue # Skip this file input

                    try:
                        # Wait for the file input element to be present and potentially interactable by send_keys.
                        # Using EC.presence_of_element_located is often sufficient for hidden file inputs.
                        # EC.element_to_be_clickable might fail if the element is truly hidden/overlaid.
                        # Rely on send_keys working on hidden inputs.
                        WebDriverWait(driver, 10).until(
                             EC.presence_of_element_located((By.XPATH, f".//input[@id='{fld_id}' and @type='file']" if fld_id else f".//input[@name='{fld_name}' and @type='file']" if fld_name else ".//input[@type='file']") ) # Use xpath relative to form for robustness
                         )
                        # It's crucial that the file input element found here is the actual one
                        # that the website's JavaScript uses for file selection.
                        field.send_keys(resume_path)
                        print(f"  • send_keys executed for '{label}'. Check browser to confirm upload.")
                        # Add a small pause for the website's JavaScript to process the file selection
                        time.sleep(2)
                        resume_attached = True # Mark resume as attached

                    except StaleElementReferenceException:
                        print(f"  • Warning: File input field '{label}' became stale during interaction, skipping.")
                    except InvalidArgumentException as e:
                         print(f"  • Error attaching resume to '{label}': InvalidArgumentException. This might mean the element is not ready or the path is incorrect. Error: {e}")
                    except Exception as e:
                        print(f"  • Failed to attach resume to '{label}': {e}")
                else:
                    # print(f"Ignoring file field '{label}' - not identified as resume/CV upload.") # Debugging
                    pass # Do nothing if not a resume/CV field

            except StaleElementReferenceException:
                print(f"  • Warning: File input element became stale before processing, skipping.")
            except Exception as e:
                 print(f"  • An unexpected error occurred while processing a file input element: {e}")

    except Exception as e:
        print(f"  • An error occurred while trying to find file input elements: {e}")


def main():
    # ▶︎ Configuration
    # IMPORTANT: Replace with the actual job application URL
    # Use the URL from the HTML snippet provided for testing custom dropdowns
    url = "https://boards.greenhouse.io/embed/job_app?token=7843495002" # Example URL from snippet context

    # Ensure resume.pdf is in the same directory as the script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    resume_filename = "resume.pdf"
    resume_path = os.path.join(script_dir, resume_filename)

    # Check if resume file exists
    if not os.path.exists(resume_path):
        print(f"Error: Resume file not found at '{resume_path}'. Please ensure '{resume_filename}' is in the script directory.")
        # Decide whether to exit or continue without resume upload
        # return # Uncomment to exit if resume is mandatory
    else:
        print(f"Using resume file from: {resume_path}")


    # ▶︎ Initialize Chrome
    driver = None
    try:
        print("Initializing Chrome WebDriver...")
        # Initialize ChromeOptions if needed (e.g., for headless, specific arguments)
        # options = webdriver.ChromeOptions()
        # options.add_argument("--headless") # Uncomment for headless mode
        driver = webdriver.Chrome() # Pass options=options if using ChromeOptions
        driver.maximize_window()
        print(f"Navigating to URL: {url}")
        driver.get(url)

        # Wait for the initial page to load and a form element to be present
        print("Waiting for the initial page to load and form to be present...")
        WebDriverWait(driver, 10).until(
             EC.presence_of_element_located((By.TAG_NAME, "form"))
        )
        print("Initial page loaded and form found.")
        time.sleep(2) # Give a little extra time for potential JavaScript rendering

        # ▶︎ Loop through pages until no Next/Continue button found
        page_num = 1
        while True:
            print(f"\n--- Processing Page {page_num} ---")

            # Fill the form on the current page
            fill_form_page(driver, resume_path)

            # Look for a "Next" or "Continue" button
            # Look for buttons or submit inputs with text or value containing "next" or "continue" (case-insensitive)
            next_button = None
            # XPath to find visible and enabled buttons/submit inputs with relevant text/value
            # Added space checks around text/value to avoid partial matches within words
            next_button_xpath = "//*[(self::button or (self::input and @type='submit')) and (contains(translate(concat(' ', normalize-space(.), ' '), ' ABCDEFGHIJKLMNOPQRSTUVWXYZ', ' abcd efghijklmnopqrstuvwxyz'), ' next ') or contains(translate(concat(' ', normalize-space(@value), ' '), ' ABCDEFGHIJKLMNOPQRSTUVWXYZ', ' abcd efghijklmnopqrstuvwxyz'), ' next ') or contains(translate(concat(' ', normalize-space(.), ' '), ' ABCDEFGHIJKLMNOPQRSTUVWXYZ', ' abcd efghijklmnopqrstuvwxyz'), ' continue ') or contains(translate(concat(' ', normalize-space(@value), ' '), ' ABCDEFGHIJKLMNOPQRSTUVWXYZ', ' abcd efghijklmnopqrstuvwxyz'), ' continue ')) and not(@disabled)]"


            print("Checking for Next/Continue button...")
            try:
                # Use find_elements to avoid immediate NoSuchElementException if button is absent
                potential_next_buttons = driver.find_elements(By.XPATH, next_button_xpath)

                # Find the first visible and enabled button
                for btn in potential_next_buttons:
                     if btn.is_displayed() and btn.is_enabled():
                         next_button = btn
                         break # Found a suitable next button

            except Exception as e:
                 print(f"  • Error while searching for potential next buttons: {e}")
                 # If finding elements fails broadly, assume no next button can be found
                 pass # Continue to check if next_button was found


            if next_button:
                btn_display_text = next_button.text or next_button.get_attribute("value") or "Next/Continue Button"
                print(f"Found '{btn_display_text.strip()}' button. Attempting to click...")
                try:
                    # Wait for the specific next button found to be clickable
                    WebDriverWait(driver, 10).until(
                         EC.element_to_be_clickable(next_button)
                    )
                    next_button.click()
                    print("Clicked Next/Continue button.")
                    page_num += 1
                    # Add a wait for the *next* page to load, e.g., wait for the form to reappear or a new element specific to the next page
                    print("Waiting for the next page to load...")
                    # Waiting for the form again is a general approach, but a more specific element is better if known.
                    WebDriverWait(driver, 20).until(
                         EC.presence_of_element_located((By.TAG_NAME, "form"))
                    )
                    print("Next page loaded.")
                    time.sleep(2) # Short sleep after load for stability

                    continue  # process the next page

                except StaleElementReferenceException:
                    print("  • Next/Continue button became stale before clicking, re-trying page processing.")
                    # If the button becomes stale right before clicking, the page might have already changed
                    # or be in the process. We can try to re-process the current (potentially new) page.
                    continue # Go to the next iteration of the main while loop

                except (TimeoutException, ElementClickInterceptedException) as e:
                    print(f"  • Failed to click next button within timeout or click intercepted: {e}")
                    print("Likely reached the last page or encountered an unclickable element. Stopping.")
                    break # Exit the loop if click fails

                except Exception as e:
                    print(f"  • An unexpected error occurred while trying to click the next button: {e}")
                    break # Exit the loop on unexpected errors

            else:
                print("\nNo clickable 'Next' or 'Continue' button found. Finished form automation or reached the end.")
                break # Exit the loop if no next button is found

    except WebDriverException as e:
        print(f"\nAn error occurred with the WebDriver: {e}")
        print("Please ensure ChromeDriver is correctly installed and in your system's PATH.")

    except Exception as e:
        print(f"\nAn unexpected error occurred: {e}")

    finally:
        # Keep the browser open for manual review
        if driver:
            print("\nForm filling complete. The browser will remain open for manual review.")
            print(f"Final URL: {driver.current_url}")
            input("Press ENTER in the console to close the browser and exit...")
            driver.quit()
        else:
             print("\nWebDriver was not initialized.")


if __name__ == "__main__":
    main()