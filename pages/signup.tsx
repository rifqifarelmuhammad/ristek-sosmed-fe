import { useAuth } from '../Authentication/authContext'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Roboto } from '@next/font/google'

const fontStyle = Roboto({
    weight: '400',
    subsets: ['latin'],
})

export default function Signup() {
    const { user, signup } = useAuth()
    const [data, setData] = useState({
        email:'',
        password:''
    })
    const router = useRouter()
    const [isError, setIsError] = useState<boolean>(false)
    const [message, setMessage] = useState<string>()

    const handleSignup = async (e:any) => {
        e.preventDefault()

        try{
            await signup(data.email, data.password)
            router.push('/login')
        } catch (err) {
            setIsError(true)
            setData({
                ...data,
                password:''
            })
            
            if (String(err) == 'FirebaseError: Firebase: Error (auth/invalid-email).'){
                setMessage('Invalid Email')
            }else if (String(err) == 'FirebaseError: Firebase: Error (auth/email-already-in-use).'){
                setMessage('Email already in use')
            }else if (String(err) == 'FirebaseError: Firebase: Password should be at least 6 characters (auth/weak-password).'){
                console.log('masuk kok')
                setMessage('Password should be at least 6 characters')
            }
        }
    }

    const handlePassword = (e:any) => {
        setData({
            ...data,
            password: e.target.value,
        })
    }
    const handleEmail = (e:any) => {
        setData({
            ...data,
            email: e.target.value,
        })
    }

    return (
        <div className={fontStyle.className}>
            <section className="min-h-screen flex flex-col items-center justify-center sm:min-h-screen">
                <div className="login bg-gradient-to-r from-indigo-900 to-purple-800 rounded-2xl shadow-lg max-w-3xl p-5">
                    <h1 className="text-xl font-bold text-white text-center">Sign Up</h1>
                    <form method="POST" action="" className="mt-4" onSubmit={handleSignup}>
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="text-slate-50">Email</td>
                                </tr>
                                <tr>
                                    <td><input onChange={handleEmail} value={data.email} required type="text" name="email" placeholder="Email" className="form-control text-sm rounded-lg p-2 w-full"></input></td>
                                </tr>

                                <tr>
                                    <td className="text-slate-50 mt-2">Password</td>
                                </tr>
                                <tr>
                                    <td><input onChange={handlePassword} value={data.password} type="password" name="password" placeholder="Password" required className="form-control text-sm rounded-lg p-2 w-full"></input></td>
                                </tr>

                                <tr>
                                    <td><input className="mt-4 p-2 bg-red-100 rounded-lg w-full text-[#3F0071] font-bold" type="submit" value="Create Account"></input></td>
                                </tr>
                            </tbody>
                        </table>
                    </form>

                    {(isError)?<p className='font-bold mt-2 text-red-500'>{message}</p>:<div></div>}

                    <div className="mt-2">
                        <span className="text-white">
                            Already have an account? <Link href={ '/login' } className="underline font-bold">Log in</Link>
                        </span>
                    </div>
                </div>
            </section>
        </div>
    )
}