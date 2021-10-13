import axios from "axios";
import { SessionKey } from "../constants/session-key";

class AxiosHelper {
  readonly accessToken: string | null;

  constructor(accessToken: string | null) {
    this.accessToken = accessToken;
  }

  async get(url: string): Promise<any> {
    let data = null;

    try {
      if (accessToken) {
        const headers = { Authorization: `Bearer ${this.accessToken}` };
        const expireTimestamp = sessionStorage.getItem(SessionKey.expireTimestamp);
        const curTimestamp = Math.floor(Date.now() / 1000);

        if (curTimestamp > parseInt(expireTimestamp!)) {
          await this.refreshToken(url);
        } else {
          const response = await axios.get(url, { headers });
          data = response.data;
        }
      } else {
        const response = await axios.get(url);
        data = response.data;
      }
    } catch (err) {
      const response = (err as any).response;
      console.log(response.data);

      // just to break the code below whosever called
      throw new Error();
    }

    return data;
  }

  async post(url: string, body: {}): Promise<any> {
    let data = null;

    try {
      if (accessToken) {
        const headers = { Authorization: `Bearer ${this.accessToken}` };
        const expireTimestamp = sessionStorage.getItem(SessionKey.expireTimestamp);
        const curTimestamp = Math.floor(Date.now() / 1000);

        if (curTimestamp > parseInt(expireTimestamp!)) {
          await this.refreshToken(url);
        } else {
          const response = await axios.post(url, body, { headers });
          data = response.data;
        }
      }
    } catch (err) {
      const response = (err as any).response;
      console.log(response.data);

      // just to break the code below whosever called
      throw new Error();
    }

    return data;
  }

  private async refreshToken(url: string) {
    // refresh token if access token expire
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const sessionRefreshToken = sessionStorage.getItem(SessionKey.refreshToken);

    const body = new URLSearchParams();
    body.append("grant_type", "refresh_token");
    body.append("refresh_token", sessionRefreshToken!);
    body.append("client_id", clientId!);

    // refresh access token
    const { data } = await axios.post("https://accounts.spotify.com/api/token", body);

    const accessToken = (data as any)["access_token"];
    const refreshToken = (data as any)["refresh_token"];
    const expiresIn = (data as any)["expires_in"];
    // convert timestamp to seconds
    const expireTimestamp = Math.floor(Date.now() / 1000) + parseInt(expiresIn);

    sessionStorage.clear();

    // set data to session storage
    sessionStorage.setItem(SessionKey.accessToken, accessToken);
    sessionStorage.setItem(SessionKey.refreshToken, refreshToken);
    sessionStorage.setItem(SessionKey.expireTimestamp, expireTimestamp.toString());

    // recall api
    this.get(url);
  }
}

const accessToken = sessionStorage.getItem(SessionKey.accessToken);
const axiosHelper: AxiosHelper = new AxiosHelper(accessToken);

export { axiosHelper };
