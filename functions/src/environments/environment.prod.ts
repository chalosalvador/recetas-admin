import {Environment} from './environment.model';

export const environment: Environment = {
  mode: 'prod',
  production: false,
  firebase: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: ''
  },
  firebase_admin: '../prodServiceAccount.json',
};
