module NotFound exposing (..)

import Html exposing (..)


type Msg
    = NoOp


view : Html Msg
view =
    text "404 - Not Found"
