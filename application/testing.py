# -*- coding: utf-8 -*-

from steamnetwork.api.api_wrapper import ApiWrapper, ApiWrapperException
from steamnetwork.localconstants import STEAM_API_KEY as KEY
import pprint


pp = pprint.PrettyPrinter(indent=2)
print = pp.pprint

def test_api():
    ApiWrapper.set_api_key(KEY)
    id_ymaktepi = ApiWrapper.get_user_id(76561198001403248)
    print(id_ymaktepi)
    id_gazou = ApiWrapper.get_user_id("thegazou")
    print(id_gazou)
    try:
        print(ApiWrapper.get_user_id("thegazoua"))
    except ApiWrapperException as e:
        print(e)
    print(ApiWrapper.get_user_profiles([id_ymaktepi, id_gazou]))

    print("Friends ymaktepi")
    print(ApiWrapper.get_friend_list(id_ymaktepi))
    print("Friends gazou")
    print(ApiWrapper.get_friend_list(id_gazou))

    print("Games ymaktepi")
    print(ApiWrapper.get_owned_games(id_ymaktepi))
    print("Games gazou")
    print(ApiWrapper.get_owned_games(id_gazou, True))

def main():
    test_api()


if __name__ == "__main__":
    main()
