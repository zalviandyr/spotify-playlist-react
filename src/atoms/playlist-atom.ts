import { PlaylistModel } from "../models";
import { atom } from "recoil";

export interface PlaylistState {
  playlists: Array<PlaylistModel>;
  convertProcess: Array<{ progress: number; isProcess: boolean }>;
  importProcess: Array<{ progress: number; isProcess: boolean }>;
  isFetching: boolean;
  isModalCreateOpen: boolean;
}

export const playlistAtom = atom<PlaylistState>({
  key: "playlistAtom",
  default: {
    playlists: [],
    convertProcess: [],
    importProcess: [],
    isFetching: true,
    isModalCreateOpen: false,
  },
});
