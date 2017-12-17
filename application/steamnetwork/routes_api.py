#!/usr/bin/python
# -*- coding: utf-8 -*-

from flask import Flask, jsonify

from steamnetwork import app
from .api_wrapper import ApiWrapper
import sys

def print_flask(*args, **kwargs):
    print(*args, **kwargs)
    sys.stdout.flush()


def get_response_ok():
    return {'status': 'ok'}

def json_response_error(error_message='error'):
    return jsonify({'status': 'error', 'error_message': error_message})

def json_user_to_dict(json_user, json_games):
    response_user = {}
    response_user['steam_id'] = str(json_user['steamid'])
    response_user['persona_name'] = json_user['personaname']
    response_user['profile_url'] = json_user['profileurl']
    response_user['avatar'] = json_user['avatarfull']
    response_user['persona_state'] = json_user['personastate']
    response_user['last_logoff'] = json_user['lastlogoff'] if 'lastlogoff' in json_user else 0 # can be missing from the dict if the profile is private
    response_user['games'] = [{
        'app_id': game['appid'],
        'playtime_2_weeks': game['playtime_2weeks'] if 'playtime_2weeks' in game else 0, # can be missing from the dict if the player has'nt played
        'playtime_total': game['playtime_forever'] if 'playtime_forever' in game else 0, # can be missing from the dict if the player has'nt played
    } for game in json_games]
    return response_user


def json_game_to_dict(json_game):
    return {
        'app_id': json_game['appid'],
        'name': json_game['name'],
        'img_icon_url': "http://media.steampowered.com/steamcommunity/public/images/apps/%s/%s.jpg" % (json_game['appid'], json_game['img_icon_url']),
        'img_logo_url': "http://media.steampowered.com/steamcommunity/public/images/apps/%s/%s.jpg" % (json_game['appid'], json_game['img_logo_url'])
    }


@app.route("/api/allinfos/<name>")
def route_api_all_infos(name):
    try:
        steam_id = ApiWrapper.get_user_id(name)
        user_profile = ApiWrapper.get_user_profiles(steam_id)[0]
        user_games = ApiWrapper.get_owned_games_with_appinfo(steam_id)
        friend_list = ApiWrapper.get_friend_list(steam_id)
        friend_list_profiles = ApiWrapper.get_user_profiles(friend_list)
        friend_list_profiles = {user['steamid']: user for user in friend_list_profiles}
        friend_games = {
                steam_id: ApiWrapper.get_owned_games_without_appinfo(steam_id) for steam_id in friend_list
                }

        response = get_response_ok()
        response['user'] = json_user_to_dict(user_profile, user_games)
        response['games'] = [json_game_to_dict(game) for game in user_games]
        response['friends'] = [json_user_to_dict(friend_list_profiles[user], friend_games[user]) for user in friend_list]
        return jsonify(response)
    except BaseException as be:
        return json_response_error(str(be))

@app.route("/api/validate_user/<name>")
def route_validate_user(name):
    try:
        steam_id = ApiWrapper.get_user_id(name)
        friend_list = ApiWrapper.get_friend_list(steam_id)
        if len(friend_list) is 0:
            return json_response_error("This profile is either private or has no friends, sorry :(")
        response = get_response_ok()
        response["steam_id"] = steam_id
        return jsonify(response)
    except BaseException as be:
        return json_response_error(str(be))
    
if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
