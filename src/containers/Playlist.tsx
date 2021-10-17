import React, { Fragment, SyntheticEvent, useEffect } from "react";
import blobStream from "blob-stream";
import ReactLoading from "react-loading";
import { useRecoilState, useSetRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format, parse } from "fast-csv";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { PlaylistModel, PlaylistItem, CreatePlaylistModel } from "../models";
import { AxiosHelper } from "../helpers/axios-helper";
import { Track, TrackModel } from "../models/TrackModel";
import { CreatePlaylistModal } from "../components";
import { playlistAtom, notificationAtom } from "../atoms";
import "react-circular-progressbar/dist/styles.css";

export function Playlist() {
  const setNotificationState = useSetRecoilState(notificationAtom);
  const [playlistState, setPlaylistState] = useRecoilState(playlistAtom);

  useEffect(() => {
    console.log("useEffect: Playlist");

    fetchPlaylist();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setConvertProcessLoading(index: number, progress: number, isLoading: boolean) {
    setPlaylistState((curVal) => ({
      ...curVal,
      convertProcess: curVal.convertProcess.map((_, i) => {
        if (i === index) {
          return { progress: Math.round(progress), isProcess: isLoading };
        } else {
          return curVal.convertProcess[i];
        }
      }),
    }));
  }

  function setImportProcessLoading(index: number, progress: number, isLoading: boolean) {
    setPlaylistState((curVal) => ({
      ...curVal,
      importProcess: curVal.importProcess.map((_, i) => {
        if (i === index) {
          return { progress: Math.round(progress), isProcess: isLoading };
        } else {
          // prev status
          return curVal.importProcess[i];
        }
      }),
    }));
  }

  function openModalCreateAction() {
    setPlaylistState((curVal) => ({
      ...curVal,
      isModalCreateOpen: true,
    }));
  }

  function closeModalCreateAction() {
    setPlaylistState((curVal) => ({
      ...curVal,
      isModalCreateOpen: false,
    }));
  }

  async function fetchPlaylist(url: string = "https://api.spotify.com/v1/me/playlists") {
    setPlaylistState((curVal) => ({
      ...curVal,
      isFetching: true,
    }));

    // get playlist
    try {
      const data = await AxiosHelper.get(url);
      const playlist = PlaylistModel.fromJson(data);

      if (playlistState.convertProcess.length === 0 || playlistState.importProcess.length === 0) {
        setPlaylistState((curVal) => ({
          ...curVal,
          // generate array base on playlist length, fill with false value
          convertProcess: Array.from({ length: playlist.items.length }, () => ({ progress: 0, isProcess: false })),
          // generate array base on playlist length, fill with false value
          importProcess: Array.from({ length: playlist.items.length }, () => ({ progress: 0, isProcess: false })),
        }));
      }

      setPlaylistState((curVal) => ({
        ...curVal,
        playlist: playlist,
        isFetching: false,
      }));
    } catch (err) {
      // if get response 403 (User not register using developer mode)
      const response = (err as any).response;
      if (response) {
        const status = response.status;
        if (status === 403) {
          sessionStorage.clear();

          setNotificationState({
            isShow: true,
            isError: true,
            message: "Make sure user already create app in Spotify Developer and re-check Client ID",
          });
        }
      }
    }
  }

  async function createPlaylistSubmit(data: CreatePlaylistModel) {
    try {
      const profileData = await AxiosHelper.get("https://api.spotify.com/v1/me");
      const id = profileData.id;
      const body = {
        name: data.name,
        description: data.description,
        public: data.isPublic ? "true" : "false",
        collaborative: data.isCollaborative ? "true" : "false",
      };
      await AxiosHelper.post(`https://api.spotify.com/v1/users/${id}/playlists`, body);

      // refetch playlist
      fetchPlaylist();

      setNotificationState({
        isShow: true,
        isError: false,
        message: "Success to create playlist",
      });
    } catch (err) {
      setNotificationState({
        isShow: true,
        isError: true,
        message: "Failed to create playlist",
      });
    }
  }

  async function exportAction(playlist: PlaylistItem, index: number) {
    setConvertProcessLoading(index, 0, true);

    // init next
    let isNext = true;
    const fullTracks: Array<Track> = [];
    // fetch until next url null
    let urlTrack = `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?offset=0&limit=100`;
    let trackCounter = 0;
    while (isNext) {
      // fetch tracks from playlist
      const data = await AxiosHelper.get(urlTrack);
      const track = TrackModel.fromJson(data);

      // set genre
      for (let i = 0; i < track.tracks.length; i++) {
        trackCounter += 1;
        const item = track.tracks[i];
        const genresTrack: Array<string> = [];
        // get genre from artist
        for (let j = 0; j < item.artists.length; j++) {
          const artist = item.artists[j];
          const artistData = await AxiosHelper.get(`https://api.spotify.com/v1/artists/${artist.id}`);
          const genres: Array<string> = artistData["genres"];
          genresTrack.push(...genres);
        }
        // remove duplicate genre
        const genresUnique = Array.from(new Set(genresTrack));
        item.genres.push(...genresUnique);

        if (track.next === null) {
          isNext = false;
        } else {
          urlTrack = track.next;
        }

        const progress = (trackCounter / playlist.tracks) * 100;
        setConvertProcessLoading(index, progress, true);
      }

      // push to full track
      fullTracks.push(...track.tracks);
    }

    const headers = ["Added At", "Album", "Artist", "Title", "Duration", "Genre", "Release Date", "Uri"];

    const blob = blobStream();
    // magic stuff for encoding formatting (BOM)
    const stream = format({ writeBOM: true });
    stream.pipe(blob);
    stream.write(headers);
    for (let i = 0; i < fullTracks.length; i++) {
      const item = fullTracks[i];

      stream.write([
        item.addedAt,
        item.album,
        item.artists.map((val) => val.name).join("|"),
        item.title,
        item.duration,
        item.genres.join("|"),
        item.releaseDate,
        item.uri,
      ]);
    }

    stream.end();

    // create download url
    const url = blob.toBlobURL("text/csv");
    const link = document.createElement("a");
    // set url and file name
    link.setAttribute("href", url);
    link.setAttribute("download", `${playlist.name}.csv`);
    link.click();

    setConvertProcessLoading(index, 0, false);
  }

  function importAction(playlist: PlaylistItem, index: number, event: SyntheticEvent) {
    const files = (event.target as any).files;

    if (files.length > 0) {
      setImportProcessLoading(index, 0, true);

      const file: File = files[0];
      const reader: FileReader = new FileReader();
      const uris: string[] = [];
      let urisLength = 0;

      reader.readAsText(file);
      reader.onload = (e) => {
        const stream = parse({ headers: true })
          .on("error", () => {
            setNotificationState({
              isShow: true,
              isError: true,
              message: "Failed parsing to CSV",
            });

            setImportProcessLoading(index, 0, false);
          })
          .on("data", (row) => uris.push(row["Uri"]))
          .on("end", async () => {
            try {
              urisLength = uris.length;
              let trackCounter = 0;
              while (true) {
                const urisOffset = uris.splice(0, 100);
                trackCounter += urisOffset.length;

                const body = { uris: urisOffset };
                await AxiosHelper.post(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, body);

                const progress = (trackCounter / urisLength) * 100;
                setImportProcessLoading(index, progress, true);

                if (uris.length === 0) {
                  break;
                }
              }

              setNotificationState({
                isShow: true,
                isError: false,
                message: `Success import playlist, ${urisLength} tracks`,
              });

              fetchPlaylist();
            } catch (err) {
              setNotificationState({
                isShow: true,
                isError: true,
                message: "Failed import playlist",
              });
            } finally {
              setImportProcessLoading(index, 0, false);
            }
          });

        stream.write(reader.result);
        stream.end();
      };
    }
  }

  return (
    <div className="container flex justify-center mx-auto">
      {playlistState.isFetching ? (
        <ReactLoading type="bars" color="#34D399" />
      ) : (
        <Fragment>
          <div className="grid auto-cols-max">
            <div className="flex justify-center">
              <button className="spo-btn flex items-center" onClick={openModalCreateAction}>
                <FontAwesomeIcon icon={["fas", "plus"]} size="2x" className="mr-2" />
                Create playlist
              </button>
            </div>

            <div className="border-b border-gray-200 shadow mt-12">
              <table className="spo-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Owner</th>
                    <th>Track</th>
                    <th>Collaborative</th>
                    <th>Public</th>
                    <th className="text-center">Export</th>
                    <th className="text-center">Import</th>
                  </tr>
                </thead>
                <tbody>
                  {playlistState.playlist.items.map((val, index) => (
                    <tr key={val.id}>
                      <td>{playlistState.playlist.offset + (index + 1)}</td>
                      <td>{val.name}</td>
                      <td>{val.owner}</td>
                      <td>{val.tracks}</td>
                      <td>
                        {val.isCollaborative ? (
                          <FontAwesomeIcon icon={["fas", "check-circle"]} color="grey" size="lg" />
                        ) : (
                          <span />
                        )}
                      </td>
                      <td>
                        {val.isPublic ? (
                          <FontAwesomeIcon icon={["fas", "check-circle"]} size="lg" className="text-gray-400" />
                        ) : (
                          <span />
                        )}
                      </td>
                      <td className="text-center">
                        {playlistState.convertProcess[index].isProcess ? (
                          <div className="w-9 h-9 inline-block">
                            <CircularProgressbar
                              value={playlistState.convertProcess[index].progress}
                              text={`${playlistState.convertProcess[index].progress}%`}
                              styles={buildStyles({
                                textSize: "35px",
                                textColor: "#34D399",
                                pathColor: "#34D399",
                              })}
                            />
                          </div>
                        ) : (
                          <FontAwesomeIcon
                            icon={["fas", "download"]}
                            size="lg"
                            className="text-green-400 cursor-pointer w-9 h-9"
                            onClick={() => exportAction(val, index)}
                          />
                        )}
                      </td>

                      <td className="text-center">
                        {playlistState.importProcess[index].isProcess ? (
                          <div className="w-9 h-9 inline-block">
                            <CircularProgressbar
                              value={playlistState.importProcess[index].progress}
                              text={`${playlistState.importProcess[index].progress}%`}
                              styles={buildStyles({
                                textSize: "35px",
                                textColor: "#4F46E5",
                                pathColor: "#4F46E5",
                              })}
                            />
                          </div>
                        ) : (
                          <>
                            <label htmlFor="csvFile">
                              <FontAwesomeIcon
                                icon={["fas", "upload"]}
                                size="lg"
                                className="text-indigo-600 cursor-pointer w-9 h-9"
                              />
                            </label>
                            <input
                              type="file"
                              className="sr-only"
                              id="csvFile"
                              onChange={(event) => importAction(val, index, event)}
                            />
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="spo-pagination">
              <p>
                Showing <span>{playlistState.playlist.offset + 1} </span>to
                <span> {playlistState.playlist.offset + playlistState.playlist.items.length} </span>
                of
                <span> {playlistState.playlist.total} </span>results
              </p>

              <div className="spo-pagination-nav">
                <button
                  className={`spo-pagination-prev ${playlistState.playlist.previous ? "" : "sr-only"}`}
                  onClick={() => fetchPlaylist(playlistState.playlist.previous)}
                >
                  <FontAwesomeIcon icon={["fas", "arrow-left"]} size="lg" color="#4B5563" />
                  <p>Previous</p>
                </button>

                <button
                  className={`spo-pagination-next ${playlistState.playlist.next ? "" : "sr-only"}`}
                  onClick={() => fetchPlaylist(playlistState.playlist.next)}
                >
                  <p>Next</p>
                  <FontAwesomeIcon icon={["fas", "arrow-right"]} size="lg" color="#4B5563" />
                </button>
              </div>
            </div>
          </div>

          <CreatePlaylistModal
            isModalCreateOpen={playlistState.isModalCreateOpen}
            onClose={closeModalCreateAction}
            onSubmitForm={(data) => createPlaylistSubmit(data)}
          />
        </Fragment>
      )}
    </div>
  );
}
