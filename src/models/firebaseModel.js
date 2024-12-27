import { firebaseConfig } from "/src/firebaseConfig.js";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import { getPlayerStats } from "../footySource";
import { getAuth, onAuthStateChanged, signOut,  GoogleAuthProvider, signInWithPopup, signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "firebase/auth";


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

const PATH = "footyModel";

function modelToPersistence(model) {
    return {
        currentSeason: model.searchParam.season,
        currentPlayerId: model.currentPlayerId,
        favorites: model.favorites.map((player) => ({
            id: player.id,
            name: player.name,
            photo: player.photo,
        })),

        playerA: model.playerA,
        playerB: model.playerB,
    };
}

async function persistenceToModel(dataFromPersistence, model) {
    console.log("Data from Firebase:", dataFromPersistence);

    dataFromPersistence = dataFromPersistence || {};

    model.currentPlayerId = dataFromPersistence.currentPlayerId || null;

    model.searchParam.season = dataFromPersistence.currentSeason || null;

    model.favorites = (dataFromPersistence.favorites || []).map((favorite) => ({
        id: favorite.id,
        name: favorite.name,
        photo: favorite.photo,
    }));

    model.playerA = dataFromPersistence.playerA || null;
    model.playerB = dataFromPersistence.playerB || null;
}

function saveToFirebase(model) {

    if(!model.user){
        console.log("No user logged in savetofirebase");
        return;
    }

    const userPath = PATH + "/" + model.user.uid;

    console.log("Data being saved to Firebase:", modelToPersistence(model));

    if (model.ready) {
        set(ref(database, userPath), modelToPersistence(model))
            .then(() => console.log("Data saved to Firebase successfully."))
            .catch((error) => console.error("Error saving data to Firebase:", error));
    }
}

function readFromFirebase(model) {
    if(!model.user){
        console.log("No user logged in");
        return Promise.resolve();
    }
    model.ready = false;
    const userPath = PATH + "/" + model.user.uid;

    console.log("Firebase is reading", userPath);
    
    return get(ref(database, userPath))
        .then((snapshot) => {
            const data = snapshot.val();
            console.log("Firebase data read:", data);
            return persistenceToModel(data, model);
        })
        .then(function setModelReadyACB(){
            model.ready = true;
        })
        .catch((error) => {
            console.error("Error reading data from Firebase:", error);
            model.ready = true;
        });
}

function connectToFirebase(model, watchFunction) {

    function authStateChangeHandler(user){
        if(user){
            model.setUser(user);
            readFromFirebase(model);
        } else{
            model.clearUserData();
            readFromFirebase(model).then(() => {
                model.ready = true;
            });
        }

    }

    onAuthStateChanged(auth, authStateChangeHandler);

    readFromFirebase(model).then(function () {
        function watchRelevantProperties() {
            return {
                currentSeason: model.searchParam.season,
                currentPlayerId: model.currentPlayerId,
                favorites: model.favorites.map((player) => ({
                    id: player.id,
                    name: player.name,
                    photo: player.photo,
                })),
                playerA: model.playerA,
                playerB: model.playerB,

            };
        }

        function saveChangesToFirebase() {
            saveToFirebase(model);
        }

        watchFunction(watchRelevantProperties, saveChangesToFirebase);
    });
}

function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            console.log("User signed in:", result.user);
        })
        .catch((error) => {
            console.error("Error during sign-in:", error);
        });
}
function handleSignOut() {
    signOut(auth)
        .then(() => console.log("User signed out successfully."))
        .catch((error) => console.error("Error signing out:", error));
}

function anonymousSignIn() {
    signInAnonymously(auth)
        .then(() => {
            console.log("Logged in anonymously");
        })
        .catch((error) => {
            console.error("Error with anonymous login:", error);
            model.ready= true;
        });
}

function registerWithEmailAndPassword(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
            console.log("User registered:", result.user);
        })
        .catch((error) => {
            console.error("Error during registration:", error);
        });
}

function loginWithEmailAndPassword(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
            console.log("User logged in:", result.user);
        })
        .catch((error) => {
            console.error("Error during email login:", error);
        });
}


export { connectToFirebase, saveToFirebase, readFromFirebase, signInWithGoogle, handleSignOut, anonymousSignIn, registerWithEmailAndPassword, loginWithEmailAndPassword };