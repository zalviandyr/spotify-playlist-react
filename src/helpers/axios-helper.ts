import axios from "axios";
import { SessionKey } from "../constants/session-key";
import { ResponseError } from "../errors";

export class AxiosHelper {
  static async get(url: string): Promise<any> {
    const accessToken = sessionStorage.getItem(SessionKey.accessToken);
    let data = null;

    try {
      if (accessToken) {
        const headers = { Authorization: `Bearer ${accessToken}` };
        const expireTimestamp = sessionStorage.getItem(SessionKey.expireTimestamp);
        const curTimestamp = Math.floor(Date.now() / 1000);

        if (curTimestamp > parseInt(expireTimestamp!)) {
          sessionStorage.clear();
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
      throw new ResponseError(response.status, response.data.error);
    }

    return data;
  }

  static async post(url: string, body: {}): Promise<any> {
    const accessToken = sessionStorage.getItem(SessionKey.accessToken);
    let data = null;

    try {
      if (accessToken) {
        const headers = { Authorization: `Bearer ${accessToken}` };
        const expireTimestamp = sessionStorage.getItem(SessionKey.expireTimestamp);
        const curTimestamp = Math.floor(Date.now() / 1000);

        if (curTimestamp > parseInt(expireTimestamp!)) {
          sessionStorage.clear();
        } else {
          const response = await axios.post(url, body, { headers });
          data = response.data;
        }
      }
    } catch (err) {
      const response = (err as any).response;
      console.log(response.data);

      // just to break the code below whosever called
      throw new ResponseError(response.status, response.data.error);
    }

    return data;
  }

  private static toJson(body: URLSearchParams) {
    const bodyJson: any = {};
    body.forEach((val, key) => {
      bodyJson[key] = val;
    });

    return bodyJson;
  }
}
