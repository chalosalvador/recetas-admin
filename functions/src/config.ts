import * as a from 'firebase-admin';
import * as f from 'firebase-functions';

const env = f.config().c.env;
console.log("ENV", env);
let environment = require( './environments/environment').environment;

if(env === 'stage') {
  environment = require( './environments/environment.stage').environment;
} else if(env === 'prod') {
  environment = require( './environments/environment.prod').environment;
}

// const nodemailer = require( 'nodemailer' );
export const moment = require( 'moment-timezone' );

moment.locale( 'es' );
moment.tz.setDefault( 'America/Guayaquil' );


// FIREBASE-ADMIN

const serviceAccount = require( environment.firebase_admin );
export const admin = a;

admin.initializeApp( {
  credential: admin.credential.cert( serviceAccount ),
  databaseURL: environment.firebase.databaseURL
} );

// FIREBASE-FUNCTIONS
export const functions = f;

// REFERENCES DATABASE
export const db = admin.firestore();
const settings = { timestampsInSnapshots: true };
db.settings( settings );


// NODEMAILER
// export const mailTransportZoho = nodemailer.createTransport( {
//   service: 'Zoho',
//   auth: {
//     user: environment.zoho.user,
//     pass: environment.zoho.pass
//   }
// } );

// NODEMAILER
// export const mailTransportMailgun = nodemailer.createTransport( {
//   service: 'Mailgun',
//   auth: {
//     user: environment.mailgun.user,
//     pass: environment.mailgun.pass
//   }
// } );
