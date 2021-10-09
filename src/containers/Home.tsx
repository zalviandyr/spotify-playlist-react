import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { generateCodeVerifier, generateCodeChallengeFromVerifier } from "../helpers/spotify-helper";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { SessionKey } from "../constants/session-key";
import { Playlist, PlaylistDetail } from ".";

interface HomeState {
  accessToken: string | null;
}

export class Home extends React.Component<{}, HomeState> {
  constructor(props: {}) {
    super(props);

    this.state = { accessToken: null };
  }

  componentDidMount() {
    // check access token
    const accessToken = sessionStorage.getItem(SessionKey.accessToken);
    this.setState({ accessToken });
  }

  async getStartedAction() {
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const redirectUrl = process.env.REACT_APP_SPOTIFY_REDIRECT_URL;
    const scopes = [
      "user-read-private",
      "playlist-modify-private",
      "playlist-read-private",
      "playlist-modify-public",
      "playlist-read-collaborative",
    ];
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallengeFromVerifier(codeVerifier);
    const scope = encodeURIComponent(scopes.join(","));

    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId!,
      redirect_uri: redirectUrl!,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      scope: scope,
    });

    const spotifyUrl = `https://accounts.spotify.com/authorize?${params}`;

    // set code verifier to session storage
    sessionStorage.setItem(SessionKey.codeVerifier, codeVerifier);

    window.location.assign(spotifyUrl);
  }

  render() {
    return (
      <div className="container mx-auto text-center py-5">
        <h1 className="text-xl">Spotify Playlist</h1>
        <h1 className="text-lg">Export your awesome playlist</h1>

        {this.state.accessToken ? (
          <div className="mt-12">
            <Router>
              <Route exact path="/">
                <Playlist />
              </Route>

              <Route exact path="/:playlistId">
                <PlaylistDetail />
              </Route>
            </Router>
          </div>
        ) : (
          <div className="flex justify-center mt-5">
            <button className="btn flex items-center flex-none" onClick={this.getStartedAction}>
              <FontAwesomeIcon icon={["fab", "spotify"]} size="2x" className="mr-2" />
              Get Started
            </button>
          </div>
        )}
      </div>
    );
  }
}
