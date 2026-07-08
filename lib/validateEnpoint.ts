// An utility function to sanitize the endpoint URL

const PRIVATE_IP_REGEX =
  /^(10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)$/;

export function buildEndpointUrl(endpoint: string, path: string): URL {
  const base = new URL(endpoint);

  const isLocal =
    base.hostname === "localhost" ||
    base.hostname === "127.0.0.1" ||
    base.hostname === "::1" ||
    base.hostname.endsWith(".local") ||
    PRIVATE_IP_REGEX.test(base.hostname);

  if (!["http:", "https:"].includes(base.protocol)) {
    throw new Error("Only HTTP and HTTPS endpoints are supported.");
  }

  if (base.protocol === "http:" && !isLocal) {
    throw new Error("Only HTTPS endpoints are allowed for remote servers.");
  }

  if (base.username || base.password) {
    throw new Error("Credentials in the endpoint URL are not supported.");
  }

  return new URL(path, base);
}
