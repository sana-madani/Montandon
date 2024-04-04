# test_main.py
import pytest
import sys
import os

script_dir = os.path.dirname(os.path.realpath(__file__))
backend_dir = os.path.join(script_dir, '../Backend')
sys.path.append(backend_dir)

from event_processing import initial_event_Level, initial_hazard_Level, initial_events, send_all, send_selected
from data_processing import check_country, check_disaster_types, check_date_before, check_date_after, sort_events_by_date

def test_initial_event_Level():
    # Test initial_event_Level function
    result = initial_event_Level(mock_events)
    assert len(result) == 3
    assert result['0001']['name'] == 'Event 1'
    assert result['0002']['country'] == 'UK'
    assert result['0003']['start_date'] == '2022-03-01'
    assert result['0003']['finish_date'] == '2022-03-20'


def test_hazard_Level():
    result = initial_hazard_Level(mock_hazards)
    # use sample_data to test
    assert len(result) == 3  # Same ID will be combined
    assert result['0001']['max_value'] == '1 unit1'  # normal check
    assert result['0002']['max_value'] == '---'  # do not have max value


def test_initial_events():
    result = initial_events(mock_events,mock_hazards)
    assert len(result) == 3
    assert result[0].id == '0001'
    assert result[0].type == 'Tropical cyclone'


def test_send_all():
    events = initial_events(mock_events,mock_hazards)
    result = send_all(events)
    assert len(result) == len(events) + 1


def test_send_selected():
    events = initial_events(mock_events,mock_hazards)
    data_from_frontend1 = {"Start AfterInput": "2021-12-31",
                          "Start BeforeInput": "",
                          "All CountriesInput": "USA",
                          "All Disaster TypesInput": "Tropical cyclone"}

    data_from_frontend2 = {"Start AfterInput": "",
                          "Start BeforeInput": "",
                          "All CountriesInput": "",
                          "All Disaster TypesInput": ""}
    result1 = send_selected(events, data_from_frontend1)
    result2 = send_selected(events, data_from_frontend2)
    assert result1[1]['id'] == '0001'
    assert len(result2) == 4


def test_sort_events_by_date():
    # Test sort_events_by_date function
    events = initial_events(mock_events, mock_hazards)
    result = sort_events_by_date(events)
    # date is already in order
    assert result == events


def test_check_date_after():
    # Test check_date_after function
    events = initial_events(mock_events, mock_hazards)
    result = check_date_after(events, '2022-01-30')
    assert len(result) == 2

def test_check_date_before():
    # Test check_date_before function
    events = initial_events(mock_events, mock_hazards)
    result = check_date_before(events, '2023-01-01')
    assert len(result) == 3

def test_check_country():
    # Test check_country function
    events = initial_events(mock_events, mock_hazards)
    result = check_country(events, 'USA')
    assert len(result) == 1
    assert result[0].id == '0001'

def test_check_disaster_types():
    # Test check_disaster_types function
    events = initial_events(mock_events, mock_hazards)
    result = check_disaster_types(events, 'Earthquake')
    assert len(result) == 1
    assert result[0].id == '0002'



mock_events = [{
    'event_ID': "0001",
    'ev_name': 'Event 1',
    'Country': 'USA',
    'ev_sdate': '2022-01-01',
    'ev_fdate': '2022-01-10',
    "imp_type": "Deaths",
    "exp_specs": "People",
    "imptypdeat": "100"
},{
    'event_ID': "0002",
    'ev_name': 'Event 2',
    'Country': 'UK',
    'ev_sdate': '2022-02-01',
    'ev_fdate': '2022-02-10',
    "imp_type": "Missing",
    "exp_specs": "People",
    "imptypmiss": "1000"
},{
    'event_ID': "0003",
    'ev_name': 'Event 3',
    'Country': 'China',
    'ev_sdate': '2022-03-01',
    'ev_fdate': '2022-03-20',
    "imp_type": "Injured",
    "exp_specs": "People",
    "imptypinju": "3000"
}]

mock_hazards = {'features': [{'properties': {
                                    'event_ID': '0001',
                                    'polygonlabel': 'green',
                                    'haz_maxvalue': '1',
                                    'haz_maxunit_code': 'unit1',
                                    'haz_Ab': 'TC',
                                    'haz_Continent': 'continent1',
                                    'haz_WorldBankIncomeGroups': 'low',
                                    'haz_spat_fileloc': '@ucl.ac.uk',
                                    'haz_srcdb_URL': 'www.ucl.com'},
                            'geometry':
                                    {'type':'Multipolygon',
                                    'coordinates': [[1,2],[2,3]]
                                    }},
                            {'properties': {
                                'event_ID':'0001',
                                'polygonlabel':'orange',
                                'haz_maxvalue':'1',
                                'haz_maxunit_code':'unit1',
                                'haz_Ab':'TC',
                                'haz_Continent':'continent1',
                                'haz_WorldBankIncomeGroups':'low',
                                'haz_spat_fileloc':'@ucl.ac.uk',
                                'haz_srcdb_URL':'www.ucl.com'},
                            'geometry':{
                                'type': 'Multipolygon',
                                'coordinates': [[3, 4], [4, 5]]
                                        }
                            },
                            {'properties': {
                                'event_ID':'0002',
                                'polygonlabel':'red',
                                'haz_maxvalue':'nan',
                                'haz_maxunit_code':'nan',
                                'haz_Ab':'EQ',
                                'haz_Continent':'continent2',
                                'haz_WorldBankIncomeGroups':'high',
                                'haz_spat_fileloc':'@ucl.ac.uk',
                                'haz_srcdb_URL':'www.ucl.com'},
                            'geometry':{
                                'type': 'Multipolygon',
                                'coordinates': [[5, 6], [7, 8]]
                            }},
                                {'properties': {
                                 'event_ID': '0003',
                                 'polygonlabel': 'red',
                                 'haz_maxvalue': 'nan',
                                 'haz_maxunit_code': 'nan',
                                 'haz_Ab': 'DR',
                                  'haz_Continent': 'continent2',
                                  'haz_WorldBankIncomeGroups': 'high',
                                    'haz_spat_fileloc': '@ucl.ac.uk',
                                    'haz_srcdb_URL': 'www.ucl.com'},
                                'geometry': {
                                    'type': 'Multipolygon',
                                    'coordinates': [[9, 6], [10, 8]]
                                }}
                                ]}