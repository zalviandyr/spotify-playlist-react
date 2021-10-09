import { millisToMinutesAndSeconds } from "../helpers/string-helper";
export class TrackModel {
  readonly next: string;
  readonly tracks: Array<Track>;

  constructor(next: string, tracks: Array<Track>) {
    this.next = next;
    this.tracks = tracks;
  }

  static fromJson(json: any): TrackModel {
    const next = json["next"];
    const track = json["items"];
    const tracks: Array<Track> = Track.fromJson(track);

    return new TrackModel(next, tracks);
  }
}

export class Track {
  readonly addedAt: string;
  readonly artists: Array<Artist>;
  readonly album: string;
  readonly title: string;
  readonly genres: Array<string>;
  readonly duration: string;
  readonly releaseDate: string;
  readonly uri: string;

  constructor(
    addedAt: string,
    artists: Array<Artist>,
    album: string,
    title: string,
    duration: string,
    releaseDate: string,
    uri: string
  ) {
    this.addedAt = addedAt;
    this.artists = artists;
    this.album = album;
    this.title = title;
    this.genres = [];
    this.duration = duration;
    this.releaseDate = releaseDate;
    this.uri = uri;
  }

  static fromJson(json: any): Array<Track> {
    const tracks: Array<Track> = [];

    for (let i = 0; i < json.length; i++) {
      const item = json[i];

      tracks.push(
        new Track(
          item["added_at"],
          Artist.fromJson(item["track"]["artists"]),
          item["track"]["album"]["name"],
          item["track"]["name"],
          millisToMinutesAndSeconds(item["track"]["duration_ms"]),
          item["track"]["album"]["release_date"],
          item["track"]["uri"]
        )
      );
    }

    return tracks;
  }
}

class Artist {
  readonly id: string;
  readonly name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  static fromJson(json: any): Array<Artist> {
    const artists: Array<Artist> = [];

    for (let i = 0; i < json.length; i++) {
      const item = json[i];

      artists.push(new Artist(item["id"], item["name"]));
    }

    return artists;
  }
}
