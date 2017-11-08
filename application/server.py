# -*- coding: utf-8 -*-

import logging
import logging.config
import datetime
from steamnetwork import app



def main():
    import os
    # see .env file
    debug = os.environ["DEBUG"] == "True"
    app.run(debug=debug, host="0.0.0.0")


if __name__ == "__main__":
    main()
