# Performance/Stress Testing
# Objective: Test the application’s performance under heavy loads.
# Tool: Locust.
# Method: Simulate a large number of requests to your backend to test how well it handles high traffic, focusing on response times and potential failures.

# User's Guide
# in terminal:
# Montandon % source venv/bin/activate
# pip3 install locust
# Montandon % locust -f performance_test.py

from locust import HttpUser, task, between

class MyUser(HttpUser):
    wait_time = between(1, 2)
    @task
    def my_task1(self):
        self.client.get("http://127.0.0.1:5500/Projects/Frontend/landing_page/index.html")
    @task
    def my_task2(self):
        self.client.get("http://127.0.0.1:5500/Projects/Frontend/mapping_detail/HTML/interactive_mapping.html")
    @task
    def my_task3(self):
        self.client.get("http://127.0.0.1:5500/Projects/Frontend/summary_mapping/mapping.html")
    @task
    def my_task4(self):
        self.client.get("http://127.0.0.1:5500/Projects/Frontend/partners/partners.html")
    @task
    def my_task5(self):
        self.client.get("http://127.0.0.1:5500/Projects/Frontend/facts/facts.html")

