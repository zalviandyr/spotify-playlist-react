const sha256 = (plain: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
};

const base64urlencode = (a: string) => {
  return btoa(a).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export const generateCodeVerifier = () => {
  let str = "";
  const array = new Uint8Array(96);
  const bytes = window.crypto.getRandomValues(array);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    str += String.fromCharCode(bytes[i]);
  }

  return base64urlencode(str);
};

export const generateCodeChallengeFromVerifier = async (codeVerifier: string) => {
  const hashed = await sha256(codeVerifier);

  let hashedStr = "";
  const bytes = new Uint8Array(hashed);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    hashedStr += String.fromCharCode(bytes[i]);
  }

  const base64encoded = base64urlencode(hashedStr);
  return base64encoded;
};
