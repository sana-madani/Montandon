import pandas as pd
import geopandas as gpd
import json
import folium
from flask import Flask, render_template, jsonify
from shapely.geometry import MultiPolygon
df1 = pd.read_json(r'/Users/hcj/UCL/Year2/COMP0016/Example_Data/event_Level.json', encoding='utf_8_sig')
df2 = gpd.read_file(r'/Users/hcj/UCL/Year2/COMP0016/Example_Data/hazard_Level.geojson', encoding='utf_8_sig')
#df3 = gpd.read_file(r'/Users/hcj/UCL/Year2/COMP0016/Example_Data/impact_Level.geojson', encoding='utf_8_sig')

class event:
    def __init__(self):
        event_id = None
        Name = None
        Disaster_Categorization = None
        Start_Date = None
        Code = None #MDR Code
        International_Assistance = None
        Disaster_Type = None
        Visibility = None
        GLIDE_number = None
        Gov_req_international_Assistance = None
        coord = None

def show_info(df):
    print(df.info())
    ids = df['event_ID'].values
    ids = list(set(ids))
    print(ids)
    print(len(ids))

def readable_python():
    events = initial_details(df1, df2)
    for event in events:
        print("---------------EVENT-----------------")
        print("Name : ", event.Name)
        print("Start Date : ", event.Start_Date)
        print("Disaster Categorization : ", event.Disaster_Categorization)
        print("Coordinates : ", event.coord)
        print("...")

#df1 - event_Level : event_ID, ev_name, Country, ev_sdate, ev_fdate
def initial_event_Level(events):
    ids = df1['event_ID'].values
    names = df1['ev_name'].values
    countries = df1['Contry'].values
    start_date = df1['ev_sdate'].values
    finish_date = df1['ev_fdate'].values
    names = list(names)
    print(ids, names, countries, )

#df2 - hazard_Level : event_ID, Class, coordinates
#df3 - impact_Level :
def initial_details(df1, df2):
    # event_Level

    #df2
    dis_cate = df1['Class'].values

    multipolygons = df1['geometry'].values
    coordinates = []
    for multipolygon in multipolygons:
        multipolygon = json.loads(json.dumps(multipolygon.__geo_interface__))
        coordinates.append(multipolygon["coordinates"][0][0])


    for i in range(0, len(names) - 2):
        eve = event()
        #eve.event_id =
        eve.Name = names[i]
        eve.Disaster_Categorization = dis_cate[i]
        eve.Start_Date = start_date[i]
        eve.coord = coordinates[i]
        events.append(eve)
    return events

def mapping(eve, my_map):
    coords = eve.coord
    print(coords)
    for coord in coords:
        folium.RegularPolygonMarker(coord, popup=eve.Name, number_of_sides=1, radius=1, color='red', fill=True, fill_color='red').add_to(my_map)
    return my_map


def run():
    events = []
    events = initial_details(df1, df2)
    boulder_coords = [78, 12]
    my_map = folium.Map(location=boulder_coords, zoom_start=3)
    my_map = mapping(events[0], my_map)
    my_map.save("mapping.html")

#@app.route('/process_json', methods = ['GET', 'POST'])
def render():
    events = initial_details(df1, df2)
    for event in events:
        print(event.Name, event.Disaster_Categorization, event.Start_Date)

    return render_template('mapping.html', data=events)


show_info(df2)
#run()