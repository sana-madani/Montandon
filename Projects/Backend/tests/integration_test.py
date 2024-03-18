import pytest
import requests
import os
import json
from Projects.Backend.event_processing import initial_events, send_all

@pytest.fixture
def api_url():
    return "http://127.0.0.1:5000/"

def test_api_response(api_url):
    response = requests.get(api_url)
    data = response.json()

    script_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(script_dir)
    json_file_path = os.path.join(parent_dir, 'Example_Data', 'event_Level.json')
    geojson_file_path = os.path.join(parent_dir, 'Example_Data', 'hazard_Level.geojson')
    with open(json_file_path, 'r') as file1:
        data1 = json.load(file1)
    with open(geojson_file_path, 'r') as file2:
        data2 = json.load(file2)
    events = initial_events(data1, data2)
    backend_data = send_all(events)

    # test if api run
    assert response.status_code == 200
    # test if missed data
    assert len(data) == len(backend_data)





