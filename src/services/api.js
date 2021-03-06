import "isomorphic-fetch";

const apiBase =
  process.env.REACT_APP_NETWORK === "testnet"
    ? "https://time-testnet.decred.org:59152"
    : "https://time.decred.org:49152";

const getUrl = (path, version = "v1") => `${apiBase}/${version}/${path}`;

const getOptions = (json, method) => ({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  },
  method,
  body: JSON.stringify(json)
});

const parseResponseBody = response => {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json"))
    return response.json();
  const err = new Error("Invalid server response");
  err.internalError = true;
  err.statusCode = response.status;
  throw err;
};

const parseResponse = response =>
  parseResponseBody(response).then(json => {
    if (json.error) {
      const err = new Error(json.error);
      err.internalError = false;
      err.errorID = json.error;
      throw err;
    }
    return json;
  });

const POST = (path, json) =>
  fetch(getUrl(path), getOptions(json, "POST")).then(parseResponse);

export const timestampFiles = (digests, id) =>
  POST("timestamp/", {
    digests
  });

export const verifyFiles = (digests, id) =>
  POST("verify/", {
    digests
  });
