# IFRC Montandon Website

## Dependencies

### Backend
- Flask
- flask_cors
- json
- datetime
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


### Script(package.py)
- http.server
- socketserver
- webbrowser
- threading
- subprocess
- time

## Installation
Before running the application, you need to install the necessary dependencies. You can do this by running the following command in your terminal:

### Backend
```bash
pip3 install -r requirements.txt
```

### Testing

```bash
pip3 install pytest selenium locust
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

