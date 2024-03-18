import pytest
import requests
import os
import json
from Projects.Backend.event_processing import initial_events, send_all
import time
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import WebDriverException

@pytest.fixture
def api_url():
    return "http://127.0.0.1:5000/"

def test_api_response(api_url):
    response = requests.get(api_url)
    data = response.json()
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_file_path = os.path.join(script_dir, 'Example_Data', 'event_Level.json')
    geojson_file_path = os.path.join(script_dir, 'Example_Data', 'hazard_Level.geojson')
    with open(json_file_path, 'r') as file1:
        data1 = json.load(file1)
    with open(geojson_file_path, 'r') as file2:
        data2 = json.load(file2)
    events = initial_events(data1, data2)
    backend_data = send_all(events)
    print(data)
    print("----------")
    print(backend_data)

    assert response.status_code == 200


@pytest.fixture
def browser():
    driver = webdriver.Chrome()
    yield driver
    driver.quit()

def test_search_jump_to_home(browser):
    browser.get("http://127.0.0.1:5500/Projects/Frontend/landing_page/")
    home_link = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.LINK_TEXT, "Home"))
    )
    # click the link
    home_link.click()
    assert "Landing Page" in browser.title


def test_search_jump_to_events(browser):
    browser.get("http://127.0.0.1:5500/Projects/Frontend/landing_page/")
    events_link = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.LINK_TEXT, "Events"))
    )
    # click the link
    events_link.click()
    assert "Interactive Mapping" in browser.title


def test_search_jump_to_summary_mapping(browser):
    browser.get("http://127.0.0.1:5500/Projects/Frontend/landing_page/")
    summary_mapping_link = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.LINK_TEXT, "Summary Mapping"))
    )
    # click the link
    summary_mapping_link.click()
    assert "Summary Mapping" in browser.title


def test_search_jump_to_teams_partners(browser):
    browser.get("http://127.0.0.1:5500/Projects/Frontend/landing_page/")
    teams_partners_link = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.LINK_TEXT, "Teams & Partners"))
    )
    # click the link
    teams_partners_link.click()
    assert "Teams & Partners" in browser.title


def test_search_jump_to_facts(browser):
    browser.get("http://127.0.0.1:5500/Projects/Frontend/landing_page/")
    facts_link = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.LINK_TEXT, "Facts"))
    )
    facts_link.click()
    # h1_element = WebDriverWait(browser, 10).until(
    #     EC.presence_of_element_located((By.TAG_NAME, "h1"))
    # )
    assert "Facts" in browser.title


def test_director_in_list(browser):
    browser.get("http://127.0.0.1:5500/Projects/Frontend/mapping_detail/HTML/interactive_mapping.html")
    event_link = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.LINK_TEXT, "Events"))
    )
    event_link.click()
    assert "Interactive Mapping" in browser.title

    home_link = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.LINK_TEXT, "Home"))
    )
    home_link.click()
    assert "Landing Page" in browser.title


def test_director_in_detail(browser):
    browser.get("http://127.0.0.1:5500/Projects/Frontend/mapping_detail/HTML/interactive_mapping.html")
    clickable_element = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.CLASS_NAME, "clickable-name"))
    )
    click_name = clickable_element.text
    clickable_element.click()
    detail_container = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.ID, "disasterDetail"))
    )
    self_link = detail_container.find_element(By.CLASS_NAME, "clickable-name")
    self_link.click()
    h2_element = detail_container.find_element(By.TAG_NAME, 'h2').text
    assert h2_element == "Disaster Detail"

    event_link = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.LINK_TEXT, "Events"))
    )
    event_link.click()
    assert "Interactive Mapping" in browser.title

    home_link = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.LINK_TEXT, "Home"))
    )
    home_link.click()
    assert "Landing Page" in browser.title


def test_click_single_event(browser):
    browser.get("http://127.0.0.1:5500/Projects/Frontend/mapping_detail/HTML/interactive_mapping.html")
    clickable_element = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.CLASS_NAME, "clickable-name"))
    )
    clickable_element.click()
    list_container = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.ID, "disasterList"))
    )
    detail_container = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.ID, "disasterDetail"))
    )
    display_value1 = list_container.value_of_css_property("display")
    display_value2 = detail_container.value_of_css_property("display")
    assert display_value1 == "none"
    assert display_value2 == "flex"


def test_list_displayed(browser):
    browser.get("http://127.0.0.1:5500/Projects/Frontend/mapping_detail/HTML/interactive_mapping.html")
    list_container = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.ID, "disasterList"))
    )
    detail_container = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.ID, "disasterDetail"))
    )
    display_value1 = list_container.value_of_css_property("display")
    display_value2 = detail_container.value_of_css_property("display")
    assert display_value1 == "block"
    assert display_value2 == "none"

def test_country_search(browser):
    browser.get("http://127.0.0.1:5500/Projects/Frontend/mapping_detail/HTML/interactive_mapping.html")
    search_box = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.ID, "All CountriesInput"))
    )
    search_box.send_keys("India")
    time.sleep(3)

    container_element = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.ID, "disasterList"))
    )
    tbody_element = container_element.find_element(By.TAG_NAME,"table")
    # get all <tr> element
    tr_elements = tbody_element.find_elements(By.TAG_NAME, "tr")
    # calculate the number of <tr> element
    for tr in tr_elements:
        # search td element
        td_elements = tr.find_elements(By.TAG_NAME, "td")
        # print each td element text
        if len(td_elements) == 5:
            assert td_elements[2].text == "India"

    def test_country_search(browser):
        browser.get("http://127.0.0.1:5500/Projects/Frontend/mapping_detail/HTML/interactive_mapping.html")
        search_box = WebDriverWait(browser, 10).until(
            EC.presence_of_element_located((By.ID, "All CountriesInput"))
        )
        search_box.send_keys("India")
        time.sleep(1)
        container_element = WebDriverWait(browser, 10).until(
            EC.presence_of_element_located((By.ID, "disasterList"))
        )
        tbody_element = container_element.find_element(By.TAG_NAME, "table")
        # get all <tr> element
        tr_elements = tbody_element.find_elements(By.TAG_NAME, "tr")
        # calculate the number of <tr> element
        for tr in tr_elements:
            # search td element
            td_elements = tr.find_elements(By.TAG_NAME, "td")
            # print each td element text
            if len(td_elements) == 5:
                assert td_elements[2].text == "India"

def test_type_search(browser):
    browser.get("http://127.0.0.1:5500/Projects/Frontend/mapping_detail/HTML/interactive_mapping.html")
    search_box = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.ID, "All Disaster TypesInput"))
    )
    search_box.send_keys("Earthquake")
    time.sleep(1)
    container_element = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.ID, "disasterList"))
    )
    tbody_element = container_element.find_element(By.TAG_NAME, "table")
    # get all <tr> element
    tr_elements = tbody_element.find_elements(By.TAG_NAME, "tr")
    # calculate the number of <tr> element
    for tr in tr_elements:
        # search td element
        td_elements = tr.find_elements(By.TAG_NAME, "td")
        # print each td element text
        if len(td_elements) == 5:
            assert td_elements[1].text == "Earthquake"

def test_time_before_search(browser):
    browser.get("http://127.0.0.1:5500/Projects/Frontend/mapping_detail/HTML/interactive_mapping.html")
    search_box = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.ID, "Start BeforeInput"))
    )
    search_box.send_keys("002020-03-14")
    date2 = datetime.strptime("2020-03-14", "%Y-%m-%d").date()
    time.sleep(1)
    container_element = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.ID, "disasterList"))
    )
    tbody_element = container_element.find_element(By.TAG_NAME, "table")
    # get all <tr> element
    tr_elements = tbody_element.find_elements(By.TAG_NAME, "tr")
    # calculate the number of <tr> element
    for tr in tr_elements:
        # search td element
        td_elements = tr.find_elements(By.TAG_NAME, "td")
        # print each td element text
        if len(td_elements) == 5:
            date1 = datetime.strptime(td_elements[3].text, "%Y-%m-%d").date()
            assert (date1 < date2)

def test_time_after_search(browser):
    browser.get("http://127.0.0.1:5500/Projects/Frontend/mapping_detail/HTML/interactive_mapping.html")
    search_box = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.ID, "Start AfterInput"))
    )
    search_box.send_keys("002018-12-04")
    date2 = datetime.strptime("2018-12-04", "%Y-%m-%d").date()
    time.sleep(1)
    container_element = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.ID, "disasterList"))
    )
    tbody_element = container_element.find_element(By.TAG_NAME, "table")
    # get all <tr> element
    tr_elements = tbody_element.find_elements(By.TAG_NAME, "tr")
    # calculate the number of <tr> element
    for tr in tr_elements:
        # search td element
        td_elements = tr.find_elements(By.TAG_NAME, "td")
        # print each td element text
        if len(td_elements) == 5:
            date1 = datetime.strptime(td_elements[3].text, "%Y-%m-%d").date()
            assert (date1 > date2)


def test_pagination(browser):
    browser.get("http://127.0.0.1:5500/Projects/Frontend/mapping_detail/HTML/interactive_mapping.html")
    pagination_container = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.ID, "paginationContainer"))
     )
    pagination_number = len(pagination_container.find_elements(By.TAG_NAME,"li"))
    for i in range(1, pagination_number + 1):
        click_pagination = pagination_container.find_element(By.LINK_TEXT, str(i))
        click_pagination.click()
        click_pagination = pagination_container.find_element(By.LINK_TEXT, str(i))
        assert click_pagination.get_attribute("class") == "active"


