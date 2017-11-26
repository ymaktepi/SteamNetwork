# -*- coding: utf-8 -*-

from flask import Flask
from steamnetwork.localconstants import STEAM_API_KEY as KEY
from steamnetwork.api.api_wrapper import ApiWrapper


app = Flask(__name__)

ApiWrapper.set_api_key(KEY)

import steamnetwork.routes_api
import steamnetwork.routes
import steamnetwork.errors
