module Main exposing (main)

import Browser exposing (UrlRequest)
import Browser.Navigation as Nav
import Html
import Url exposing (Url)


main : Program () Model Msg
main =
    Browser.application
        { init = init
        , onUrlChange = UrlChanged
        , onUrlRequest = LinkClicked
        , subscriptions = \_ -> Sub.none
        , update = update
        , view = view
        }


init : () -> Url -> Nav.Key -> ( Model, Cmd Msg )
init flags url navKey =
    ( { navKey = navKey, who = "World" }
    , Nav.replaceUrl navKey "/index"
    )


type alias Model =
    { navKey : Nav.Key
    , who : String
    }


type Msg
    = LinkClicked UrlRequest
    | UrlChanged Url


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    ( model, Cmd.none )


view : Model -> Browser.Document msg
view { who } =
    { title = "Hello - Elm SSR"
    , body =
        [ Html.text ("Hello, " ++ who ++ "!")
        ]
    }
