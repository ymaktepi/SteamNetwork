# SteamNetwork
A docker-based Steam friends network app.


## Installation

### Docker
#### Prerequisites
- `docker`
- `docker-compose`
#### How-To
1. Configure docker
    - `cp docker-compose-example.yml docker-compose.yml`
    - Change `ports` option in `docker-compose.yml`.
2. Configure the server
    - `cp application/.env-example application/.env`
    - Change the `public` options in `application/.env`
3. Build and run the container
    - `docker-compose up`
4. ???
5. Profit
    - The website is up at localhost:[port-you-specified-in-docker-compose-yml]

### Without docker
#### Prerequisites
- Python 3.5
#### How-To
1. Configure the server
    - `cp application/.env-example application/.env`
    - Change the `public` options in `application/.env`
    - `source application/.env`
2. Install the python packages
    - (`sudo`)`python3 -m pip install -r application/requirements.txt` 
3. Run the server in local mode
    - `STEAM_API_KEY=$STEAM_API_KEY DEBUG=$DEBUG python3 application/server.py`
4. ???
5. Profit
    - The website is up at localhost:5000
    
    >Note:
    This configuration allows you to have multiple configurations, for example in development/production you'll have to set `DEBUG=False` in `application/.env`.
    Be careful not to put confidential stuff in any file ending with "example", as they are supposed to be versionned on git, and therefore public.
## License
See the LICENSE file.
