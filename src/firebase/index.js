import app, { firestore } from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/functions';


export const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
};

app.initializeApp( config );



// export default app;
const auth = app.auth();
export const db = app.firestore();
export const ref = app.firestore().collection('chefs');
export const refRecipes = app.firestore().collection('recipes');
export const refI = app.firestore().collection('ingredients');
export const refUnits = app.firestore().collection('units');


export const storage = app.storage();

export const storageRef = app.storage().ref();
// export const functions = app.functions();

// *** Auth API ***

// doCreateUserWithEmailAndPassword = ( email, password ) =>
//   this.auth.createUserWithEmailAndPassword( email, password );

export const listenAuthState = ( observer ) => {
  return auth.onAuthStateChanged( observer );
};

export const doSignInWithEmailAndPassword = ( email, password ) => {
  return auth.signInWithEmailAndPassword( email, password );
};

export const doLogout = () => auth.signOut();

// ***  User API ***

// const user = uid => db.ref(`users/${uid}`);
//
// const users = () => db.ref('users');

// doPasswordReset = email => this.auth.sendPasswordResetEmail( email );
//
// doPasswordUpdate = password =>
//   this.auth.currentUser.updatePassword( password );



