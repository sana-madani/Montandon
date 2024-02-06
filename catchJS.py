import pandas as pd
import geopandas as gpd
import json
import folium
import os
import threading
from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
#from shapely.geometry import MultiPolygon
app = Flask(__name__)
#mapping_bp = Blueprint('mapping', __name__)
CORS(app)
# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Specify the relative paths to the JSON and GeoJSON files
json_file_path = os.path.join(script_dir, 'Example_Data', 'event_Level.json')
geojson_file_path = os.path.join(script_dir, 'Example_Data', 'hazard_Level.geojson')

df1 = pd.read_json(json_file_path, encoding='utf_8_sig')
df2 = gpd.read_file(geojson_file_path, encoding='utf_8_sig')
#df3 = gpd.read_file(r'/Users/hcj/UCL/Year2/COMP0016/Example_Data/impact_Level.geojson', encoding='utf_8_sig')

class event:
    def __init__(self):
        id = None
        name = None
        country = None
        start_date = None
        finish_date = None
        coord = None

def show_info(df):
    print(df.info())
    ids = df['event_ID'].values
    ids = list(set(ids))
    print(ids)
    print(len(ids))


#df1 - event_Level : event_ID, ev_name, Country, ev_sdate, ev_fdate
def initial_event_Level():
    hazards = {}
    ids = df1['event_ID'].values
    names = df1['ev_name'].values
    countries = df1['Country'].values
    start_date = df1['ev_sdate'].values
    finish_date = df1['ev_fdate'].values
    names = list(names)
    ids = list(ids)
    for num in range(len(ids)):
        value = {}
        value["name"] = names[num]
        value["country"] = countries[num]
        value["start_date"] = start_date[num]
        value["finish_date"] = finish_date[num]
        hazards[ids[num]] = value
    return hazards

#df2 - hazard_Level : event_ID, Class, coordinates
def initial_hazard_Level():
    hazards = {}
    ids = df2['event_ID'].values
    multipolygons = df2['geometry'].values
    coordinates = []
    for multipolygon in multipolygons:
        multipolygon = json.loads(json.dumps(multipolygon.__geo_interface__))
        coordinates.append(multipolygon["coordinates"][0][0])

    for num in range(0, len(ids) - 1):
        id = ids[num]
        value = {}
        coordinate = coordinates[num]
        if ids[num] in list(hazards.keys()):
            hazards[id]["coordinates"].extend(coordinate)
        else:
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
        eve.coord = hazard_level_dic[key]["coordinates"]
        events.append(eve)
    return events

def mapping_async(eve):
    boulder_coords = [78, 12]
    my_map = folium.Map(location=boulder_coords, zoom_start=3)
    coords = eve.coord
    for coord in coords:
        folium.RegularPolygonMarker(coord, popup=eve.name, number_of_sides=1, radius=1, color='red', fill=True, fill_color='red').add_to(my_map)
    map_html_content = my_map._repr_html_()
    return map_html_content

@app.route('/', methods = ['POST'])
def receive_data_from_fronted():
    data_from_fronted = request.get_json()
    print("Clicked Disaster ID:",data_from_fronted)
    for eve in events:
        if eve.id == data_from_fronted:
            map_html_content = mapping_async(eve)
            # eve_dict = {
            #     'id': eve.id,
            #     'name': eve.name,
            #     'country': eve.country,
            #     'start_date': eve.start_date,
            #     'finish_date': eve.finish_date,
            #     #'coord': eve.coord,
            # }
            # print(eve_dict)
            return jsonify(map_html_content)



@app.route('/')
def get_data():
    backend_data = []
    for event in events:
        event_dict = {
            'id': event.id,
            'name': event.name,
            'country': event.country,
            'start_date': event.start_date,
            'finish_date': event.finish_date,
            'coord': event.coord,
        }
        backend_data.append(event_dict)

    return jsonify(backend_data)



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
    #show_events(events)
#    app.register_blueprint(mapping_bp)
    app.run(debug=True)
    

# events= []
# initial_event_Level(events)
run()