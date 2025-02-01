ARG PYTHON_VERSION=3.13.1
FROM python:${PYTHON_VERSION}-slim as base

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONBUGGERED=1

WORKDIR /backend

RUN python -m pip install --upgrade pip
RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=backend/requirements.txt,target=requirements.txt \
    python -m pip install -r requirements.txt

RUN addgroup --system --gid 1001 flask
RUN adduser --system --uid 1001 flaskapp

COPY ./backend .

COPY --chown=flaskapp:flask ./compose/backend/entrypoint /entrypoint
RUN sed -i 's/\r$//g' /entrypoint
RUN chmod +x /entrypoint

COPY --chown=flaskapp:flask ./compose/backend/start /start
RUN sed -i 's/\r$//g' /start
RUN chmod +x /start

RUN mkdir /data
RUN chown -R flaskapp:flask /data
RUN chmod -R u+rw /data

USER flaskapp

ENTRYPOINT [ "/entrypoint" ]
