from datetime import datetime, timezone
import enum, uuid
from flask import Flask
from flask_smorest import Api, Blueprint 
from marshmallow import Schema, fields
from flask_smorest.blueprint import MethodView

server = Flask(__name__)

class APIConfig:
    API_TITLE = "TODO API"
    API_VERSION = "v1"
    OPENAPI_VERSION = "3.1.0"
    OPENAPI_URL_PREFIX = "/"
    OPENAPI_SWAGGER_UI_PATH = "/docs"
    OPENAPI_SWAGGER_UI_URL = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"

server.config.from_object(APIConfig)

api = Api(server)

todo = Blueprint("todo", "todo", url_prefix="/todo", description="TODO API")

tasks = [
    {
        "id": uuid.UUID("cef0e157-8dfa-4881-9f27-80a91d40f624"),
        "created": datetime.now(timezone.utc),
        "completed": False,
        "task": "Create Flask API Tutorial",
    }
]

class CreateTask(Schema):
    task = fields.String()

class UpdateTask(CreateTask):
    completed = fields.Bool()

class Task(UpdateTask):
    id = fields.UUID()
    created = fields.DateTime()

class ListTasks(Schema):
    tasks = fields.List(fields.Nested(Task))

class SortByEnum(enum.Enum):
    task = "task"
    created = "created"

class SortDirectionEnum(enum.Enum):
    asc = "asc"
    desc = "desc"

class ListTasksParameters(Schema):
    order_by = fields.Enum(SortByEnum, load_default=SortByEnum.created)
    order = fields.Enum(SortDirectionEnum, load_default=SortDirectionEnum.asc)


@todo.route("/tasks")
class TodoCollection(MethodView):

    @todo.arguments(ListTasksParameters, location="query")
    @todo.response(status_code=200, schema=ListTasks)
    def get(self, parameters):
        return {
            "tasks": sorted(
                tasks,
                key=lambda task: task[parameters["order_by"].value],
                reverse=parameters["order"] == SortDirectionEnum.desc
            )
        }

    @todo.arguments(CreateTask)
    @todo.response(status_code=201, schema=Task)
    def post(self, task):
        task["id"] = uuid.uuid4()
        task["created"] = datetime.now(timezone.utc)
        task["completed"] = False
        tasks.append(task)


api.register_blueprint(todo)
