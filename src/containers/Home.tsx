import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Playlist } from ".";
import { useRecoilState } from "recoil";
import { homeAtom } from "../atoms";
import { SessionKey } from "../constants/session-key";
import { Notification } from "../components";

export function Home() {
  const [homeState, setHomeState] = useRecoilState(homeAtom);

  useEffect(() => {
    console.log("useEffect: Home");

    // check if access token exist
    const accessToken = sessionStorage.getItem(SessionKey.accessToken);

    if (accessToken) {
      setHomeState({ accessToken });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getStartedAction() {
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const redirectUrl = [window.location.protocol, "//", window.location.host, "/callback"].join("");

    const scopes = [
      "user-read-private",
      "playlist-modify-private",
      "playlist-read-private",
      "playlist-modify-public",
      "playlist-read-collaborative",
    ];
    const scope = encodeURIComponent(scopes.join(","));

    const params = new URLSearchParams({
      client_id: clientId!,
      response_type: "token",
      redirect_uri: redirectUrl!,
      scope: scope,
      show_dialog: "true",
    });

    const spotifyUrl = `https://accounts.spotify.com/authorize?${params}`;

    window.location.assign(spotifyUrl);
  }

  return (
    <div className="relative">
      <Notification />

      <div className="container mx-auto text-center py-5">
        <h1 className="text-xl">Spotify Playlist</h1>
        <h1 className="text-lg">Manage your awesome playlist</h1>

        <div className="mt-5">
          {homeState.accessToken ? (
            <Playlist />
          ) : (
            <div className="flex justify-center">
              <button className="spo-btn flex items-center flex-none" onClick={getStartedAction}>
                {/* <button
                className="spo-btn flex items-center flex-none"
                onClick={() => {
                  setHomeState({ accessToken: "assd" });
                }}
              > */}
                <FontAwesomeIcon icon={["fab", "spotify"]} size="2x" className="mr-2" />
                Get started
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
