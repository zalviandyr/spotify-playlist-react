import { PlaylistModel } from "../models";
import { atom } from "recoil";

export interface PlaylistState {
  playlist: PlaylistModel;
  convertProcess: Array<{ progress: number; isProcess: boolean }>;
  importProcess: Array<{ progress: number; isProcess: boolean }>;
  isFetching: boolean;
  isModalCreateOpen: boolean;
}

export const playlistAtom = atom<PlaylistState>({
  key: "playlistAtom",
  default: {
    playlist: new PlaylistModel([], 0, 0, 0),
    convertProcess: [],
    importProcess: [],
    isFetching: true,
    isModalCreateOpen: false,
  },
});
