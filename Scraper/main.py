from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from typing import Optional
from pymongo import MongoClient
from string import Template
from string import ascii_lowercase
import time
import re

def setup_driver():
    # Setup Chrome driver with basic options
    options = webdriver.ChromeOptions()
    options.add_argument('--disable-notifications')  # Disable browser notifications
    options.add_argument('--start-maximized')  # Start with maximized browser
    return webdriver.Chrome(options=options)


def wait_and_click(driver, selector, by=By.CSS_SELECTOR, timeout=10):
    # Wait for element and click it safely
    try:
        element = WebDriverWait(driver, timeout).until(
            EC.element_to_be_clickable((by, selector))
        )
        element.click()
        return True
    
    except TimeoutException:
        print(f"Timeout waiting for element: {selector}")
        return False
    
    except Exception as e:
        print(f"Error clicking element: {selector}")
        print(f"Error details: {str(e)}")
        return False
    
    
def find_element_on_page(driver, selector, by: By = By.CSS_SELECTOR, timeout: int = 10) -> Optional[webdriver.remote.webelement.WebElement]:
    # Find the element and return it
    try:
        WebDriverWait(driver, timeout).until(
            EC.presence_of_element_located((by, selector))
        )
        
        element = driver.find_element(by=by, value=selector)
        print(f"Successfully found element: {selector}")
        return element
        
    except NoSuchElementException:
        print(f"Element not found: {selector}")
        return None
        
    except TimeoutException:
        print(f"Timeout waiting for element: {selector}")
        return None
    
    except Exception as e:
        print(f"Error finding element {selector}: {str(e)}")
        return None
    
    
def find_all_elements_on_page(driver, selector, by: By = By.CSS_SELECTOR, timeout: int = 10) -> Optional[webdriver.remote.webelement.WebElement]:
    # Find the element and return it
    try:
        WebDriverWait(driver, timeout).until(
            EC.presence_of_element_located((by, selector))
        )
        
        elements = driver.find_elements(by=by, value=selector)
        print(f"Successfully found element: {selector}")
        return elements
        
    except NoSuchElementException:
        print(f"Element not found: {selector}")
        return None
        
    except TimeoutException:
        print(f"Timeout waiting for element: {selector}")
        return None
    
    except Exception as e:
        print(f"Error finding element {selector}: {str(e)}")
        return None
    
    
def is_element_clickable(element: WebElement, timeout: int = 10) -> bool:
    # Check if the element is clickable
    try:
        if not element:
            print("Element is None")
            return False
            
        if not element.is_displayed():
            print("Element is not displayed")
            return False
        
        if not element.is_enabled():
            print("Element is not enabled")
            return False
            
        return True
        
    except Exception as e:
        print(f"Error checking element clickability: {str(e)}")
        return False
    
    
def safe_click(element: WebElement) -> bool:
    # Safely click the element
    try:
        element.click()
        print("Successfully clicked element")
        return True
    
    except Exception as e:
        print(f"Error clicking element: {str(e)}")
        return False
    

def get_brand(textlist):
    # Get correct manufacturer of the medicine
    if(textlist[2] == 'Prescription Required'):
        return textlist[4]
    return textlist[3]


def get_comp(textlist):
    # Get correct salt composition of the medicine
    if(textlist[2] == 'Prescription Required'):
        return textlist[5]
    return textlist[4]
    
    
def get_type(name, datatypes):
    # Get the type of medicine (datatypes -> Solid, Liquid, Dermal, Injection, Device)
    for datatype in datatypes:
        for key, value in datatype.items():
            for v in value:
                if re.search(v, name, re.IGNORECASE):
                    return key
    return None
                
                
def get_qty(textlist, med_type):
    # Get the quantity in 1 unit
    if med_type == "Injection" or med_type == "Device":
        return 1
    
    text = ''
    if(textlist[2] == 'Prescription Required'):
        text = textlist[3]
    else:
        text = textlist[2]
    
    textArray = text.split()
    for item in textArray:
        if(item.isnumeric()):
            return int(item)
        
    return 1
        
        
def get_unit(med_type):
    # Get the unit of medicine
    match med_type:
        case 'Solid':
            return 'pill'
        case 'Liquid':
            return 'ml'
        case 'Injection':
            return 'vial'
        case 'Topical':
            return 'gm'
        case 'Device':
            return 'unit'
        case _:
            return None
    
    
def scrape_current_page(driver, datatypes, collection):
    # scrape the current webpage
    item_selector = "style__product-card___1gbex"
    
    elements = find_all_elements_on_page(driver, item_selector, By.CLASS_NAME)
    
    for element in elements:
        text = element.text.strip()
        textList = text.splitlines()
        
        name = textList[0]                      # name of the product
        price = textList[1].split("₹")[1]       # price of 1 selling unit
        brand = get_brand(textList)             # name of manufacturer
        comp = get_comp(textList)               # salt composition
        med_type = get_type(name, datatypes)    # medicine type
        qty = get_qty(textList, med_type)       # quantity of 1 unit
        unit = get_unit(med_type)               # unit of quantity(pill, ml, gm, etc.)
        
        newItem = {
            'name': name, 
            'price': price,
            'brand': brand,
            'composition': comp,
            'type': med_type, 
            'quantity': qty,
            'unit': unit
        }
        
        if collection.find_one({"name": name}) == None:
            collection.insert_one(newItem)
        
    return
    

def main():
    driver = None
    
    # Type classifier dataset
    datatypes = [   
        {'Solid': ['Tablet', 'Capsule', 'Lozenge', 'Kit', 'Rotacap', 'Instacap', 'Testocap', 'Octacap', 'Respule', 'Combipack', 'Suppository', 'Smartule', 'Pastille']},
        {'Liquid': ['Syrup', 'Solution', 'Expectorant', 'Suspension', 'Drop', 'Liquid', 'Emulsion', 'Lacquer', 'Linctus', 'Readymix', 'Redimix', 'Shampoo', 'Mouth Wash', 'Gargle']},
        {'Injection': ['Injection', 'Vaccine', 'Syringe']},
        {'Topical': ['Cream', 'Gel', 'Ointment', 'Lotion', 'Soap', 'Sachet', 'Paste', 'Powder', 'Jelly', 'Granule']},
        {'Device': ['Penfill', 'Cartridge', 'Infusion', 'Inhaler', 'Spray', 'Flexpen']}
    ]
    
    try:
        # Setup database and connection
        client = MongoClient("localhost", 27017)
        db = client.tempMeds
        collection = db.medicines
        
        # Setup driver
        driver = setup_driver()
        driver.implicitly_wait(5)

        # Navigate to website
        print("Navigating to 1mg.com...")
        url = Template('https://www.1mg.com/drugs-all-medicines?label=$x')     # Get current alphabet's webpage
        driver.get(url.substitute({'x': 'A'}))

        # Close popup asking to update location
        popup_selector = ".UpdateCityModal__cancel-btn___2jWwS"  
        success = wait_and_click(driver, popup_selector)
        if(success):
            print("Popup Closed")          
               
        # implement loop to go through all alphabets
        for char in ascii_lowercase:
        
            for i in range(1):  # Loop to scrape multiple times(3)
                # Get the webpage of 
                driver.get(url.substitute({'x': char}))  
                
                # Get no of pages
                pageNavigation = find_element_on_page(driver, ".list-pagination")
                lastPage = pageNavigation.find_element(By.XPATH, "./*[last()-1]")
                noOfPages = int(lastPage.text)
                
                for j in range(noOfPages): # Replace constant with 'noOfPages' var
                    # Wait for new page to load in
                    time.sleep(4)
                    
                    # Scrape the current page
                    scrape_current_page(driver, datatypes, collection)
                    
                    # Go to next page
                    next_button =  find_element_on_page(driver, "Next >", By.LINK_TEXT)
                    safe_click(next_button)

    except Exception as e:
        print(f"An error occurred: {str(e)}")
    
    finally:
        # Clean up
        if driver:
            print("Closing browser...")
            driver.quit()

if __name__ == "__main__":
    main()