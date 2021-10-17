export class CreatePlaylistModel {
  name: string;
  description: string;
  isPublic: boolean;
  isCollaborative: boolean;

  constructor(name: string, description: string, isPublic: boolean, isCollaborative: boolean) {
    this.name = name;
    this.description = description;
    this.isPublic = isPublic;
    this.isCollaborative = isCollaborative;
  }
}
