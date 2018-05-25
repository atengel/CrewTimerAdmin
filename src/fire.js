/**
 * Created by glenne on 7/20/2017.
 */
import firebase from 'firebase';
var config = {
  /* COPY THE ACTUAL CONFIG FROM FIREBASE CONSOLE */
  apiKey: "AIzaSyBxl61gy473Yq7KDT_838HYPnRsfZz_Y5M",
  authDomain: "crewtimer-results.firebaseapp.com",
  databaseURL: "https://crewtimer-results.firebaseio.com",
  projectId: "crewtimer-results",
  storageBucket: "crewtimer-results.appspot.com",
  messagingSenderId: "990343924949"
};
var fire = firebase.initializeApp(config);
export default fire;
