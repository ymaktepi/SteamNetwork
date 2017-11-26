# -*- coding: utf-8 -*-

from steamnetwork import app



def main():
    import os
    # see .env file
    debug = os.environ["DEBUG"] == "True"
    app.run(debug=debug, host="0.0.0.0")


if __name__ == "__main__":
    main()
