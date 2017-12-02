# -*- coding: utf-8 -*-

from flask import Flask
from flask_redis import Redis


app = Flask(__name__)

app.config['REDIS_HOST'] = 'steamnetwork_redis'
app.config['REDIS_PORT'] = 6379
app.config['REDIS_DB'] = 0

redis_store = Redis(app)

import steamnetwork.routes_api
import steamnetwork.routes
import steamnetwork.errors

from steamnetwork.localconstants import STEAM_API_KEY as KEY
from steamnetwork.api_wrapper import ApiWrapper

ApiWrapper.set_api_key(KEY)
