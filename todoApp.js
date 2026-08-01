'use strict'

let firebaseApp, db, auth, provider;
window.addEventListener('load', function() {
    firebaseApp = firebase.initializeApp({
        apiKey: "AIzaSyBch99TZxncUE-BQae0787kspmjDHpM92U",
        authDomain: "todolist-by-gauss.firebaseapp.com",
        databaseURL: "https://todolist-by-gauss-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "todolist-by-gauss",
        storageBucket: "todolist-by-gauss.firebasestorage.app",
        messagingSenderId: "861757370732",
        appId: "1:861757370732:web:f3cbb5de6f87b82b794349",
        measurementId: "G-VHXFETHW7W"
    });
    db = firebaseApp.firestore();
    auth = firebaseApp.auth();
    provider = new firebase.auth.GoogleAuthProvider();
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/v8/firebase.User
            let uid = user.uid;
            console.log('User is signed in with id of : ', uid);
        } else {
            console.log('User is signed out');
            let currentPage = location.href;
            console.log(currentPage);
            // Redirect to Login Page...
            if (!currentPage.includes('todoLogin.html')) {
                location.href = './todoLogin.html';
            }
        }
    });
});

export {db, auth, provider};