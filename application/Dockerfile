FROM python:3.5.3
MAINTAINER Nicolas Huguenin "nichuguen@gmail.com"

WORKDIR /app

COPY requirements.txt /tmp/requirements.txt

RUN python -m pip install -r /tmp/requirements.txt


RUN git clone https://github.com/smiley/steamapi.git /tmp/steamapi
RUN cd /tmp/steamapi && python3 setup.py install 


CMD ["python", "server.py"]
