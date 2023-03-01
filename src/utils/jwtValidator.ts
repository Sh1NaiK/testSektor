import jwt from "jsonwebtoken";
import config from "config";

interface UserPayload {
  id: string;
  email: string;
}

const JWT_SECRET = config.get<string>("jwt");

export const validator = (jwtToken: string) => {
  try {
    const payload = jwt.verify(jwtToken, JWT_SECRET) as UserPayload;
    if (payload) return "ok";
  } catch (err) {
    return "invalid jwt";
  }
};
