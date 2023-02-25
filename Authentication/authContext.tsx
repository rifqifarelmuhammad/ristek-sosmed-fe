import React, { createContext, useContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../Authentication/config/Firebase';
import axios from 'axios'

const AuthContext = createContext<any>({})

export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider = ({children}: {children:React.ReactNode}) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) =>{
            if (user){
                setUser({
                    uid: user.uid,
                    email: user.email
                })
                // axios.get(`api/authentication/${user.email}`).then(function (response){
                //     if (response.data == ''){
                //         setUser({
                //             uid: user.uid,
                //             email: user.email,
                //             isRegister: false
                //         })
                //     }else{
                //         setUser({
                //             uid: user.uid,
                //             email: user.email,
                //             isRegister: true
                //         })
                //     }
                //   }).catch(function (err){
                //     console.log(err)
                //   })
            }else{
                setUser(null)
            }

            setLoading(false);
        });

        return () => unsubscribe()
    }, [])

    const signup = (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const login = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logout = async () => {
        setUser(null);
        await signOut(auth);
    }

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {loading? null : children}
        </AuthContext.Provider>
    )
}