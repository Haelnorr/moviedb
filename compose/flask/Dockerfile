ARG PYTHON_VERSION=3.13.1
FROM python:${PYTHON_VERSION}-slim as base

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONBUGGERED=1

WORKDIR /backend

RUN python -m pip install --upgrade pip
RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=backend/requirements.txt,target=requirements.txt \
    python -m pip install -r requirements.txt

COPY ./backend .

RUN mkdir /var/log/backend
RUN chmod o+rw -R /var/log/backend

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "src.run:app"]
