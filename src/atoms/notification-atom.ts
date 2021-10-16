import { atom } from "recoil";

export interface NotificationState {
  isShow: boolean;
  isError: boolean;
  message: string;
}

export const notificationAtom = atom<NotificationState>({
  key: "notificationAtom",
  default: {
    isShow: false,
    isError: false,
    message: "",
  },
});
