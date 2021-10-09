export class PlaylistModel {
  readonly id: string;
  readonly isCollaborative: boolean;
  readonly isPublic: boolean;
  readonly description: string;
  readonly owner: string;
  readonly url: string;
  readonly name: string;
  readonly tracks: number;

  constructor(
    id: string,
    isCollaborative: boolean,
    isPublic: false,
    description: string,
    owner: string,
    url: string,
    name: string,
    tracks: number
  ) {
    this.id = id;
    this.isPublic = isPublic;
    this.isCollaborative = isCollaborative;
    this.description = description;
    this.owner = owner;
    this.url = url;
    this.name = name;
    this.tracks = tracks;
  }

  static fromJson(json: any): PlaylistModel {
    return new PlaylistModel(
      json["id"],
      json["collaborative"],
      json["public"],
      json["description"],
      json["owner"]["display_name"],
      json["external_urls"]["spotify"],
      json["name"],
      json["tracks"]["total"]
    );
  }

  static fromJsonToArray(json: any): Array<PlaylistModel> {
    const playlists: Array<PlaylistModel> = [];
    for (let i = 0; i < json["items"].length; i++) {
      const item = json["items"][i];

      playlists.push(
        new PlaylistModel(
          item["id"],
          item["collaborative"],
          item["public"],
          item["description"],
          item["owner"]["display_name"],
          item["external_urls"]["spotify"],
          item["name"],
          item["tracks"]["total"]
        )
      );
    }

    return playlists;
  }
}
