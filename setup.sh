#!/bin/bash
source ./env/bin/activate
export FLASK_APP=application.py
export FLASK_DEBUG=1
flask run
