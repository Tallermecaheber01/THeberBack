import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  throw new Error('JWT_SECRET no está definido en las variables de entorno');
}

export function decodeToken(token: string): any {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    console.error('ERROR: Token inválido o expirado', error);
    return null;
  }
}