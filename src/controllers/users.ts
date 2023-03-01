import {
  getAllUsers,
  signUpUser,
  userExists,
  updateUser,
  getUserById,
} from "../services/users";
import { Request, Response } from "express";
import { passwordToHash, comparePassword } from "../utils/hashPassword";
import { HttpError } from "../utils/HttpError";
import jwt from "jsonwebtoken";
import config from "config";
import { validator } from "../utils/jwtValidator";

const JWT_SECRET = config.get<string>("jwt");

export const getAll = async (req: Request, res: Response) => {
  try {
    const jwtToken = req.cookies.access_token;
    const jwt = validator(jwtToken);
    if (jwt !== "ok") {
      throw new HttpError(403, "invalid jwt");
    }
    const users = await getAllUsers(Number(req.query?.page));
    res.status(200).json(users);
  } catch (err) {
    if (err instanceof HttpError) {
      const httpErr = err as HttpError;
      res
        .status(httpErr.httpCode)
        .json({ status: "error", data: { message: httpErr.message } });
      return;
    } else {
      const error = err as Error;
      res
        .status(500)
        .json({ status: "error", data: { message: error.message } });
      return;
    }
  }
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new HttpError(400, "invalid body structure");
    }

    const notAllowedSignUp = await userExists(email);
    if (notAllowedSignUp) {
      throw new HttpError(400, "user already exists");
    }

    const hashedPassword = await passwordToHash(password);
    const user = await signUpUser(name, email, hashedPassword);
    res.status(200).json(user);
  } catch (err) {
    if (err instanceof HttpError) {
      const httpErr = err as HttpError;
      res
        .status(httpErr.httpCode)
        .json({ status: "error", data: { message: httpErr.message } });
      return;
    } else {
      const error = err as Error;
      res
        .status(500)
        .json({ status: "error", data: { message: error.message } });
      return;
    }
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const suppliedPassword = req.body.password;

    if (!email || !suppliedPassword) {
      throw new HttpError(400, "invalid body structure");
    }

    const user = await userExists(email);
    if (!user) {
      throw new HttpError(500, "no such user");
    }

    const allowSignIn = await comparePassword(
      String(user?.password),
      suppliedPassword
    );
    if (allowSignIn) {
      const userJwt = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        JWT_SECRET
      );
      res.status(200).json({ jwt: userJwt });
    } else {
      throw new HttpError(400, "invalid credentials");
    }
  } catch (err) {
    if (err instanceof HttpError) {
      const httpErr = err as HttpError;
      res
        .status(httpErr.httpCode)
        .json({ status: "error", data: { message: httpErr.message } });
      return;
    } else {
      const error = err as Error;
      res
        .status(500)
        .json({ status: "error", data: { message: error.message } });
      return;
    }
  }
};

export const userUpdate = async (req: Request, res: Response) => {
  try {
    const jwtToken = req.cookies.access_token;
    const jwt = validator(jwtToken);
    if (jwt !== "ok") {
      throw new HttpError(403, "invalid jwt");
    }

    const profileId = req.params.id;
    const { name, surname, email, gender, photo } = req.body;

    if (name !== undefined && name.length < 4) {
      throw new HttpError(400, "invalid name structure");
    }
    if (surname !== undefined && surname.length < 4) {
      throw new HttpError(400, "invalid surname structure");
    }
    if (gender !== undefined && (gender === "male" || gender === "female")) {
      throw new HttpError(400, "gender name structure");
    }

    const update = await updateUser(
      Number(profileId),
      name,
      surname,
      email,
      gender,
      photo
    );
    res.status(200).json(update);
  } catch (err) {
    if (err instanceof HttpError) {
      const httpErr = err as HttpError;
      res
        .status(httpErr.httpCode)
        .json({ status: "error", data: { message: httpErr.message } });
      return;
    } else {
      const error = err as Error;
      res
        .status(500)
        .json({ status: "error", data: { message: error.message } });
      return;
    }
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const jwtToken = req.cookies.access_token;
    const jwt = validator(jwtToken);
    if (jwt !== "ok") {
      throw new HttpError(403, "invalid jwt");
    }

    const profileId = req.params.id;
    if (!profileId) {
      throw new HttpError(400, "invalid id");
    }

    const user = await getUserById(Number(profileId));
    res.status(200).json(user);
  } catch (err) {
    if (err instanceof HttpError) {
      const httpErr = err as HttpError;
      res
        .status(httpErr.httpCode)
        .json({ status: "error", data: { message: httpErr.message } });
      return;
    } else {
      const error = err as Error;
      res
        .status(500)
        .json({ status: "error", data: { message: error.message } });
      return;
    }
  }
};
