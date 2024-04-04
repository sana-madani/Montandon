# IFRC Montandon Website
Montandon aims to make all disaster information universally accessible and useful to IFRC responders for better decision making based on impact information.

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
Before running the application, you need to install the necessary dependencies. You can do this by running the following command in your terminal(in virtual environment):

### Create and activate the virtual environment
Create
```bash
python3 -m venv venv
```
Activate
```bash
source venv/bin/activate
```

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
All operations should be done in virtual environment
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

