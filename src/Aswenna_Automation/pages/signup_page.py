from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
import time

class SignupPage:
    def __init__(self, driver):
        self.driver = driver

    def create_account(self, email, password, confirm_password):
        wait = WebDriverWait(self.driver, 20)
        wait.until(EC.presence_of_element_located((By.XPATH, "//input[contains(@placeholder, 'farmer@example.com')]"))).send_keys(email)
        self.driver.find_element(By.XPATH, "//input[@placeholder='Enter your password']").send_keys(password)
        self.driver.find_element(By.XPATH, "//input[@placeholder='Re-enter your password']").send_keys(confirm_password)
        btn = self.driver.find_element(By.XPATH, "//button[contains(., 'Sign up!')]")
        self.driver.execute_script("arguments[0].click();", btn)

    def enter_otp(self, otp_code="000000"):
        otp_inputs = WebDriverWait(self.driver, 25).until(EC.presence_of_all_elements_located((By.XPATH, "//input[@type='text' or @type='number']")))
        for i in range(len(otp_code)):
            otp_inputs[i].send_keys(otp_code[i])
        verify_btn = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Verify')]")
        self.driver.execute_script("arguments[0].click();", verify_btn)

    def select_farmer_role(self):
        farmer_btn = WebDriverWait(self.driver, 20).until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Farmer')]")))
        self.driver.execute_script("arguments[0].click();", farmer_btn)

    def fill_farmer_details(self, name, nic, city):
        wait = WebDriverWait(self.driver, 30)
        
        # 1. Personal & Address Details
        wait.until(EC.presence_of_element_located((By.XPATH, "//label[contains(text(), 'Full Name')]/..//input"))).send_keys(name)
        self.driver.find_element(By.XPATH, "//label[contains(text(), 'National ID Number')]/..//input").send_keys(nic)
        self.driver.find_element(By.XPATH, "//label[contains(text(), 'Phone Number')]/..//input").send_keys("0771234567")
        self.driver.find_element(By.XPATH, "//label[contains(text(), 'Street Address')]/..//input").send_keys("57, Ramakrishna Road")
        self.driver.find_element(By.XPATH, "//label[contains(text(), 'City / Town')]/..//input").send_keys(city)
        
        print("Waiting for Province and District selection.")
        time.sleep(10) 
        
        try:
            self._auto_select_division("District Secretariat")
            time.sleep(3)
            self._auto_select_division("Grama Niladhari")
        except:
            print(" Administrative divisions loading issue. Please check manually.")

        self._upload_documents()

        time.sleep(4) 
        complete_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Complete Registration')]")))
        self.driver.execute_script("arguments[0].click();", complete_btn)

    def _auto_select_division(self, label_text):
        wait = WebDriverWait(self.driver, 15)

        div_box = wait.until(EC.presence_of_element_located((By.XPATH, f"//label[contains(text(), '{label_text}')]/..//div[@role='combobox']")))
        self.driver.execute_script("arguments[0].click();", div_box)
        time.sleep(2)
 
        option = wait.until(EC.presence_of_element_located((By.XPATH, "//li[@role='option']")))
        self.driver.execute_script("arguments[0].click();", option)

    def _upload_documents(self):
        print("Attempting to upload documents...")

        current_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(os.path.dirname(current_dir), "assets", "sample_nic.pdf")
        
        if os.path.exists(file_path):
            file_inputs = self.driver.find_elements(By.XPATH, "//input[@type='file']")
            for inp in file_inputs:
    
                self.driver.execute_script(
                    "arguments[0].style.display = 'block'; arguments[0].style.opacity = '1'; arguments[0].style.visibility = 'visible'; arguments[0].style.height = '1px'; arguments[0].style.width = '1px';", 
                    inp
                )
                inp.send_keys(file_path)
                time.sleep(1.5)
            print(" Documents uploaded successfully.")
        else:
            print(f" File NOT found at {file_path}!")

    def accept_terms_and_complete(self):
        wait = WebDriverWait(self.driver, 20)
        checkbox = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='checkbox']")))
        self.driver.execute_script("arguments[0].click();", checkbox)
        time.sleep(1)
        finish_btn = self.driver.find_element(By.XPATH, "//button[contains(., 'Complete Signup')]")
        self.driver.execute_script("arguments[0].click();", finish_btn)