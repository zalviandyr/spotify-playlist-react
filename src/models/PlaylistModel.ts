export class PlaylistModel {
  readonly items: Array<PlaylistItem>;
  readonly offset: number;
  readonly next?: string;
  readonly previous?: string;

  constructor(items: Array<PlaylistItem>, offset: number, next?: string, previous?: string) {
    this.items = items;
    this.offset = offset;
    this.next = next;
    this.previous = previous;
  }

  static fromJson(json: any): PlaylistModel {
    return new PlaylistModel(
      PlaylistItem.fromJsonToArray(json["items"]),
      json["offset"],
      json["next"],
      json["previous"]
    );
  }
}

export class PlaylistItem {
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

  static fromJson(json: any): PlaylistItem {
    return new PlaylistItem(
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

  static fromJsonToArray(json: any): Array<PlaylistItem> {
    const playlists: Array<PlaylistItem> = [];
    for (let i = 0; i < json.length; i++) {
      const item = json[i];

      playlists.push(
        new PlaylistItem(
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
