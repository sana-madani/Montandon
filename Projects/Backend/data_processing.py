# This File
# is used for processing event data.
import json
import os
from datetime import datetime

# filters events based on the disaster type / country. 
# Serving for type/country search functions in interactive mapping list.
def check_disaster_types(events, disaster_type):
    result = []
    if disaster_type == "":
        return events
    else:
        for event in events:
            if event.type == disaster_type:
                result.append(event)
        return result

def check_country(events, country):
    result = []
    if country == "":
        return events
    else:
        for event in events:
            if event.country == country:
                result.append(event)
        return result
    
# sort events by their start date.
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

# filter events based on whether their start date is 
# after or before a given date. 
# Serving for date search in interactive mapping list.
def check_date_after(events, date1):
    result = []
    if date1 == "":
        return events
    else:
        date1 = datetime.strptime(date1, "%Y-%m-%d").date()
        for event in events:
            print(event)
            date2 = datetime.strptime(event.start_date, "%Y-%m-%d").date()
            if date1 < date2:
                result.append(event)
        return result

def check_date_before(events, date1):
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

# reads the JSON file containing all country name and its centroid.
def produce_countries_data():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    country_file = os.path.join(script_dir,'..','db', 'countries_centroids.json')
    with open(country_file, 'r') as file:
        data = json.load(file)
    return data

# check and return the corresponding impact
def check_impact(imp_type, event):
    if imp_type == "Deaths":
        return event['imptypdeat']
    elif imp_type == "Missing":
        return event['imptypmiss']
    elif imp_type == "Injured":
        return event['imptypinju']
    else:
        return "Undefined"
