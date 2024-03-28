# This File
# is used for processing event data and defining a dictionary disaster_types. 
# That maps disaster type codes to their full names, 
# and a list of countries that will 
# contain all the countries encountered in the event data.

import sys
from model import event
from data_processing import produce_countries_data, sort_events_by_date, check_date_after, check_date_before, check_country, check_disaster_types, check_impact
disaster_types = {"EQ": "Earthquake",
                  "FL": "Flood",
                  "VO": "Volcano",
                  "DR": "Drought",
                  "TC": "Tropical cyclone"}

countries = []
# df1 - event_Level : event_ID, ev_name, Country, ev_sdate, ev_fdate, impact
# processes event data and stores it in a dictionary 
# with event IDs as keys. The other data of this events as value. 
# The dictionary is like {ID:{name: name1, country: country1,…}}
def initial_event_Level(data):
    hazards = {}
    for event in data:
        value = {}
        value["name"] = event['ev_name']
        value["country"] = event['Country']
        value["start_date"] = event['ev_sdate']
        imp_type = event['imp_type']
        exp_specs = event['exp_specs']
        value['impact'] = exp_specs + " " + imp_type
        value['impact_value'] = check_impact(imp_type, event)
        value["finish_date"] = event['ev_fdate']
        hazards[event['event_ID']] = value
        countries.append(event['Country'])
    return hazards


# df2 - hazard_Level : event_ID, Class, coordinates, haz_maxvalue, haz_maxunit_code
# processes hazard data and stores it in a dictionary, 
# with event IDs as keys, which is similar with initial_event_Level(data).
def initial_hazard_Level(data):
    data = data['features']
    hazards = {}
    for event in data:
        value = {}
        coordinates = event['geometry']['coordinates'][0][0]
        event = event['properties']

        polygonlabel = event['polygonlabel']
        maxvalue = event['haz_maxvalue']
        maxunit_code = event['haz_maxunit_code']
        id = event['event_ID']
        if id in list(hazards.keys()):
            hazards[id]["coordinates"].update({polygonlabel: coordinates})
        else:
            if str(maxvalue) == "nan":
                value["max_value"] = "---"
            else:
                value["max_value"] = str(maxvalue) + " " + str(maxunit_code).replace("units","")
            value['coordinates'] = {polygonlabel:coordinates}
            value['type'] = event['haz_Ab']
            value['continent'] = event['haz_Continent']
            value['income'] = event['haz_WorldBankIncomeGroups']
            value['file_location'] = event['haz_spat_fileloc']
            value['source_URL'] = event['haz_srcdb_URL']
            hazards[id] = value
    return hazards

# combines the event and hazard data processed by 
# the previous two functions into a list of event objects.
def initial_events(df1,df2):
    events = []
    event_level_dic = initial_event_Level(df1)
    hazard_level_dic = initial_hazard_Level(df2)
    for key, value in event_level_dic.items():
        eve = event()
        eve.id = key
        eve.name = value["name"]
        eve.country = value["country"]
        eve.start_date = value["start_date"]
        eve.finish_date = value["finish_date"]
        eve.impact = value["impact"]
        eve.impact_value = value["impact_value"]
        eve.max_value = str(hazard_level_dic[key]["max_value"])
        eve.type = disaster_types[hazard_level_dic[key]["type"]]
        eve.continent = hazard_level_dic[key]["continent"]
        eve.WorldBankIncome = hazard_level_dic[key]["income"]
        eve.file_location = hazard_level_dic[key]["file_location"]
        eve.source_URL = hazard_level_dic[key]["source_URL"]
        eve.coord = hazard_level_dic[key]["coordinates"]
        events.append(eve)
    return events


# converts a list of event objects into a list of 
# dictionaries and prepends it with a dictionary of search options. 
# This list is meant to be sent to the frontend.
def send_all(events):
    backend_data = []
    search_options = {
        "type":list(set(disaster_types.values())),
        "country": list(set(countries)),
        "summary_map": produce_countries_data(),
        }
    backend_data.append(search_options)
    for event in events:
        event_dict = {
            'id': event.id,
            'name': event.name,
            'country': event.country,
            'continent': event.continent,
            'start_date': event.start_date,
            'finish_date': event.finish_date,
            'impact': event.impact,
            'impact_value': event.impact_value,
            'WorldBankIncome': event.WorldBankIncome,
            'file_location': event.file_location,
            'source_URL': event.source_URL,
            'max_value': event.max_value,
            'type': event.type,
            'coord': event.coord,
        }
        backend_data.append(event_dict)
    return backend_data

# filters the list of event objects based on criteria 
# received from the frontend, 
# converts the filtered list into a list of dictionaries, and returns it.
def send_selected(events, data_from_fronted):
    backend_data = []
    backend_data.append({"type": list(set(disaster_types.values()))})
    start_after_date = check_date_after(events, data_from_fronted["Start AfterInput"])
    start_before_date = check_date_before(events, data_from_fronted["Start BeforeInput"])
    country_event = check_country(events, data_from_fronted["All CountriesInput"])
    disaster_type_event = check_disaster_types(events, data_from_fronted["All Disaster TypesInput"])

    total_events = [start_after_date, start_before_date, country_event, disaster_type_event]
    common_event = set(total_events[0]).intersection(*total_events[1:])
    for selected_event in common_event:
        event_dict = {
            'id': selected_event.id,
            'name': selected_event.name,
            'country': selected_event.country,
            'continent': selected_event.continent,
            'start_date': selected_event.start_date,
            'finish_date': selected_event.finish_date,
            'impact': selected_event.impact,
            'impact_value': selected_event.impact_value,
            'WorldBankIncome': selected_event.WorldBankIncome,
            'file_location': selected_event.file_location,
            'source_URL': selected_event.source_URL,
            'max_value': selected_event.max_value,
            'type': selected_event.type,
            'coord': selected_event.coord,
        }
        backend_data.append(event_dict)
    return backend_data
