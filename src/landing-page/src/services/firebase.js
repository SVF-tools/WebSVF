import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/analytics';
import firebaseConfig from '../apis/firebaseConfig';

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const auth = firebase.auth;
export const db = firebase.database();
export const storage = firebase.storage();
