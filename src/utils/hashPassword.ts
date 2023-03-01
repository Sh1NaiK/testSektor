import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export async function passwordToHash(password: string) {
  const secret = randomBytes(8).toString("hex");
  const buffer = (await scryptAsync(password, secret, 64)) as Buffer;

  return `${buffer.toString("hex")}.${secret}`;
}

export async function comparePassword(
  storedPassword: string,
  suppliedPassword: string
) {
  const [hashedPassword, secret] = storedPassword.split(".");
  const buffer = (await scryptAsync(suppliedPassword, secret, 64)) as Buffer;

  return buffer.toString("hex") === hashedPassword;
}
