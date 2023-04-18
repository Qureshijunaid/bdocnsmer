import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import { setFirebaseUID } from '../../actions/registration';

import constants from '../../constants'

export const registerFirebaseAuth = (email, password) => {

    auth()
        .createUserWithEmailAndPassword(email, password)
        .then((result) => {
            setFirebaseUID(result.user.uid)

        })
        .catch(error => {

        });
}

export const signInFirebase = (email, password) => {
    console.log("sign in firebase");
    auth()
        .createUserWithEmailAndPassword(email, password)
        .then((result) => {
            setFirebaseUID(result.user.uid)

        })
        .catch(error => {
            if (error.code === "auth/email-already-in-use") {
                auth().signInWithEmailAndPassword(email, password)
                    .then((result) => {
                    })
                    .catch(error => {
                    });
            }



        });
}

export const checkEmailAlreadyExist = (email) => {
    auth().
        fetchSignInMethodsForEmail(email).then((methods) => {
        }).catch((error) => {
        })
}

export const logoutFirebase = () => {
    auth()
        .signOut()
        .then(() => {
        })
        .catch(error => {

        });
}

export const firebaseCheckStatus = (chatFunction) => {
    auth()
        .onAuthStateChanged((user) => {
            if (user) {
                chatFunction()
            } else {
                Toast.show({
                    text1: constants.AppConstant.Bando,
                    text2: 'Internal Server Error. Please Contact support',
                    type: "error",
                    position: "top"
                });
            }

        })


}

