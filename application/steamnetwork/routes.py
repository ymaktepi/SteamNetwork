#!/usr/bin/python
# -*- coding: utf-8 -*-

from flask import Flask, render_template, redirect, url_for

from steamnetwork import app

@app.route("/")
def route_home():
    return render_template("pages/index.html", title="index", active="Home")
    
@app.route("/about/")
def route_about():
    return render_template("pages/about.html", title="index", active="About")

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
