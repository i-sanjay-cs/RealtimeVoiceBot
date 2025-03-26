import os
import subprocess
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler

# Simple HTTP server to keep the Heroku dyno alive
class SimpleHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(b'LiveKit Agent is running')

# Start the LiveKit agent in a separate thread
def run_agent():
    subprocess.call(['python', 'main.py', 'start'])

# Start the HTTP server to satisfy Heroku's port binding requirement
def run_server():
    port = int(os.environ.get('PORT', 8080))
    server = HTTPServer(('0.0.0.0', port), SimpleHandler)
    print(f'Starting web server on port {port}')
    server.serve_forever()

if __name__ == '__main__':
    # Start the agent in a separate thread
    agent_thread = threading.Thread(target=run_agent)
    agent_thread.daemon = True
    agent_thread.start()
    
    # Run the HTTP server in the main thread
    run_server()