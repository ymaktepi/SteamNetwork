# SteamNetwork
A docker-based Steam friends network app.

## Prerequisites
- `docker`
- `docker-compose`

## Installation
1. `cp docker-compose-example.yml docker-compose.yml`
    - Change `ports` option in `docker-compose.yml`.
2. `cp application/.env-example application/.env`
    - Change the `public` options in `application/.env`
3. `docker-compose up`
4. ???
5. Profit
    - The website is up at localhost:[port-you-specified-in-docker-compose-yml]
    
>Note:
This configuration allows you to have multiple configurations, for example in development/production you'll have to set `DEBUG=False` in `application/.env`.
Be careful not to put confidential stuff in any file ending with "example", as they are supposed to be commited.
