# Compatibility Testing
# Objective: Ensure the website works across different web browsers and versions.
# Tool: BrowserStack or LambdaTest.
# Method: Run tests on different browsers (Chrome, Firefox, Edge, Safari) to check for any compatibility issues.

import pytest
print(pytest.__file__)
from selenium import webdriver

# define the browser example
@pytest.mark.parametrize("browser", ["chrome", "firefox"])#, "edge", "safari"])
def test_compatibility(browser):
    if browser == "chrome":
        driver = webdriver.Chrome()
    elif browser == "firefox":
        driver = webdriver.Firefox()
    # elif browser == "edge":
    #     driver = webdriver.Edge()
    # elif browser == "safari":
    #     driver = webdriver.Safari()
    else:
        raise ValueError("Unsupported browser: {}".format(browser))

    driver.get("http://127.0.0.1:5500/Projects/Frontend/landing_page/index.html")
    assert "Landing Page" in driver.title
    driver.quit()
