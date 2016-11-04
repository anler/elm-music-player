module Router exposing (..)

import Navigation
import UrlParser exposing (parse)
import Routes exposing (Route, RouteName(..), routes)
import Html
import Html.App as Html
import String
import Result exposing (toMaybe)
import Maybe exposing (withDefault)
import Home
import About
import NotFound


program : Program Never
program =
    Navigation.program parseRoute
        { urlUpdate = urlUpdate
        , init = init
        , update = update
        , view = view
        , subscriptions = always Sub.none
        }


parseRoute : Navigation.Parser Route
parseRoute =
    Navigation.makeParser locationToRoute


locationToRoute : Navigation.Location -> Route
locationToRoute location =
    let
        path =
            -- Remove inital /
            String.dropLeft 1 location.pathname

        maybeRoute =
            toMaybe <|
                parse identity routes path
    in
        Route (withDefault NotFoundRoute maybeRoute) location


urlUpdate : Route -> Model -> ( Model, Cmd Msg )
urlUpdate route model =
    { model | route = route } ! []


init : Route -> ( Model, Cmd msg )
init route =
    { route = route } ! []


update : Msg -> Model -> ( Model, Cmd msg )
update msg model =
    model ! []


view : Model -> Html.Html Msg
view model =
    case model.route.name of
        HomeRoute ->
            Html.map HomeMsg Home.view

        AboutRoute ->
            Html.map AboutMsg About.view

        NotFoundRoute ->
            Html.map NotFoundMsg NotFound.view


type Msg
    = HomeMsg Home.Msg
    | AboutMsg About.Msg
    | NotFoundMsg NotFound.Msg


type alias Model =
    { route : Route
    }
