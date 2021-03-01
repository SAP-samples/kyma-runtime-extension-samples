FROM ubuntu

RUN apt-get update -y && apt-get install -y python3-pip python3-dev

COPY ./requirements.txt /requirements.txt

WORKDIR /

RUN pip3 install -r requirements.txt

COPY . /

EXPOSE 8888

ENTRYPOINT [ "python3" ]

CMD ["app/app.py"]
