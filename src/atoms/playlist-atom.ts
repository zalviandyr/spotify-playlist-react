import { PlaylistModel } from "../models";
import { atom } from "recoil";

export interface PlaylistState {
  playlists: Array<PlaylistModel>;
  isConvertProcess: Array<boolean>;
  isFetching: boolean;
  isModalCreateOpen: boolean;
}

export const playlistAtom = atom<PlaylistState>({
  key: "playlistAtom",
  default: {
    playlists: [],
    isConvertProcess: [],
    isFetching: true,
    isModalCreateOpen: false,
  },
});
