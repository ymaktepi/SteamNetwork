# -*- coding: utf-8 -*-

import json
import sys
import time
import pickle
import requests


from steamnetwork import redis_store

def flask_print(*args, **kwargs):
    print(*args, **kwargs)
    sys.stdout.flush()
    
def now_millis():
    return time.time()*1000

def cached_dict_timeout(timeout):
    def cached_dict(function):
        dic = {}
        def wrapper(*args):
            name = function.__name__+'_'.join(args)
            response = None
            if name in dic:
                response_tuple = dic[name]
                if now_millis() - response_tuple[0] < timeout:
                    return response_tuple[1]
            response = function(*args)
            dic[name] = (now_millis(), response)
            return response
        return wrapper
    return cached_dict

def cached_redis_timeout(timeout):
    def cached_redis(function):
        def wrapper(*args):
            name = "test"+function.__name__+'_'.join(args)
            response = redis_store.get(name)
            if response is not None:
                response_tuple = pickle.loads(response)
                if now_millis() - response_tuple[0] < timeout:
                    return response_tuple[1]
            response = function(*args)
            redis_store.set(name, pickle.dumps((now_millis(), response)))
            return response
        return wrapper
    return cached_redis_timeout

cached_timeout = cached_dict_timeout


class ApiWrapperException(Exception):

    def __init__(self, message=None):
        if message is None:
            message = "An error occured"
        super(ApiWrapperException, self).__init__(message)


class ApiWrapper(object):

    _URL = 'http://api.steampowered.com/'

    _KEY = None

    @staticmethod
    def set_api_key(key):
        """
            Sets the api key value to be used.
            Must be called once at the start of the program

            :param key: A str object, the api key that will be used.
        """
        if ApiWrapper._KEY is None:
            ApiWrapper._KEY = key

    @staticmethod
    @cached_timeout(1000000)
    def get_user_id(user_id_or_url):
        """
        returns the steam id (64bits int) for the user
        :param user_id_or_url: the user id or the custom user's url (only the name, not the full url)
        """
        # TODO: better check of the first case (int(...))
        try:
            user_id = int(user_id_or_url)
            return str(user_id)
        except:
            try:
                json_response = ApiWrapper._make_request(
                    "ISteamUser", "ResolveVanityURL", "v0001", vanityurl=user_id_or_url)
                if json_response['response']['success'] == 1:
                    return json_response['response']['steamid']
                raise ApiWrapperException(
                    "The specified url (%s) doesn't give any result." % str(user_id_or_url))
            except BaseException as be:
                raise ApiWrapperException(
                    "Could not get the id for %s (%s)" % (user_id_or_url, str(be)))

    @staticmethod
    #@cached
    def get_user_profiles(user_ids):
        """
        returns the user profile as found in the GetPlayerSummaries Steam API route.
        :param user_ids: a list of user ids (list of int)
        """
        if type(user_ids) != list:
            user_ids = [user_ids]
        try:
            user_ids = [int(user_id) for user_id in user_ids]
        except:
            raise ApiWrapperException("The user_ids must be integers")
        list_profiles=[]
        n = 100 #the steam api accepts maximum 100 users in this query
        for sliced_list in [user_ids[i:i+n] for i in range(0, len(user_ids), n)]:
            json_users = ApiWrapper._make_request("ISteamUser", "GetPlayerSummaries", "v0002" , steamids=sliced_list)
            list_profiles += json_users['response']['players']
        return list_profiles


    @staticmethod
    #   @cached
    def get_friend_list(user_id):
        '''
            returns a list of user_ids, representing each friend the user has
            if the user's profile is private, nothing is returned

            :param user_id: the steam id (64bits int) of the user
        '''
        json_friend_list = ApiWrapper._make_request("ISteamUser", "GetFriendList", "v0001" , steamid=user_id)
        return [friend['steamid'] for friend in json_friend_list['friendslist']['friends']]

        
    @staticmethod
    @cached_timeout(1000000)
    def get_owned_games_with_appinfo(user_id):
        return ApiWrapper._get_owned_games(user_id, include_appinfo=True)
    
    @staticmethod
    @cached_timeout(1000000)
    def get_owned_games_without_appinfo(user_id):
        return ApiWrapper._get_owned_games(user_id, include_appinfo=False)
    
    @staticmethod
    def _get_owned_games(user_id, include_appinfo=None):
        '''
            returns a list of games, as described in the GetOwnedGames Steam API route

            :param user_id: the steam id (64bits int) of the user
            :param include_appinfo: boolean, adds some infos in the output, default False
        '''
        #TODO: we might use the 'appids_filter' option to lighten the query
        if include_appinfo is None:
            include_appinfo = False

        json_owned_list = ApiWrapper._make_request("IPlayerService", "GetOwnedGames", "v0001" , steamid=user_id, include_appinfo=include_appinfo)
        if 'games' in json_owned_list['response']:
            return json_owned_list['response']['games']
        else:
            return []

    @staticmethod
    def _make_request(category, method, version, **params):
        if ApiWrapper._KEY is None:
            raise ApiWrapperException("Steam API key is not set in .env file.")
        params['key'] = ApiWrapper._KEY

        # format special parameters
        for key in params:
            if type (params[key]) is list:
                params[key] = ','.join([str(item) for item in params[key]])
            if type(params[key]) is bool:
                params[key] = 1 if params[key] else 0

        r = requests.get("%s%s/%s/%s" % (ApiWrapper._URL, category,
                                         method, version), params=params)
        return r.json()
