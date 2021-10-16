import { PlaylistModel } from "../models";
import { atom } from "recoil";

export interface PlaylistState {
  playlists: Array<PlaylistModel>;
  isConvertProcess: Array<boolean>;
  isImportProcess: Array<boolean>;
  isFetching: boolean;
  isModalCreateOpen: boolean;
}

export const playlistAtom = atom<PlaylistState>({
  key: "playlistAtom",
  default: {
    playlists: [],
    isConvertProcess: [],
    isImportProcess: [],
    isFetching: true,
    isModalCreateOpen: false,
  },
});
