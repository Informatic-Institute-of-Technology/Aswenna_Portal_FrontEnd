from selenium.webdriver.common.by import By

class LoginPage:
    def __init__(self, driver):
        self.driver = driver
        self.EMAIL_FIELD = (By.XPATH, "//input[@type='email' or contains(@placeholder, 'gmail')]")
        self.PASS_FIELD = (By.XPATH, "//input[@type='password']")
        self.LOGIN_BTN = (By.XPATH, "//button[text()='Login']")
        self.SIGNUP_LINK = (By.LINK_TEXT, "Sign Up")

    def go_to_signup(self):
        self.driver.find_element(*self.SIGNUP_LINK).click()

    def login(self, email, password):
        self.driver.find_element(*self.EMAIL_FIELD).send_keys(email)
        self.driver.find_element(*self.PASS_FIELD).send_keys(password)
        self.driver.find_element(*self.LOGIN_BTN).click()