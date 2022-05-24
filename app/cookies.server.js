import { createCookie } from "@remix-run/node";

export const sessionCookie = createCookie("__session", {
  maxAge: 60 * 60 * 24 * 7,
  httpOnly: true,
  secrets: [process.env.COOKIE_SECRET],
});
