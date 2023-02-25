import Navbar from '../components/navbar'
import Image from 'next/image'
import styles from '../styles/editProfile.module.css'
import { useState } from 'react'
import { useAuth } from "../Authentication/authContext";
import axios from 'axios'
import { useRouter } from 'next/router';

export default function EditProfile(){
    const router = useRouter()
    const [ file, setFile ] = useState<File>()
    const { user } = useAuth()
    const [ bio, setBio ] = useState<string>()
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ image, setImage ] = useState<string>()
    const [ avatar, setAvatar ] = useState<string>()
    const [username, setUsername] = useState<string>()
    const [invalid, setInvalid] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')

    if (username == undefined){
        axios.get(`api/authentication/${user.email}`).then(function (response){
            if (response.data == ''){
              router.push('/register-addition')
            }else{
              setUsername(response.data.username)
      
              axios.get(`api/avatar/${user.email}`).then(function (response){
                  setAvatar(response.data)
              })
            }
          }).catch(function (err){
            console.log(err)
          })
    }

    const imageLoader = ({src}: {src: any}) => {
        return src
    }

    const onFileChange = (fileChangeEvent: any) => {
        setFile(fileChangeEvent.target.files[0])

        if (fileChangeEvent.target.files[0] != undefined){
            if (fileChangeEvent.target.files[0].name.charAt(fileChangeEvent.target.files[0].name.length-4) == '.'){
                if (fileChangeEvent.target.files[0].name.substring(fileChangeEvent.target.files[0].name.length-3) == 'jpg' || fileChangeEvent.target.files[0].name.substring(fileChangeEvent.target.files[0].name.length-3) == 'png'){
                    setInvalid(false)
    
                    if (fileChangeEvent.target.files[0] != undefined){
                        setImage(URL.createObjectURL(fileChangeEvent.target.files[0]))
                    }else{
                        setImage(undefined)
                    }
                }else{
                    setImage(undefined)
                    setInvalid(true)
                    setMessage('File format must be jpg, jpeg, or png')
                }
            }else if (fileChangeEvent.target.files[0].name.charAt(fileChangeEvent.target.files[0].name.length-5) == '.'){
                if (fileChangeEvent.target.files[0].name.substring(fileChangeEvent.target.files[0].name.length-4) == 'jpeg'){
                    setInvalid(false)
    
                    if (fileChangeEvent.target.files[0] != undefined){
                        setImage(URL.createObjectURL(fileChangeEvent.target.files[0]))
                    }else{
                        setImage(undefined)
                    }
                }else{
                    setImage(undefined)
                    setInvalid(true)
                    setMessage('File format must be jpg, jpeg, or png')
                }
            }else{
                setImage(undefined)
                setInvalid(true)
                setMessage('File format must be jpg, jpeg, or png')
            }
        }else{
            setInvalid(false)
        }
    }

    const handleBio = (e: any) => {
        setBio(e.target.value)
    }

    const handleSubmit = async () => {
        if (file != undefined || bio != undefined){
            setInvalid(false)
            setLoading(true)
    
            if (file != undefined){
                if (file?.name.charAt(file?.name.length-4) == '.'){
                    if (file?.name.substring(file?.name.length-3) == 'jpg' || file?.name.substring(file?.name.length-3) == 'png'){
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
            
                            if (avatar != ''){
                                await axios.patch(`api/avatar/update-avatar/${user.email}`, {
                                    "public_id": publicId,
                                    "url": url
                                }).catch(function (response){
                                    console.log(response)
                                })
                            }else{
                                await axios.post(`api/avatar/post-avatar`, {
                                    "email": user.email,
                                    "public_id": publicId,
                                    "url": url
                                }).catch(function (response){
                                    console.log(response)
                                })
                            }
                            
                        }catch (err){
                            console.log(err)
                        }

                        if (bio != undefined){
                            await axios.patch(`api/authentication/update-user/${user.email}`, {
                                'bio': bio
                            }).then(function (response){
                                setBio(undefined)
                            }).catch(function (response){
                                console.log(response)
                            })
                        }
                
                        setLoading(false)
                        router.push('/profile-page')
                    }else{
                        setLoading(false)
                        setInvalid(true)
                        setMessage('File format must be jpg, jpeg, or png')
                    }
                }else if (file?.name.charAt(file?.name.length-5) == '.'){
                    if (file?.name.substring(file?.name.length-4) == 'jpeg'){
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
            
                            if (avatar != ''){
                                await axios.patch(`api/avatar/update-avatar/${user.email}`, {
                                    "public_id": publicId,
                                    "url": url
                                }).catch(function (response){
                                    console.log(response)
                                })
                            }else{
                                await axios.post(`api/avatar/post-avatar`, {
                                    "email": user.email,
                                    "public_id": publicId,
                                    "url": url
                                }).catch(function (response){
                                    console.log(response)
                                })
                            }
                            
                        }catch (err){
                            console.log(err)
                        }

                        if (bio != undefined){
                            await axios.patch(`api/authentication/update-user/${user.email}`, {
                                'bio': bio
                            }).then(function (response){
                                setBio(undefined)
                            }).catch(function (response){
                                console.log(response)
                            })
                        }
                
                        setLoading(false)
                        router.push('/profile-page')
                    }else{
                        setLoading(false)
                        setInvalid(true)
                        setMessage('File format must be jpg, jpeg, or png')
                    }
                }else{
                    setLoading(false)
                    setInvalid(true)
                    setMessage('File format must be jpg, jpeg, or png')
                }
            }
        }else{
            setInvalid(true)
            setMessage('Please fill the field')
        }
    }

    const handleDeleteAvatar = async () => {
        setInvalid(false)
        await axios.delete(`api/avatar/delete-avatar/${user.email}`).then(function (response){
            router.push('/profile-page')
        }).catch(function (err){
            console.log(err)
        })
    }

    return(
        <>
        {(username != undefined)?
        <div className={styles.pageFrame}>
        <Navbar />
        <div className={styles.componentFrame}>
        <section className="min-h-screen flex flex-col items-center justify-center sm:min-h-screen">
                    <div className="bg-gradient-to-r from-violet-900 to-indigo-500 rounded-2xl shadow-lg max-w-3xl p-5">
                        <h1 className="text-xl font-bold text-white text-center">Please fill the following data</h1>
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td className="text-slate-50">Bio (you can leave it blank)</td>
                                    </tr>
                                    <tr>
                                        <td><input onChange={handleBio} type="text" name="bio" placeholder="Bio" className="form-control text-sm rounded-lg p-2 w-full"></input></td>
                                    </tr>

                                    <tr>
                                        <td className="text-slate-50 mt-2">Avatar</td>
                                    </tr>
                                    <tr>
                                        <div className="items-center justify-center flex flex-col mb-1 mt-1">
                                            <Image loader={imageLoader} src={image || "https://res.cloudinary.com/decwxgqs5/image/upload/v1676731813/avatar/avatar-default_zlxnyt.png"} width={54.81} height={54.83} alt="avatar" className={styles.avatarFrame} />
                                        </div>
                                        <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" type="file" onChange={ev => onFileChange(ev)}></input>
                                    </tr>

                                    <tr>
                                        {(avatar =='' || avatar == undefined)?(
                                            (loading)?<button disabled={true} className='mt-5 mb-1 p-2 bg-red-100 rounded-lg w-full text-rose-600 font-bold'>
                                            Loading ...
                                        </button>:                             
                                        <div>
                                        <button onClick={handleSubmit} disabled={loading} className='mt-5 mb-1 p-2 bg-red-100 rounded-lg w-full text-[#3F0071] font-bold'>
                                            Update Profile
                                        </button>
                                        </div>
                                        ):<div>
                                        <button onClick={handleDeleteAvatar} className='mt-5 mb-1 p-2 bg-red-700 rounded-lg w-full text-gray-900 font-bold'>
                                        Delete Avatar
                                    </button>
                                    <button onClick={handleSubmit} disabled={loading} className='mt-2 mb-1 p-2 bg-red-100 rounded-lg w-full text-[#3F0071] font-bold'>
                                        Update Profile
                                    </button>
                                        </div>}
                                    </tr>

                                    <tr>
                                        {(invalid)?<p className='font-bold mt-2 text-red-500'>{message}</p>:<div></div>}
                                    </tr>
                                </tbody>
                            </table>
                    </div>
                </section>
        </div>
        </div>:<div></div>
        }
        </>
    )
}