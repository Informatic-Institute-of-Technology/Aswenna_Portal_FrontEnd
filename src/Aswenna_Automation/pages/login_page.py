from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class LoginPage:
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(self.driver, 20)

        self.EMAIL_FIELD = (By.XPATH, "//input[@type='email' or contains(@placeholder, 'email')]")
        self.PASS_FIELD = (By.XPATH, "//input[@type='password']")
        self.LOGIN_BTN = (By.XPATH, "//button[contains(., 'Login')]")
        self.SIGNUP_LINK = (By.XPATH, "//span[contains(text(), 'Sign Up')] | //a[contains(text(), 'Sign Up')]")

    def go_to_signup(self):
        element = self.wait.until(EC.element_to_be_clickable(self.SIGNUP_LINK))
        self.driver.execute_script("arguments[0].click();", element)

    def login(self, email, password):
        email_input = self.wait.until(EC.presence_of_element_located(self.EMAIL_FIELD))
        email_input.clear()
        email_input.send_keys(email)
        

        pass_input = self.driver.find_element(*self.PASS_FIELD)
        pass_input.clear()
        pass_input.send_keys(password)
        
        btn = self.driver.find_element(*self.LOGIN_BTN)
        self.driver.execute_script("arguments[0].click();", btn)