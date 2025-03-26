import * as jwt from 'jsonwebtoken';

const SECRET_KEY = 'dff3c7ef5be6b1dfa77350c0eeb786c529ecc1312f4660b794cbcc1562ef924a'; // ⚠️ Usa variables de entorno en producción

export function decodeToken(token: string): any {
  try {
    return jwt.verify(token, SECRET_KEY); // 📌 Decodifica el token
  } catch (error) {
    console.error('❌ ERROR: Token inválido o expirado');
    return null;
  }
}
