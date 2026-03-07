#!/usr/bin/env python3
"""
Simple HTTP server for PPTX generation
Run: python server.py
Then open http://localhost:8765 in browser
"""

import http.server
import socketserver
import json
import logging
import os
import sys
import traceback
import urllib.parse
from pathlib import Path

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Import generator from new modular package
from pptx_gen import generate_pptx
import ai_chat

PORT = 8765
STATIC_DIR = Path(__file__).parent


class PPTXHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC_DIR), **kwargs)

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)

        if self.path == '/generate':
            try:
                config = json.loads(post_data.decode('utf-8'))
                output_path = STATIC_DIR / 'generated.pptx'
                generate_pptx(config, str(output_path))

                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {'success': True, 'file': 'generated.pptx'}
                self.wfile.write(json.dumps(response).encode())
            except json.JSONDecodeError as e:
                logging.error(f"Invalid JSON in request: {e}")
                self._send_error_response(400, "Invalid JSON format")
            except (KeyError, ValueError, TypeError) as e:
                logging.error(f"Configuration error: {e}\n{traceback.format_exc()}")
                self._send_error_response(400, "Invalid configuration")
            except Exception as e:
                logging.error(f"PPTX generation failed: {e}\n{traceback.format_exc()}")
                self._send_error_response(500, "Internal server error")

        elif self.path == '/api/chat':
            self._handle_chat(post_data)

        else:
            self.send_response(404)
            self.end_headers()

    def _handle_chat(self, post_data):
        try:
            data = json.loads(post_data.decode('utf-8'))
            result = ai_chat.chat(data.get('message', ''))
            self._send_json(200, result)
        except Exception as e:
            logging.error(f"Chat API error: {e}\n{traceback.format_exc()}")
            self._send_json(500, {'ok': False, 'error': str(e)})

    def _send_json(self, status, obj):
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(obj, ensure_ascii=False).encode('utf-8'))

    def _send_error_response(self, status_code: int, message: str):
        """Send error response without exposing internal details."""
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        response = {'success': False, 'error': message}
        self.wfile.write(json.dumps(response).encode())

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


class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


def main():
    with ReusableTCPServer(("", PORT), PPTXHandler) as httpd:
        print(f"Server running at http://localhost:{PORT}")
        print(f"Open http://localhost:{PORT}/index.html in your browser")
        print("Press Ctrl+C to stop")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")


if __name__ == '__main__':
    main()
