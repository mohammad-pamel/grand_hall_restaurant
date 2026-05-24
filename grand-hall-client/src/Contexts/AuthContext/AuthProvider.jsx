import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../../Firebase/firebase.init';


const AuthProvider = ({ children }) => {

    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    const googleProvider = new GoogleAuthProvider();

    const registerUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const signInGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    }

    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    }

    const updateUserProfile = (profile) => {
        return updateProfile(auth.currentUser, profile);
    }


    //     onAuthStateChanged(auth, async (user) => {
    //   if (user) {
    //     const token = await user.getIdToken();
    //     setUser(user);
    //     setLoading(false);
    //   } else {
    //     setUser(null);
    //     setLoading(false);
    //   }
    // });

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            console.log('current user', user)
            if (user) {
                const loggedUser = {email: user.email}
                
                fetch('http://localhost:5000/jwt', {
                    method: 'POST',
                    headers: {
                        'content-type': "application/json"
                    },
                    body: JSON.stringify(loggedUser)
                })
                .then(res => res.json())
                .then(data => {
                    // console.log('after getting token', data.token);
                    // localStorage.setItem('token', data.token);
                    localStorage.setItem('access-token', data.token);
                })
                // const token = await user.getIdToken();
                // console.log('token fro', token);
            }
            else{
                // localStorage.removeItem('token');
                localStorage.removeItem('access-token');
            }
            setLoading(false);
        });
        return () => {
            unSubscribe();
        }
    }, [])
    // useEffect(() => {
    //     const unSubscribe = onAuthStateChanged(auth, async (user) => {
    //         if (user) {
    //             const token = await user.getIdToken();
    //             console.log('token fro', token);
    //             setUser(user);
    //             setLoading(false);
    //         } else {
    //             setUser(null);
    //             setLoading(false);
    //         }
    //     });
    //     return () => {
    //         unSubscribe();
    //     }
    // }, [])

    const authInfo = {
        registerUser,
        signInUser,
        signInGoogle,
        logOut,
        user,
        updateUserProfile,
        loading
    }

    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;