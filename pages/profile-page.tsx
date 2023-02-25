import Navbar from '../components/navbar'
import styles from '../styles/profilePage.module.css'
import Image from 'next/image'
import { useAuth } from '../Authentication/authContext'
import axios from 'axios'
import { useState } from 'react'
import LayoutProfile from '../components/layoutProfile'
import { useRouter } from 'next/router'
import { Bebas_Neue } from '@next/font/google'

const fontStyle = Bebas_Neue({
    weight: '400',
    subsets: ['latin'],
})

export default function profilePage(){
    const router = useRouter()
    const {user} = useAuth();
    const [avatar, setAvatar] = useState<string>()
    const [bio, setBio] = useState<string>()
    const [username, setUsername] = useState<string>()

    if (username == undefined){
        axios.get(`api/authentication/${user.email}`).then(function (response){
          if (response.data == ''){
            router.push('/register-addition')
          }else{
            setUsername(response.data.username)
            setBio(response.data.bio)
    
            axios.get(`api/avatar/${user.email}`).then(function (response){
                setAvatar(response.data.urlAvatar)
            }).catch(function (err){
                console.log(err)
            })
          }
        }).catch(function (err){
          console.log(err)
        })
      }

    const imageLoader = ({src}: {src: any}) => {
        return src
    }

    return(
        <>
        {(username != undefined)?
        <div>
            <div className={styles.pageFrame}>
                <Navbar />
                <div className="flex flex-col items-center justify-center ">
                    <div className={styles.profileFrame}>
                        <Image loader={imageLoader} src={avatar || "https://res.cloudinary.com/decwxgqs5/image/upload/v1675212347/my-uploads/ajgxzxl6mx8osx5zuioe.png"} width={750} height={75} alt="Avatar" className={styles.avatarFrame} />
                        <div className={fontStyle.className}>
                            <h1 className={styles.usernameText}>@{username}</h1>
                        </div>
                    </div>

                    <p className={styles.descriptionText} >{bio}</p>

                    <div>
                        <LayoutProfile username={username  || ''} avatar={avatar ||"https://res.cloudinary.com/decwxgqs5/image/upload/v1675212347/my-uploads/ajgxzxl6mx8osx5zuioe.png"} />
                    </div>
                </div>
            </div>
        </div>
        :<div></div>
        }
        </>
    )
}