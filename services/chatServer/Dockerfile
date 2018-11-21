FROM python:3.6.5-alpine

RUN apk update && \
  apk add --virtual build-deps gcc python-dev musl-dev && \
  apk add postgresql-dev && \
  apk add netcat-openbsd

WORKDIR /usr/src/app

COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

ENV FLASK_APP project/__init__.py

COPY . /usr/src/app

EXPOSE 5000

CMD python manage.py run --host=0.0.0.0 --port=5000
