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




    # 等待地图加载完成


    # 验证地图是否成功初始化
    # assert "Leaflet" in browser.title
    #
    # # 获取所有标记元素
    # markers = browser.find_elements(By.CLASS_NAME, "leaflet-marker-icon")
    #
    # # 验证是否有标记被放置在地图上
    # assert len(markers) > 0
    #
    # # 获取第一个标记的位置
    # first_marker = markers[0]
    # action = ActionChains(browser)
    # action.move_to_element(first_marker).perform()
    #
    # # 等待标记信息框出现
    # info_box = WebDriverWait(browser, 10).until(
    #     EC.visibility_of_element_located((By.CLASS_NAME, "leaflet-popup"))
    # )
    #
    # # 验证标记信息框中是否包含预期的内容
    # assert "Marker Info" in info_box.text
