import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { AxiosHelper } from "../../helpers/axios-helper";
import { PlaylistItem, TrackModel } from "../../models";

interface PlaylistDetailState {
  playlistId: string;
  playlist: PlaylistItem | null;
}

class PlaylistDetail extends React.Component<RouteComponentProps, PlaylistDetailState> {
  constructor(props: RouteComponentProps) {
    super(props);

    const { playlistId } = this.props.match.params as any;

    this.state = {
      playlistId: playlistId,
      playlist: null,
    };
  }

  async componentDidMount() {
    // fetch playlist
    const playlistData = await AxiosHelper.get(`https://api.spotify.com/v1/playlists/${this.state.playlistId}`);
    const tracksData = await AxiosHelper.get(
      `https://api.spotify.com/v1/playlists/${this.state.playlistId}/tracks?offset=0&limit=100`
    );
    this.setState({ playlist: PlaylistItem.fromJson(playlistData) });
    const track = TrackModel.fromJson(tracksData);
    console.log(track);
  }

  render() {
    return (
      <div className="container flex flex-row  justify-center mx-auto">
        <p>asd</p>

        <div className="flex flex-col">
          <p className="text-left">{this.state.playlist?.name}</p>

          <div className="border-b border-gray-200 shadow mt-2">
            <table className="spo-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>Owner</th>
                  <th>Track</th>
                  <th>Collaborative</th>
                  <th>Public</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>asdas</td>
                  <td>asdas</td>
                  <td>asds</td>
                </tr>
                {/* {this.state.playlists.map((val, index) => (
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
                  </tr>
                ))} */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(PlaylistDetail);
