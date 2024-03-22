import http.server
import socketserver
import webbrowser
import threading
import subprocess
import time
PORT = 5500
DIRECTORY = "/.."  
Handler = http.server.SimpleHTTPRequestHandler
def start_server():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("Serving at poßrt", PORT)
        httpd.serve_forever()

server_thread = threading.Thread(target=start_server)
server_thread.start()


subprocess.Popen(["python3","Projects/Backend/flask_app.py"])
time.sleep(5)
webbrowser.open('http://127.0.0.1:5500/Projects/Frontend/landing_page/index.html')



  
    




