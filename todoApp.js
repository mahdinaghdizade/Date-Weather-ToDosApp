'use strict'

let firebaseApp, db, auth, provider;
window.addEventListener('load', function() {
    firebaseApp = firebase.initializeApp({
        apiKey: "DELETED-SECURITY",
        authDomain: "DELETED-SECURITY",
        databaseURL: "DELETED-SECURITY",
        projectId: "DELETED-SECURITY",
        storageBucket: "DELETED-SECURITY",
        messagingSenderId: "DELETED-SECURITY",
        appId: "DELETED-SECURITY",
        measurementId: "DELETED-SECURITY"
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