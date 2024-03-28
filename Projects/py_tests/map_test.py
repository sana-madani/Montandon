import pytest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

@pytest.fixture
def browser():
    driver = webdriver.Chrome()
    yield driver
    driver.quit()

def test_map_initialization_and_marker_placement(browser):
    browser.get("http://127.0.0.1:5500/Projects/Frontend/mapping_detail/HTML/interactive_mapping.html")
    pagination_container = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.ID, "paginationContainer"))
    )
    pagination_number = len(pagination_container.find_elements(By.TAG_NAME, "li"))
    for i in range(1, pagination_number + 1):  # loop the pagination
        pagination_container = WebDriverWait(browser, 10).until(
            EC.presence_of_element_located((By.ID, "paginationContainer"))
        )
        click_pagination = pagination_container.find_element(By.LINK_TEXT, str(i))
        click_pagination.click()
        disaster_list_container = browser.find_element(By.ID, "disasterList")
        disasters = disaster_list_container.find_elements(By.CLASS_NAME, "clickable-name")
        for j in range(len(disasters)):  # loop the disaster list
            disaster_list_container = browser.find_element(By.ID, "disasterList")
            disasters = disaster_list_container.find_elements(By.CLASS_NAME, "clickable-name")
            single_disaster = disasters[j]
            single_disaster.click()
            time.sleep(0.5)
            map_container = browser.find_element(By.ID, "mapContainer")
            assert map_container.is_displayed(), "Map Container load failed"
            back = WebDriverWait(browser, 10).until(
                EC.visibility_of_element_located((By.LINK_TEXT, "Events"))
            )
            back.click()
            time.sleep(0.5)
