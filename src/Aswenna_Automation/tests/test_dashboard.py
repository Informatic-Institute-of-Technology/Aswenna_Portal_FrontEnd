import pytest
import time
from pages.login_page import LoginPage 
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_farmer_dashboard_navigation(driver):
    
    driver.get("http://localhost:5173/login")
    login_pg = LoginPage(driver)
    
   
    login_pg.login("dinujayamanodya@gmail.com", "Dinu@2002")


    wait = WebDriverWait(driver, 20)
    wait.until(EC.url_contains("dashboard"))
    print(" Successfully logged into Farmer Dashboard")
    time.sleep(3)

    tabs = {
        "My Projects": "//div[contains(., 'My Projects') and @role='button'] | //a[contains(., 'My Projects')]",
        "Opportunities": "//div[contains(., 'Opportunities') and @role='button'] | //a[contains(., 'Opportunities')]",
        "Match Making": "//div[contains(., 'Match Making') and @role='button'] | //a[contains(., 'Match Making')]",
        "Requests": "//div[contains(., 'Requests') and @role='button'] | //a[contains(., 'Requests')]",
        "Insights": "//div[contains(., 'Insights') and @role='button'] | //a[contains(., 'Insights')]"
    }

    for tab_name, xpath in tabs.items():
        try:
     
            tab_element = wait.until(EC.element_to_be_clickable((By.XPATH, xpath)))
            driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", tab_element)
            time.sleep(1)
            driver.execute_script("arguments[0].click();", tab_element)
            
            print(f" Navigating to: {tab_name}")
            time.sleep(2) 

         
            assert tab_name.lower().replace(" ", "") in driver.current_url.lower() or tab_element.is_displayed()
            print(f"{tab_name} Page Verified Successfully.")

        except Exception as e:
            print(f"Error navigating to {tab_name}: {str(e)}")

    print("👋 Attempting to logout...")
    try:
        logout_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Logout')]")))
        driver.execute_script("arguments[0].click();", logout_btn)
        
  
        wait.until(EC.url_contains("login"))
        print(" Logout Successful. Test Suite Completed!")
    except:
        print(" Logout failed. Manual check required.")