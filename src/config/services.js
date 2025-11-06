import dotenv from "dotenv";
dotenv.config();

export const SERVICES = {
  AUTH: process.env.AUTH_SERVICE_URL,
  URL: process.env.URL_SERVICE_URL,
  REDIRECT: process.env.REDIRECT_SERVICE_URL,
};
