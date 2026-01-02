// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA5OrrXgIJvIvS215Xv6PQH-99ETxaL2NY",
    authDomain: "scoree-9711b.firebaseapp.com",
    databaseURL: "https://scoree-9711b-default-rtdb.firebaseio.com",
    projectId: "scoree-9711b",
    storageBucket: "scoree-9711b.appspot.com",
    messagingSenderId: "1088741999468",
    appId: "1:1088741999468:web:03665833233132821045e0"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();
