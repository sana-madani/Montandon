# This File
# used for fetching geographical coordinates(centroids) of all countries 
# and write them into a JSON file. Serving for summary mapping in frontend.

import json
from geopy.geocoders import Nominatim
import pycountry

# fetches a list of all country names using pycountry.
def get_all_country_names():
    countries = list(pycountry.countries)
    country_names = [country.name for country in countries]
    return country_names

# uses Nominatim to geocode the provided country name into a latitude 
# and longitude pair(centroid). If the geocoding is successful, 
# it returns the centroid; otherwise, it returns None.
def get_country_centroid(country_name):
    geolocator = Nominatim(user_agent="country_centroid_finder")
    location = geolocator.geocode(country_name)
    if location:
        return (location.latitude, location.longitude)
    else:
        return None

# Iterates over the provided list of country names, 
# fetches the centroid for each country, 
# store them into a dictionary that country name as the key 
# and its centroid as the value. Return the dictionary 
# which covers all countries with its centroid.
def get_all_countries_centroids(country_names):
    countries_centroids = {}
    print(len(country_names))
    for i in range(249,250):
        country_name = country_names[i]
        centroid = get_country_centroid(country_name)
        print(country_name, centroid, i)
        if centroid:
            countries_centroids[country_name] = centroid
        if i == 220:
            break
    return countries_centroids

# get central point
countries_centroids = get_all_countries_centroids(get_all_country_names())

# store in files
with open('countries_centroids.json', 'a') as json_file:
    json.dump(countries_centroids, json_file)
    json_file.write('\n')

print("Countries centroids saved to countries_centroids.json")


