# Responsive Design Testing
# Objective: Ensure the website's design adjusts properly across different screen sizes and devices.
# Tool: Chrome DevTools for manual testing and Selenium for automated tests.
# Method: Manually inspect the layout and functionality on various screen sizes using DevTools. Automate this process with Selenium by simulating different viewport sizes and recording any issues.

import pytest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

# define different size
@pytest.mark.parametrize("width, height", [(320, 480), (768, 1024), (1366, 768)])
def test_responsive_design(width, height):
    # set chrome options
    chrome_options = Options()
    chrome_options.add_argument(f"--window-size={width},{height}")

    driver = webdriver.Chrome(options=chrome_options)

    try:
        # check if page loading time
        start_time = time.time()
        driver.get("http://127.0.0.1:5500/Projects/Frontend/landing_page/index.html")
        end_time = time.time()
        load_time = end_time - start_time
        assert load_time < 10

        # check if displayed correctly
        assert "Landing Page" in driver.title

        # check if the link is available
        link1 = driver.find_element(By.LINK_TEXT, "Events")
        link1.click()
        assert "Interactive Mapping" in driver.title

        link2 = driver.find_element(By.LINK_TEXT, "Facts")
        link2.click()
        assert "Facts" in driver.title

        # Check whether a horizontal scroll bar appears on the page
        body = driver.find_element(By.TAG_NAME,"body")
        assert body.size['width'] <= driver.execute_script("return document.documentElement.clientWidth")

    finally:
        driver.quit()
