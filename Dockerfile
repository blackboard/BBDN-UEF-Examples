FROM  tiangolo/meinheld-gunicorn-flask:latest
RUN apt-get update 
RUN pip install --upgrade pip ## gets rid of the pip version warning…
ADD requirements.txt /tmp
RUN pip install -r /tmp/requirements.txt
COPY ./app /app
RUN python /app/build_config.py
ADD gunicorn_config.py /gunicorn_config.py
EXPOSE 5000
ENTRYPOINT ["gunicorn", "--config", "/gunicorn_config.py", "wsgi:app"]
