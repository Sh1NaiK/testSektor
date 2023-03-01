import { Users } from "../models/users";
import { connect } from "../utils/db";
import config from "config";

const PAGE_SIZE = config.get<number>("userPerPage");

connect();

export async function getAllUsers(page: number) {
  if (!page) page = 1;

  const users = await Users.findAll({
    limit: PAGE_SIZE,
    offset: PAGE_SIZE * (page - 1),
    order: [["created_at", "DESC"]],
  });

  return users;
}

export async function userExists(email: string) {
  const existingUser = Users.findOne({ where: { email: email } });

  return existingUser;
}

export async function signUpUser(
  name: string,
  email: string,
  password: string
) {
  const user = await Users.create({
    name: name,
    email: email,
    password: password,
  });

  return user;
}

export async function updateUser(
  id: number,
  name?: string,
  surname?: string,
  email?: string,
  gender?: string,
  photo?: string
) {
  const user = await Users.update(
    { name, surname, email, gender, photo },
    {
      where: {
        id,
      },
    }
  );

  return user;
}

export async function getUserById(id: number) {
  const user = await Users.findOne({
    where: {
      id: id,
    },
  });

  return user;
}
