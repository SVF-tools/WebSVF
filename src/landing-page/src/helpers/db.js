import { db } from '../services/firebase';

export async function getUserById(userId) {
  return db.ref(`users/${userId}`).once('value');
}
