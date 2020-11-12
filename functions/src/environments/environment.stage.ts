import {Environment} from './environment.model';

export const environment: Environment = {
  mode: 'dev',
  production: false,
  firebase: {
    apiKey: 'AIzaSyA3Ev4VYgSdyd6rx0dI_WFYXhr8E8n4Mm8',
    authDomain: 'dev-plan-recetas.firebaseapp.com',
    databaseURL: 'https://dev-plan-recetas.firebaseio.com',
    projectId: 'dev-plan-recetas',
    storageBucket: 'dev-plan-recetas.appspot.com',
    messagingSenderId: '265658966031'
  },
  firebase_admin: '../devServiceAccount.json',
};
