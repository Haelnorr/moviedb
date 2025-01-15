from flask_smorest import Blueprint
from flask_smorest.blueprint import MethodView
from src.api.movies.schemas import SearchMoviesParams, ListMovies, SortDirectionEnum

blp = Blueprint("movies", "movies", url_prefix="/movies", description="Movies API")

@blp.route("/search")
class Movies(MethodView):
    @blp.arguments(SearchMoviesParams, location="json")
    @blp.response(status_code=200, schema=ListMovies)
    def post(self, parameters):
        movies = [{
            "id": 1,
            "rating": "PG",
            "belongs_to_collection": "None",
            "budget": 1000,
            "genres": [{"id":1,"name":"Drama"}],
            "themes": [{"id":1,"name":"Gritty"}],
            "title": "Test Movie"
        }] # query db here       

        return {
            "movies": sorted(
                movies,
                key=lambda movie: movie[parameters["order_by"].value],
                reverse=parameters["order"] == SortDirectionEnum.desc
            )
        }
