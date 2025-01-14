import enum

from marshmallow import Schema, fields




class Genre(Schema):
    id = fields.Int()
    name = fields.String()

class Theme(Schema):
    id = fields.Int()
    name = fields.String()

class Language(Schema):
    english_name = fields.String()
    iso_639_1 = fields.String()
    name = fields.String()

class AddMovie(Schema):
    rating = fields.String()
    belongs_to_collection = fields.String()
    budget = fields.Int()
    genres = fields.List(fields.Nested(Genre))
    themes = fields.List(fields.Nested(Theme))
    original_language = fields.String()
    original_title = fields.String()
    overview = fields.String()
    poster_path = fields.String()
    release_date = fields.String()
    revenue = fields.Int()
    runtime = fields.Int()
    spoken_languages = fields.List(fields.Nested(Language))
    tagline = fields.String()
    title = fields.String()
    review = fields.String()


class Movie(AddMovie):
    id = fields.Int()

class ListMovies(Schema):
    movies = fields.List(fields.Nested(Movie))

class SortByEnum(enum.Enum):
    budget = "budget"
    release_date = "release_date"
    revenue = "revenue"
    runtime = "runtime"
    title = "title"
    review = "review"

class SortDirectionEnum(enum.Enum):
    asc = "asc"
    desc = "desc"

class SearchMoviesParams(Schema):
    order_by = fields.Enum(SortByEnum, load_default=SortByEnum.title)
    order = fields.Enum(SortDirectionEnum, load_default=SortDirectionEnum.asc)
    title = fields.String(optional=True)
    genres = fields.List(fields.Nested(Genre))
    themes = fields.List(fields.Nested(Theme))

