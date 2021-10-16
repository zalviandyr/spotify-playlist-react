import React from "react";
import { Redirect } from "react-router";
import { SessionKey } from "../constants/session-key";

export function Callback() {
  // get code from url
  const url = "?" + window.location.href.split("#")[1];
  const param = new URLSearchParams(url);
  const accessToken = param.get("access_token");
  const expiresIn = param.get("expires_in");

  if (accessToken && expiresIn) {
    // clear session storage if exist
    sessionStorage.clear();

    // convert timestamp to seconds
    const expireTimestamp = Math.floor(Date.now() / 1000) + parseInt(expiresIn!);

    // set data to session storage
    sessionStorage.setItem(SessionKey.accessToken, accessToken);
    sessionStorage.setItem(SessionKey.expireTimestamp, expireTimestamp.toString());
  }

  return <Redirect push to="/" />;
}
