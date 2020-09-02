import { auth } from "../services/firebase";
import { db } from "../services/firebase";

export function signup(email, password, userName) {
  return auth()
    .createUserWithEmailAndPassword(email, password)
    .then(async function () {
      const user = auth().currentUser;
      user.sendEmailVerification();

      await db.ref("users/" + user.uid).set({
        name: userName,
        email: user.email,
      });
    });
}

export function signin(email, password) {
  return auth().signInWithEmailAndPassword(email, password);
}

export function updatepass(newPassword) {
  return auth().currentuser().updatePassword(newPassword);
}

export function forgotpass(emailAddress) {
  return auth()
    .sendPasswordResetEmail(emailAddress)
    .then(function () {
      // Email sent.
      console.log("Email Sent");
    });
}

export function signInWithGoogle() {
  const provider = new auth.GoogleAuthProvider();
  return auth()
    .signInWithPopup(provider)
    .then(async function () {
      const user = auth().currentUser;
      await db.ref("users/" + user.uid).update({
        email: user.email,
        name: user.displayName,
      });
    });
}

export function signInWithGitHub() {
  const provider = new auth.GithubAuthProvider();
  return auth()
    .signInWithPopup(provider)
    .then(async function () {
      const user = auth().currentUser;
      await db.ref("users/" + user.uid).update({
        email: user.email,
        name: user.displayName,
      });
    });
}

export function logout() {
  return auth().signOut();
}
