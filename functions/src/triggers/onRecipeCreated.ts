import { functions, admin } from '../config';

exports.default = functions.firestore
  .document( 'recipes/{recipeId}' )
  .onCreate( async( snapshot, context ) => {
    // Get an object representing the document
    const recipe = snapshot.data();
    console.log( 'recipe', context.params.recipeId, recipe );

    const devicesSnapshot = await admin.firestore().collection( `devices` )
      .orderBy( 'uid' )//.equalTo( uid )
      .get();

    const tokens: any[] = [];
    devicesSnapshot.forEach( ( device ) => {
      console.log( 'device.val().token', device.data() );
      tokens.push( device.data().token );
    } );

    // Notification content
    const payload = {
      'data': {
        'title': recipe.name,
        'message': recipe.description,
        // "count": 1,
        'sound': 'default',
        // 'image': 'https://reciveci-app.firebaseapp.com/icon.png'
      },
      'notification': {
        'title': recipe.name,
        'body': recipe.description,
        'sound': 'default',
        //'click_action': 'FCM_PLUGIN_ACTIVITY',
        // 'icon': 'https://reciveci-app.firebaseapp.com/icon.png'
      }
    };

    return admin.messaging().sendToDevice( tokens, payload )
      .then( result => console.log( 'Result notification', JSON.stringify( result ), payload ) )
      .catch( error => console.log( 'error Notification', error ) );

  } );
