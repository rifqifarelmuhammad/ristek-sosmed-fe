import { useAuth } from '../Authentication/authContext'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import axios from 'axios'
import { Roboto } from '@next/font/google'

const fontStyle = Roboto({
    weight: '400',
    subsets: ['latin'],
})

export default function Login() {
    const router = useRouter()
    const {user, login} = useAuth()
    const [data, setData] = useState({
        email:'',
        password:''
    })
    const [isError, setIsError] = useState<boolean>(false)
    const [message, setMessage] = useState<string>()
    
    const handleLogin = async (e:any) => {
        e.preventDefault()
        try{
            await login(data.email, data.password)

            axios.get(`api/authentication/${data.email}`).then(function (response){
                if (response.data == ''){
                    router.push('/register-addition')
                }else{
                    router.push('/')
                }
              }).catch(function (err){
                console.log(err)
            })
            
            setIsError(false)
            setMessage(undefined)
        } catch (err) {
            setIsError(true)
            if (err.code == 'auth/invalid-email'){
                setMessage('Invalid email')
            }else if (err.code == 'auth/user-not-found'){
                setMessage('User not found')
            }else if (err.code == 'auth/wrong-password'){
                setMessage('Wrong password')
            }
            else{
                console.log(err.code)
            }
            
            setData({
                ...data,
                password:''
            })
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
                    <h1 className="text-xl font-bold text-white text-center">Login</h1>
                    <form method="POST" action="" className="mt-4" onSubmit={handleLogin}>
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
                                    <td><input className="mt-4 p-2 bg-red-100 rounded-lg w-full text-[#3F0071] font-bold" type="submit" value="Login"></input></td>
                                </tr>
                            </tbody>
                        </table>
                    </form>

                    {(isError)?<p className='font-bold mt-2 text-red-500'>{message}</p>:<div></div>}

                    <p className="mt-1 text-slate-50">
                        Don&apos;t have an account yet? <Link href={ '/signup' } className="underline font-bold">Sign up</Link>
                    </p>
                </div>
            </section>
        </div>
    )
}