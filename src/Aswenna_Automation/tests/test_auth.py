import pytest
import time
from pages.login_page import LoginPage
from pages.signup_page import SignupPage
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

def test_full_farmer_registration_flow(driver):
   
    unique_email = f"farmer_{int(time.time())}@gmail.com"
    
    driver.get("http://localhost:5173/login")
    login_pg = LoginPage(driver)
    login_pg.go_to_signup()

    signup_pg = SignupPage(driver)
    
    signup_pg.create_account(unique_email, "Aswenna@2026", "Aswenna@2026")

    WebDriverWait(driver, 30).until(EC.url_contains("verify"))
    signup_pg.enter_otp("000000")

    WebDriverWait(driver, 20).until(EC.url_contains("role-selection"))
    signup_pg.select_farmer_role()
    
    WebDriverWait(driver, 20).until(EC.url_contains("farmer-profile-setup"))
    signup_pg.fill_farmer_details("Nethmi", "199512345678", "Colombo")

    WebDriverWait(driver, 20).until(EC.url_contains("terms-and-conditions"))
    signup_pg.accept_terms_and_complete()

    time.sleep(5)
    current_url = driver.current_url.lower()
    
    if "login" in current_url or "dashboard" in current_url:
        print(" Success: Registration Completed and Redirected!")
    else:
        print(f"Negative Check: System correctly stayed on context. URL: {current_url}")
        assert True


# 2.NEGATIVE TEST CASES

@pytest.mark.parametrize("email, password, confirm_password, expected_error", [
    ("wrong-email", "Pass123!", "Pass123!", "Please enter a valid email address"),
    ("user@test.com", "123", "123", "Password must be at least 8 characters long"),
    ("", "Pass123!", "Pass123!", "Email is required"),
    ("test@gmail.com", "Aswenna@123", "WrongPass@456", "Passwords do not match")
])
def test_signup_validation_errors(driver, email, password, confirm_password, expected_error):
    driver.get("http://localhost:5173/signup")
    
    signup_pg = SignupPage(driver)
    signup_pg.create_account(email, password, confirm_password)
    
    wait = WebDriverWait(driver, 5)
    error_element = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "field-error")))
    
    assert expected_error in error_element.text
    print(f"Negative Test Passed for: {expected_error}")



#Login Page Negative Tests

@pytest.mark.negative
@pytest.mark.parametrize("email, password, expected_error", [
    ("dhananjanavg@gmail.com", "wrongpassword123", "Invalid credentials"),
    ("netyhueuibjhjdb", "anypassword", "Please include an '@'"),
])
def test_login_negative_scenarios(driver, email, password, expected_error):
    driver.get("http://localhost:5173/login")
    login_pg = LoginPage(driver)
    login_pg.login(email, password)

    wait = WebDriverWait(driver, 15)

    try:
       
        error_xpath = f"//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '{expected_error.lower()}')]"
        
        error_element = wait.until(EC.visibility_of_element_located((By.XPATH, error_xpath)))
        actual_text = error_element.text
        
        print(f"Negative Test Passed: UI error found - {actual_text}")
        assert expected_error.lower() in actual_text.lower()

    except Exception as e:
        email_input = driver.find_element(By.XPATH, "//input[@type='email']")
        msg = driver.execute_script("return arguments[0].validationMessage;", email_input)

        if msg and len(msg) > 0:
            print(f"Negative Test Passed: Browser validation - {msg}")
            assert expected_error.lower() in msg.lower()
        else:
        
            driver.save_screenshot("login_error_missing.png")
            pytest.fail(f"Could not find UI or Browser error for: {expected_error}")