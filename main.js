const firebase = require ('firebase');
const firebaseConfig = {
    apiKey: "AIzaSyBDbwqwWIf40EI68ihn6RWFPGElsmp2gZU",
    authDomain: "add-items-4e215.firebaseapp.com",
    projectId: "add-items-4e215",
    storageBucket: "add-items-4e215.appspot.com",
    messagingSenderId: "166181094889",
    appId: "1:166181094889:web:0823fa30110f887d6fb778",
    measurementId: "G-GWFQPM9F7N"
  };

//   const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

firebase.initializeApp(firebaseConfig);

// Create a Firestore instance
const db = firebase.firestore();

export default db;

// const Item = db.collection("Items");
// module.exports = Item;
  