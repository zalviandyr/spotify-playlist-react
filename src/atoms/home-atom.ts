import { atom } from "recoil";

export interface HomeState {
  accessToken?: string;
}

export const homeAtom = atom<HomeState>({
  key: "homeAtom",
  default: {
    accessToken: undefined,
  },
});
