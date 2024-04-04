# IFRC Montandon Website

## Dependencies(Open-Source)

### Backend
- Flask
- flask_cors
- pycountry
- geopy.geocoders

### Frontend
- Leaflet

### Testing
- pytest
- selenium
- locust
- coverage
- jest
- jsdom

## Installation
Before running the application, you need to install the necessary dependencies. You can do this by running the following command in your terminal:
### All Requirements

Most of required packages are in requirements.txt
```bash
pip3 install -r requirements
```

### Testing for Javascript

```bash
npm install --save-dev jest
npm install --save-dev @babel/core @babel/preset-env babel-jest
npm install --save-dev jsdom
```



## Run Application

### Run website(Backend and Frontend)
run the package.py script to start the website:

```bash
Montandon % python3 package.py
```

### Run testing

run pytest

```bash
Montandon % pytest
```

run jest

```bash
npm test
```

