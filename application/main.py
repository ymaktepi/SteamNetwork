# -*- coding: utf-8 -*-

import server
import testing

def main():
    import os
    # see .env file
    test = os.environ["TESTING"] == "True"
    if test:
        testing.main()
    else:
        server.main()


if __name__ == "__main__":
    main()
