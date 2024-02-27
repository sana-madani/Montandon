import pandas as pd
import geopandas as gpd
from datetime import datetime
import folium
from flask import jsonify
import os
import json

class event:
    def __init__(self):
        id = None
        name = None
        country = None
        start_date = None
        finish_date = None
        type = None
        coord = None

#df1 - event_Level : event_ID, ev_name, Country, ev_sdate, ev_fdate
def initial_event_Level(df1):
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

#df2 - hazard_Level : event_ID, Class, coordinates
def initial_hazard_Level(df2):
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

def initial_events(df1, df2):
    events = []
    event_level_dic = initial_event_Level(df1);
    hazard_level_dic = initial_hazard_Level(df2);
    for key, value in event_level_dic.items():
        eve = event()
        eve.id = key
        eve.name = value["name"]
        eve.country = value["country"]
        eve.start_date = value["start_date"]
        eve.finish_date = value["finish_date"]
        eve.type = value["type"]
        eve.coord = hazard_level_dic[key]["coordinates"]
        events.append(eve)
    return events

def sort_events_by_date(events):
    for i in range(0, len(events)):
        for j in range(i, len(events)):
            date1 = datetime.strptime(events[i].start_date, "%Y-%m-%d").date()
            date2 = datetime.strptime(events[j].start_date, "%Y-%m-%d").date()
            if date1 < date2:
                k = events[i]
                events[i] = events[j]
                events[j] = k
    return events


def send_all(df1, events):
    backend_data = []
    all_types = {"type":list(df1['haz_spec_lab'].values)}
    backend_data.append(all_types)
    for event in events:
        event_dict = {
            'id': event.id,
            'name': event.name,
            'country': event.country,
            'start_date': event.start_date,
            'finish_date': event.finish_date,
            'type': event.type,
            'coord': event.coord,
        }
        backend_data.append(event_dict)
    return backend_data

def send_selected(data_from_fronted, events):
    backend_data = []
    backend_data.append({"type":"1"})
    print("Clicked Disaster ID:",data_from_fronted)
    for event in events:
        if event.type == data_from_fronted['type']:
            event_dict = {
                'id': event.id,
                'name': event.name,
                'country': event.country,
                'start_date': event.start_date,
                'finish_date': event.finish_date,
                'type': event.type,
                'coord': event.coord,
            }
            backend_data.append(event_dict)
    return backend_data
