import React from "react";
import blobStream from "blob-stream";
import ReactLoading from "react-loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { format } from "fast-csv";
import { PlaylistModel } from "../../models";
import { axiosHelper } from "../../helpers/axios-helper";
import { Track, TrackModel } from "../../models/TrackModel";

interface PlaylistState {
  playlists: Array<PlaylistModel>;
  isConvertProcess: Array<boolean>;
}

export class Playlist extends React.Component<{}, PlaylistState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      playlists: [],
      isConvertProcess: [],
    };
  }

  async componentDidMount() {
    // get playlist
    try {
      const data = await axiosHelper.get("https://api.spotify.com/v1/me/playlists");
      const playlists = PlaylistModel.fromJsonToArray(data);

      this.setState({
        playlists: playlists,
        // generate array base on playlist length, fill with false value
        isConvertProcess: Array.from({ length: playlists.length }, () => false),
      });
    } catch (err) {
      // if get response 403 (User not register using developer mode)
      const response = (err as any).response;
      if (response) {
        const status = response.status;
        if (status === 403) {
          sessionStorage.clear();

          alert("Pastikan user sudah membuat app di developer dan client id sama");
        }
      }
    }
  }

  async exportAction(playlist: PlaylistModel, index: number) {
    this.setState((prevState) => ({
      isConvertProcess: prevState.isConvertProcess.map((_, i) => {
        if (i === index) {
          return true;
        } else {
          // prev status
          return prevState.isConvertProcess[i];
        }
      }),
    }));

    // init next
    let isNext = true;
    const fullTracks: Array<Track> = [];
    // fetch until next url null
    let urlTrack = `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?offset=0&limit=100`;
    while (isNext) {
      // fetch tracks from playlist
      const data = await axiosHelper.get(urlTrack);
      const track = TrackModel.fromJson(data);

      // set genre
      for (let i = 0; i < track.tracks.length; i++) {
        const item = track.tracks[i];
        const genresTrack: Array<string> = [];
        // get genre from artist
        for (let j = 0; j < item.artists.length; j++) {
          const artist = item.artists[j];
          const artistData = await axiosHelper.get(`https://api.spotify.com/v1/artists/${artist.id}`);
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

    this.setState((prevState) => ({
      isConvertProcess: prevState.isConvertProcess.map((_, i) => {
        if (i === index) {
          return false;
        } else {
          // prev status
          return prevState.isConvertProcess[i];
        }
      }),
    }));
  }

  render() {
    return (
      <div className="container flex justify-center mx-auto">
        <div className="flex flex-col">
          <div className="border-b border-gray-200 shadow">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>Owner</th>
                  <th>Track</th>
                  <th>Collaborative</th>
                  <th>Public</th>
                  <th className="text-center">Edit</th>
                  <th className="text-center">Delete</th>
                  <th className="text-center">Export</th>
                  <th className="text-center">Import</th>
                </tr>
              </thead>
              <tbody>
                {this.state.playlists.map((val, index) => (
                  <tr key={val.id}>
                    <td>{index + 1}</td>
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
                      <Link to={`/${val.id}`}>
                        <FontAwesomeIcon icon={["fas", "edit"]} size="lg" className="text-blue-400" />
                      </Link>
                    </td>
                    <td className="text-center">
                      <Link to="">
                        <FontAwesomeIcon icon={["far", "trash-alt"]} size="lg" className="text-red-400" />
                      </Link>
                    </td>
                    <td className="flex justify-center">
                      {this.state.isConvertProcess[index] ? (
                        <ReactLoading type="spin" color="#34D399" height="50%" width="50%" />
                      ) : (
                        <FontAwesomeIcon
                          icon={["fas", "download"]}
                          size="lg"
                          className="text-green-400 cursor-pointer"
                          onClick={() => this.exportAction(val, index)}
                        />
                      )}
                    </td>
                    <td className="flex justify-center">
                      <FontAwesomeIcon icon={["fas", "upload"]} size="lg" className="text-green-400 cursor-pointer" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
