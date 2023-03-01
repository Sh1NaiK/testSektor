import { Router } from "express";
import {
  getAll,
  signUp,
  signIn,
  userUpdate,
  getUser,
} from "../controllers/users";
import { body } from "express-validator/src/middlewares/validation-chain-builders";

const router = Router();

//get all users
router.get("/profiles", getAll);

//user registration
router.post(
  "/user/register",
  [
    body("name")
      .isLength({ min: 4 })
      .withMessage("Password must be at least 4 characters long"),
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .isLength({ min: 4 })
      .withMessage("Password must be at least 4 characters long"),
  ],
  signUp
);

//user authorization
router.post(
  "/user/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 4 })
      .withMessage("Password must be at least 4 characters long"),
  ],
  signIn
);

//user update
router.put(
  "/profile/:id",
  [
    body("name")
      .isLength({ min: 4 })
      .withMessage("Password must be at least 4 characters long"),
    body("surname")
      .isLength({ min: 4 })
      .withMessage("Password must be at least 4 characters long"),
    body("email").isEmail().withMessage("Invalid email"),
  ],
  userUpdate
);

//get user by id
router.get("/profile/:id", getUser);

export default router;
