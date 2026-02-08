"""
Pytest configuration and shared fixtures.
"""

import sys
import os

# Add python-pptx fork to path
PPTX_LIB_PATH = os.environ.get('PYTHON_PPTX_PATH', '/Users/touichskyer/Code/python-pptx/src')
sys.path.insert(0, PPTX_LIB_PATH)

# Add project root to path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)
