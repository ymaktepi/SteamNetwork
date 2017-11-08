# -*- coding: utf-8 -*-

from flask import Flask
from steamnetwork.localconstants import STEAM_API_KEY as STEAM_API_KEY



app = Flask(__name__)
    
#TODO, add STEAM_API_KEY in flask.g

import steamnetwork.routes
import steamnetwork.errors
