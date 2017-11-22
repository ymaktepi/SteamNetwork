# -*- coding: utf-8 -*-

from flask import Flask
from steamnetwork.localconstants import STEAM_API_KEY as KEY
from steamapi import core


app = Flask(__name__)

core.APIConnection(api_key=KEY)

import steamnetwork.routes_api
import steamnetwork.routes
import steamnetwork.errors
