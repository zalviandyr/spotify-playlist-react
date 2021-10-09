import axios from "axios";
import React from "react";
import { Redirect } from "react-router";
import { SessionKey } from "../constants/session-key";

export class Callback extends React.Component {
  async getAccessToken(code: string) {
    const spotifyUrl = "https://accounts.spotify.com/api/token";
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const redirectUrl = process.env.REACT_APP_SPOTIFY_REDIRECT_URL;
    const codeVerifier = sessionStorage.getItem("codeVerifier");

    const body = new URLSearchParams();
    body.append("client_id", clientId!);
    body.append("grant_type", "authorization_code");
    body.append("code", code);
    body.append("redirect_uri", redirectUrl!);
    body.append("code_verifier", codeVerifier!);

    const { data } = await axios.post(spotifyUrl, body);

    const accessToken = (data as any)["access_token"];
    const refreshToken = (data as any)["refresh_token"];
    const expiresIn = (data as any)["expires_in"];
    // convert timestamp to seconds
    const expireTimestamp = Math.floor(Date.now() / 1000) + parseInt(expiresIn);

    // set data to session storage
    sessionStorage.setItem(SessionKey.accessToken, accessToken);
    sessionStorage.setItem(SessionKey.refreshToken, refreshToken);
    sessionStorage.setItem(SessionKey.expireTimestamp, expireTimestamp.toString());
  }

  render() {
    const param = new URLSearchParams(window.location.search);
    const code = param.get("code");

    if (code) {
      this.getAccessToken(code);
    }

    return <Redirect push to="/" />;
  }
}
