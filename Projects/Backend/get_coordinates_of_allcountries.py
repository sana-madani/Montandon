import json
from geopy.geocoders import Nominatim
import pycountry

def get_all_country_names():
    countries = list(pycountry.countries)
    country_names = [country.name for country in countries]
    return country_names

def get_country_centroid(country_name):
    geolocator = Nominatim(user_agent="country_centroid_finder")
    location = geolocator.geocode(country_name)
    if location:
        return (location.latitude, location.longitude)
    else:
        return None

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


