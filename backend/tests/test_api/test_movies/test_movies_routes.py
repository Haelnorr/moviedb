def test_search_movies(client):
    # TODO: implement validation of the queried results
    response = client.post("movies/search")
    assert response
