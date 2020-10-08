import { auth } from "../services/firebase";
import { db } from "../services/firebase";
import {
  awsRunTask,
  containerId,
  hostPort,
  publicIP,
  checkNumberOfRunningTasks,
} from "./aws/ecs";

export function signup(email, password, userName) {
  // clearInstanceData();
  awsRunTask();
  return auth()
    .createUserWithEmailAndPassword(email, password)
    .then(async function () {
      const user = auth().currentUser;
      user.sendEmailVerification();
      db.ref("users/" + user.uid).set({
        name: userName,
        email: user.email,
        instance: "",
        port: "",
        publicIP: "",
      });
      await checkNumberOfRunningTasks();
      setInstanceData(user);
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

function setInstanceData(user) {
  if (containerId !== null && hostPort !== null && publicIP !== null) {
    setTimeout(function () {
      db.ref("users/" + user.uid).update({
        instance: containerId,
        port: hostPort,
        publicIP: publicIP,
      });
    }, 60000);
  } else {
    setTimeout(function () {
      setInstanceData(user);
    }, 10000);
  }
}

function clearInstanceData() {
  setTimeout(function () {
    console.log(
      `values before clearing instance data conatiner id: ${containerId} \n host port: ${hostPort} \n public IP: ${publicIP}`
    );

    containerId = null;
    hostPort = null;
    publicIP = null;

    console.log(
      `values after clearing instance data conatiner id: ${containerId} \n host port: ${hostPort} \n public IP: ${publicIP}`
    );
  }, 90000);
}
