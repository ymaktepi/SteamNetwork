#!/usr/bin/python
# -*- coding: utf-8 -*-

from flask import Flask, jsonify

from steamnetwork import app
from steamapi import core, user


def get_response_ok():
    return {'status': 'ok'}


def get_response_error(error_message='error'):
    return {'status': 'error', 'error_message': error_message}


def get_user(user_name):
    steam_user = None
    try:
        steam_user = user.SteamUser(userid=int(user_name))
    except ValueError:  # Not an ID, but a vanity URL.
        steam_user = user.SteamUser(userurl=user_name)
    return steam_user

def user_game_to_dict(steam_game):
    return {
        'app_id': steam_game.appid,
        'playtime': steam_game.achievements
    }

def user_to_dict(steam_user):
    return {
        'img': steam_user.avatar_full,
        'name': steam_user.name,
        'real_name': steam_user.real_name,
        'games': [user_game_to_dict(game) for game in steam_user.games]
    }


@app.route("/api/allinfos/<name>")
def route_api_all_infos(name):
    try:
        steam_user = get_user(name)
        if steam_user is None:
            return jsonify(get_response_error('User %s not found' % str(name)))

        dic = get_response_ok()
        dic['user'] = user_to_dict(steam_user)
        return jsonify(dic)
    except Exception as ex:
        return jsonify(get_response_error("An error occured %s" % ex))


@app.route("/api/user/<name>")
def route_api_user(name):
    try:
        steam_user = get_user(name)
        if steam_user is None:
            return jsonify(get_response_error('User %s not found' % str(name)))

        dic = get_response_ok()
        dic['user'] = {
            'name': steam_user.name,
            'real_name': steam_user.real_name,
            'friends': [{'name': friend.name, 'steam_id': friend.id} for friend in steam_user.friends],
            'games': [{'name': game.name, 'app_id': game.appid} for game in steam_user.games],
            'img': steam_user.avatar
        }
        return jsonify(dic)
    except Exception as ex:
        return jsonify(get_response_error("An error occured %s" % ex))

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
