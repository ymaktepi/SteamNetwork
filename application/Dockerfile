FROM python:3.5
MAINTAINER Nicolas Huguenin "nichuguen@gmail.com"

WORKDIR /app

COPY requirements.txt /tmp/requirements.txt

RUN python -m pip install -r /tmp/requirements.txt

CMD ["python", "main.py"]
