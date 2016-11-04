module About exposing (..)

import Html exposing (..)


type Msg
    = NoOp


view : Html Msg
view =
    text "hello from about!"
