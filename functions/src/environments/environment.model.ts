<<<<<<< HEAD
/**
 * Add:
 * environment.ts
 * environment.prod.ts
 * environment.stage.ts
 */
export interface Environment {
  mode : string;
  production : boolean;
  firebase : {
    apiKey : string,
    authDomain : string,
    databaseURL : string,
    projectId : string,
    storageBucket : string,
    messagingSenderId : string
  };
  firebase_admin : string
}
=======
/**
 * Add:
 * environment.ts
 * environment.prod.ts
 * environment.stage.ts
 */
export interface Environment {
  mode : string;
  production : boolean;
  firebase : {
    apiKey : string,
    authDomain : string,
    databaseURL : string,
    projectId : string,
    storageBucket : string,
    messagingSenderId : string
  };
  firebase_admin : string
}
>>>>>>> f1953bd3ba17f4998e56001ef018caf0cb975686
