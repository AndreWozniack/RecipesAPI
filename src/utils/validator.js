import crypto from "crypto";

export function isValidNotionPayload(payload) {
  return (
    payload &&
    payload.data &&
    payload.data.object === "page" &&
    payload.data.properties
  );
}

export function verifySignature(body, signature, secret) {
  if (!secret || !signature) return false;

  try {
    const hash = crypto.createHmac("sha256", secret).update(body).digest("hex");

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(hash));
  } catch (err) {
    return false;
  }
}
