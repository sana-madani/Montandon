import pandas as pd
import geopandas as gpd
import json
import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
#from shapely.geometry import MultiPolygon
app = Flask(__name__)
#mapping_bp = Blueprint('mapping', __name__)
CORS(app)
# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Specify the relative paths to the JSON and GeoJSON files

# interactive mapping detail
json_file_path = os.path.join(script_dir, 'Example_Data', 'event_Level.json')
geojson_file_path = os.path.join(script_dir, 'Example_Data', 'hazard_Level.geojson')

# summary mapping detail
json_file_path1 = os.path.join(script_dir, 'export_data', 'event_Level_2000-01-01_2024-02-05_EQ.json')
json_file_path2 = os.path.join(script_dir, 'export_data', 'hazard_Level_2000-01-01_2024-02-05_EQ.json')

df1 = pd.read_json(json_file_path, encoding='utf_8_sig')
df2 = gpd.read_file(geojson_file_path, encoding='utf_8_sig')

#df1 = pd.read_json(json_file_path1, encoding='utf_8_sig')
#df2 = pd.read_json(json_file_path2, encoding='utf_8_sig')

class event:
    def __init__(self):
        id = None
        name = None
        country = None
        start_date = None
        finish_date = None
        type = None
        max_value = None
        max_unit_code = None
        coord = None


#df1 - event_Level : event_ID, ev_name, Country, ev_sdate, ev_fdate
def initial_event_Level():
    hazards = {}
    ids = df1['event_ID'].values
    names = df1['ev_name'].values
    countries = df1['Country'].values
    start_date = df1['ev_sdate'].values
    finish_date = df1['ev_fdate'].values
    type = df1['haz_spec_lab'].values
    names = list(names)
    ids = list(ids)
    for num in range(len(ids)):
        value = {}
        value["name"] = names[num]
        value["country"] = countries[num]
        value["start_date"] = start_date[num]
        value["finish_date"] = finish_date[num]
        value["type"] = type[num]
        hazards[ids[num]] = value
    return hazards

#df2 - hazard_Level : event_ID, Class, coordinates, haz_maxvalue, haz_maxunit_code
def initial_hazard_Level():
    hazards = {}
    ids = df2['event_ID'].values
    multipolygons = df2['geometry'].values
    maxvalues = df2['haz_maxvalue'].values
    maxunit_codes = df2['haz_maxunit_code'].values
    coordinates = []
    for multipolygon in multipolygons:
        multipolygon = json.loads(json.dumps(multipolygon.__geo_interface__))
        coordinates.append(multipolygon["coordinates"][0][0])

    for num in range(0, len(ids) - 1):
        id = ids[num]
        maxvalue = maxvalues[num]
        maxunit_code = maxunit_codes[num]
        value = {}
        coordinate = coordinates[num]
        if ids[num] in list(hazards.keys()):
            hazards[id]["coordinates"].extend(coordinate)
        else:
            value["max_value"] = maxvalue
            value["maxunit_code"] = maxunit_code
            value["coordinates"] = coordinate
            hazards[id] = value
    return hazards




#df3 - impact_Level :


# combine all dic

def initial_events():
    events = []
    event_level_dic = initial_event_Level()
    hazard_level_dic = initial_hazard_Level()
    for key, value in event_level_dic.items():
        eve = event()
        eve.id = key
        eve.name = value["name"]
        eve.country = value["country"]
        eve.start_date = value["start_date"]
        eve.finish_date = value["finish_date"]
        eve.max_value = str(hazard_level_dic[key]["max_value"])
        eve.max_unit_code = hazard_level_dic[key]["maxunit_code"]
        eve.type = value["type"]
        eve.coord = hazard_level_dic[key]["coordinates"]
        events.append(eve)
    return events

def sort_events_by_date():
    for i in range(0, len(events)):
        for j in range(i, len(events)):
            date1 = datetime.strptime(events[i].start_date, "%Y-%m-%d").date()
            date2 = datetime.strptime(events[j].start_date, "%Y-%m-%d").date()
            if date1 < date2:
                k = events[i]
                events[i] = events[j]
                events[j] = k
    return events


def send_all():
    backend_data = []
    search_options = {
        "type":list(df1['haz_spec_lab'].values),
        "country":list(df1['Country'].values),
        }
    backend_data.append(search_options)
    for event in events:
        event_dict = {
            'id': event.id,
            'name': event.name,
            'country': event.country,
            'start_date': event.start_date,
            'finish_date': event.finish_date,
            'max_value': event.max_value,
            'maxunit_code': event.max_unit_code,
            'type': event.type,
            'coord': event.coord,
        }
        backend_data.append(event_dict)
    print(backend_data)
    return backend_data

def check_date_after(date1):
    print("After Date",date1)
    result = []
    if date1 == "":
        return events
    else:
        date1 = datetime.strptime(date1, "%Y-%m-%d").date()
        for event in events:
            date2 = datetime.strptime(event.start_date, "%Y-%m-%d").date()
            if date1 < date2:
                result.append(event)
        return result

def check_date_before(date1):
    print("Before Date",date1)
    result = []
    if date1 == "":
        return events
    else:
        date1 = datetime.strptime(date1, "%Y-%m-%d").date()
        for event in events:
            date2 = datetime.strptime(event.start_date, "%Y-%m-%d").date()
            if date1 > date2:
                result.append(event)
        return result

def check_country(country):
    result = []
    if country == "":
        return events
    else:
        for event in events:
            if event.country ==  country:
                result.append(event)
        return result

def check_disaster_types(disaster_type):
    result = []
    if disaster_type == "":
        return events
    else:
        for event in events:
            if event.type ==  disaster_type:
                result.append(event)
        return result

        

def send_selected(data_from_fronted):
    backend_data = []
    backend_data.append({"type" : 1})

    start_after_date = check_date_after(data_from_fronted["Start AfterInput"])
    start_before_date = check_date_before(data_from_fronted["Start BeforeInput"])
    country_event = check_country(data_from_fronted["All CountriesInput"])
    disaster_type_event = check_disaster_types(data_from_fronted["All Disaster TypesInput"])
    
    total_events = [start_after_date,start_before_date,country_event,disaster_type_event]
    common_event = set(total_events[0]).intersection(*total_events[1:])
    for selected_event in common_event:
        event_dict = {
            'id': selected_event.id,
            'name': selected_event.name,
            'country': selected_event.country,
            'start_date': selected_event.start_date,
            'finish_date': selected_event.finish_date,
            'max_value': selected_event.max_value,
            'maxunit_code': selected_event.max_unit_code,
            'type': selected_event.type,
            'coord': selected_event.coord,
        }
        backend_data.append(event_dict)
    return backend_data


@app.route('/', methods = ['POST'])
def receive_data_from_fronted():
    data_from_fronted = request.get_json()
    return jsonify(send_selected(data_from_fronted))


@app.route('/')
def get_data():
    return jsonify(send_all())



def show_events(events):
    for eve in events:
        print("--------------")
        print(eve.id)
        print(eve.name)
        print(eve.country)
        print(eve.start_date)
        print(eve.finish_date)
        print(eve.coord)


def run():
    global events
    events = initial_events()
    events = sort_events_by_date()
    #show_events(events)
    app.run(debug=True)

run()