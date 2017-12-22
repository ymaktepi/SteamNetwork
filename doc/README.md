# SteamNetwork - Documentation

## Data

We used the [Steam Web API](https://developer.valvesoftware.com/wiki/Steam_Web_API) to obtain the raw data for this project.

We did not use all the data from this API, we filtered them and kept two main objects:
- User
- Game

### User
Object describing an user.
#### Properties
- `steam_id`: integer
- `persona_name`: string, the user's dispay name
- `profile_url`: string
- `avatar`: string, url of the user's 184x184px profile picture
- `persona_state`: integer, The user's current status.
  - 0 - Offline
  - 1 - Online 
  - 2 - Busy
  - 3 - Away 
  - 4 - Snooze
  - 5 - looking to trade
  - 6 - looking to play
- `last_logoff`: integer, last time the user was online, in unix time
- `games`: list of simple game objects having the following properties:
  - `app_id`: integer, the id of the game, referring to a game object
  - `playtime_2_weeks`: integer, number of minutes the user played this game in the last two weeks
  - `playtime_total`: integer, number of minutes the user played this game since 2009 (begining of the game time record by steam)


### Game
Object describing a game.
#### Properties
- `app_id`: integer, id of the game
- `name`: string, name of the game
- `img_icon_url`: url of the game's icon
- `img_logo_url`: url of the game's logo

## Intention, Message to get through

The goal of the project is to find friends who consistently play games we own. Steam itself doesn't provide a tool that groups the gametime of each game you own, and you therefore must iterate through all your games to find which game is currently the most trendy.

## Representation

The first idea was to create a bubble chart graph with link between bubble. Each bubble represent a friend with a game that you own, this idea come after exploring the [example](https://naustud.io/tech-stack/) of the [D3](https://github.com/d3/d3/wiki/Gallery) library.
This idea was abandoned at the beginning of the project because this representation was nicer than effective. In fact we doesn't know how to coroletate the game and the friend in the bubble for have simple information.

The next idea that we have is the chord diagrame 
![chordDiagrame](./images_wiki/chord diagram.PNG)



Why pie chart
Why bar chart

## Presentation and interaction

## Tools Review

### CanvasJS 
[CanvasJS](https://canvasjs.com/) was great for prototyping, you can easily enter your data, give a title, a mouseover, and standard information. But you can't customize everything, which is required in a Information Visualization project.

TODO: example output with canvasJS 

### D3.js

[D3js](https://d3js.org/) was finally chosen to draw both of the chart types. Since it is a tool that can easily be used to draw SVG pictures, you can fully customize your visualization.

For example, the main differences we could implement are:
- Fixed bar height in the bar chart
  - Canvas JS divides the total height of the canvas by the number of inputs, in such way that the canvas is rendered unreadable when there is many inputs.
- Customized textures for the bar chart.
- Value of the input at the right of the bars in the bar chart.
- Selecting friends in the pie chart.
- Separating the legend from the pie chart.
  - CanvasJS is a single object that can't be split.


todo: final output with D3
