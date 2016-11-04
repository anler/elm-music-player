module Routes exposing (..)

import UrlParser exposing (..)
import Navigation


routes : Parser (RouteName -> a) a
routes =
    oneOf
        [ format HomeRoute (s "")
        , format AboutRoute (s "about")
        ]


type RouteName
    = HomeRoute
    | AboutRoute
    | NotFoundRoute


type alias Route =
    { name : RouteName
    , location : Navigation.Location
    }
