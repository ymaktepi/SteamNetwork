# -*- coding: utf-8 -*-
from flask import render_template
from steamnetwork import app


@app.errorhandler(404)
def error404(e):
    return render_template('errors/errors.html', title="Error 404", header="404. Sense not found."), 404


@app.errorhandler(403)
def error403(e):
    return render_template('errors/errors.html', title="Error 403", header="403. You're walking on the forbidden path."), 500


@app.errorhandler(500)
def error500(e):
    return render_template('errors/errors.html', title="Error 500", header="500. Server blew up."), 500
