# syntax=docker/dockerfile:1
FROM python:3.8-slim-buster

ENV PYTHONUNBUFFERED=0

ENV VERSION 1.0.0

RUN mkdir -p /app
WORKDIR /app

COPY lionel-fridgy/computation-unit/requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 5000

CMD [ "python", "lionel-fridgy/computation-unit/app/computation.py"]
