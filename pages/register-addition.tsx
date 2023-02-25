import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from "../Authentication/authContext";
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import styles from '../styles/registerAddition.module.css'
import { Roboto, Inter } from '@next/font/google'

const fontStyle = Roboto({
    weight: '400',
    subsets: ['latin'],
})

export default function Home() {
    const router = useRouter()
    const { user, logout } = useAuth()
    const [ image, setImage ] = useState<string>()
    const [ file, setFile ] = useState<File>()
    const [ username, setUsername ] = useState<string>()
    const [ bio, setBio ] = useState<string>()
    const [ loading, setLoading ] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)
    const [message, setMessage] = useState<string>()

    const handleLogout = async () => {
        try {
            await logout()
        } catch (err) {
            console.log(err);
        }
    }

    const handleUsername = (e: any) => {
        setUsername(e.target.value)
    }

    const handleBio = (e: any) => {
        setBio(e.target.value)
    }

    const onFileChange = (fileChangeEvent: any) => {
        setFile(fileChangeEvent.target.files[0])
        if (fileChangeEvent.target.files[0] != undefined){
            setImage(URL.createObjectURL(fileChangeEvent.target.files[0]))
        }else{
            setImage(undefined)
        }
    }
    
    const handleSubmit = async (e: any) => {
        if (username == undefined || username == ''){
            setIsError(true)
            setMessage('Please fill the username field')
        }else{
            setLoading(true)
            if (file != undefined){
                let formData = new FormData()
                formData.append('file', file)
                formData.append('upload_preset', 'my-uploads');
                try{
                    let publicId = ""
                    let url = ""
                    await axios.post("https://api.cloudinary.com/v1_1/decwxgqs5/image/upload", formData).then(function (response){
                        publicId = response.data['public_id']
                        url = response.data['secure_url']
                    }).catch(function (err){
                        console.log(err)
                    })
                    
                    await axios.post(`api/avatar/post-avatar`, {
                        "email": user.email,
                        "public_id": publicId,
                        "url": url
                    }).catch(function (response){
                        console.log(response)
                    })
                }catch (err){
                    console.log(err)
                }
            }
            
            if (bio == undefined){
                axios.post(`api/authentication/post-user`, {
                    'email': user.email,
                    'username': username,
                }).then(function (response){
                    if (response.data.status == 'error'){
                        setIsError(true)
                        setMessage('Username already in use')
                    }else{
                        router.push('/')
                    }
                }).catch(function (err){
                    console.log(err)
                })
            }else{
                axios.post(`api/authentication/post-user`, {
                    'email': user.email,
                    'username': username,
                    'bio': bio
                }).then(function (response){
                    router.push('/')
                }).catch(function (err){
                    console.log(err)
                })
            }
            setLoading(false)
            setIsError(false)
            setMessage(undefined)
        }
    }
    
    const imageLoader = ({src}: {src: any}) => {
        return src
    }
    
    return (
        <>
        <div className={styles.frame}>
            <div className={fontStyle.className}>
                <section className="min-h-screen flex flex-col items-center justify-center sm:min-h-screen">
                    <div className="bg-gradient-to-r from-indigo-900 to-purple-800 rounded-2xl shadow-lg max-w-3xl p-5">
                        <h1 className="text-xl font-bold text-white text-center">Please fill the following data</h1>
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td className="text-slate-50">Username</td>
                                    </tr>
                                    <tr>
                                        <td><input onChange={handleUsername} required type="text" name="username" placeholder="Username" className="form-control text-sm rounded-lg p-2 w-full"></input></td>
                                    </tr>

                                    <tr>
                                        <td className="text-slate-50 mt-3">Bio (you can leave it blank)</td>
                                    </tr>
                                    <tr>
                                        <td><input onChange={handleBio} type="text" name="bio" placeholder="Bio" className="form-control text-sm rounded-lg p-2 w-full"></input></td>
                                    </tr>

                                    <tr>
                                        <td className="text-slate-50 mt-2">Avatar (you can leave it blank)</td>
                                    </tr>
                                    <tr>
                                        <div className="items-center justify-center flex flex-col mb-1 mt-1">
                                            <Image loader={imageLoader} src={image || "https://res.cloudinary.com/decwxgqs5/image/upload/v1676731813/avatar/avatar-default_zlxnyt.png"} width={54.81} height={54.83} alt="avatar" className={styles.avatar} />
                                        </div>
                                        <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" type="file" onChange={ev => onFileChange(ev)}></input>
                                    </tr>

                                    <tr>
                                        {(loading)?<button disabled={true} className='mt-5 mb-1 p-2 bg-red-100 rounded-lg w-full text-rose-600 font-bold'>
                                            Loading ...
                                        </button>:                             
                                        <button onClick={handleSubmit} disabled={loading} className='mt-5 mb-1 p-2 bg-red-100 rounded-lg w-full text-[#3F0071] font-bold'>
                                            Register
                                        </button>
                                        }
                                    </tr>

                                    {(isError)?<p className='font-bold mt-2 text-red-500'>{message}</p>:<div></div>}
                                </tbody>
                            </table>
                        <button className='mt-1 text-slate-50 underline font-bold' onClick={handleLogout}><Link href={"/login"}>Back to the login page</Link></button>
                    </div>
                </section>
            </div>
            </div>
        </>
    )
}
