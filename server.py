#!/usr/bin/env python3
"""
Simple HTTP server for PPTX generation
Run: python server.py
Then open http://localhost:8765 in browser
"""

import http.server
import socketserver
import json
import os
import sys
import urllib.parse
from pathlib import Path

# Add python-pptx to path
sys.path.insert(0, '/Users/touichskyer/Code/python-pptx/src')

# Import generator
from pptx_generator import generate_pptx

PORT = 8765
STATIC_DIR = Path(__file__).parent


class PPTXHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC_DIR), **kwargs)

    def do_POST(self):
        if self.path == '/generate':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)

            try:
                config = json.loads(post_data.decode('utf-8'))
                output_path = STATIC_DIR / 'generated.pptx'
                generate_pptx(config, str(output_path))

                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response = {'success': True, 'file': 'generated.pptx'}
                self.wfile.write(json.dumps(response).encode())
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response = {'success': False, 'error': str(e)}
                self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        # Disable caching for development
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()


def main():
    with socketserver.TCPServer(("", PORT), PPTXHandler) as httpd:
        print(f"Server running at http://localhost:{PORT}")
        print(f"Open http://localhost:{PORT}/index.html in your browser")
        print("Press Ctrl+C to stop")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")


if __name__ == '__main__':
    main()
