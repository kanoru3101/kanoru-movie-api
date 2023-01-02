import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv'

dotenv.config()

const JWT_SIGNING_SECRET = process.env.JWT_SIGNING_SECRET as string;
const PASSWORD_SALT = process.env.PASSWORD_SALT as string;

export const generateJWT = ({ id, email }: {id: string, email: string }): string => {
  const payload = {
    id,
    email,
  }

  return jsonwebtoken.sign(payload, JWT_SIGNING_SECRET, { expiresIn: '30 days', })
}

export const verifyJWT = ({ token }: { token: string}): { id: string, email: string } => {
  const decoded = jsonwebtoken.verify(token, JWT_SIGNING_SECRET) as JwtPayload & {
    id: string;
    email: string;
  };

  return {
    id: decoded.id,
    email: decoded.email
  }
}

export const createPasswordHash = ({ password }: { password: string }): string => 
  crypto
    .pbkdf2Sync(password, PASSWORD_SALT, 1000, 16, 'sha512')
    .toString('hex');
