import Image from 'next/image'
import styles from '../styles/navbar.module.css'
import { useAuth } from '../Authentication/authContext'
import axios from 'axios'
import { useState } from 'react'
import {Menu, MenuButton, MenuList, MenuItem} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { Inter, Bebas_Neue } from '@next/font/google'

const fontStyle2 = Bebas_Neue({
    weight: '400',
    subsets: ['latin'],
})

const fontStyle3 = Inter({
    weight: '500',
    subsets: ['latin'],
})

export default function Navbar(){
    const router = useRouter();
    const {user, logout} = useAuth();
    const [username, setUsername] = useState<string>()
    const [avatar, setAvatar] = useState<string>()

    if (username == undefined){
        axios.get(`api/authentication/${user.email}`).then(function (response){
            setUsername(response.data.username)
        }).catch(function (err){
            console.log(err)
        })
    
        axios.get(`api/avatar/${user.email}`).then(function (response){
            setAvatar(response.data.urlAvatar)
        }).catch(function (err){
            console.log(err)
        })
    }

    const imageLoader = ({src}: {src: any}) => {
        return src
    }

    const handleLogout = async () => {
        try {
            await logout()
        } catch (err) {
            console.log(err);
        }

        router.push('/login')
    }

    const handleMainPage = () => {
        router.push('/')
    }
    
    const handleEditProfile = () => {
        router.push('/edit-profile')
    }

    const handleProfilePage = () => {
        router.push('/profile-page')
    }

    return(
        <>
        <div className={styles.pageFrame}>
            <nav className="bg-#01162D px-2 sm:px-4 py-2.5 bg-#01162D w-full z-20 top-0 left-0">
                <div className="container flex flex-wrap items-center justify-between mx-auto">
                    <div className="flex gap-2 align-middle">
                        <Image src="/ristek-logo.png" alt="Ristek" width={30.94} height={50} className={styles.logoRistek} />
                        <text className={styles.textRistek}>RISTEK MedSOS</text>
                    </div>
                    <div className="flex md:order-2">
                        <div className={styles.avatarFrame}>
                            <Image loader={imageLoader} src={avatar || "https://res.cloudinary.com/decwxgqs5/image/upload/v1675212347/my-uploads/ajgxzxl6mx8osx5zuioe.png"} width={54.81} height={54.83} alt="Avatar" className={styles.avatar} />
                            <Menu>
                                <div className={fontStyle2.className}>
                                <MenuButton className={styles.dropdown}>
                                    {username}
                                </MenuButton>
                                </div>
                                <MenuList className={fontStyle3.className}>
                                    <MenuItem onClick={handleMainPage}>Home Page</MenuItem>
                                    <MenuItem onClick={handleProfilePage}>Profile Page</MenuItem>
                                    <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
                                    <MenuItem onClick={handleLogout} className='font-bold'><p className='text-rose-600'>Logout</p></MenuItem>
                                </MenuList>
                            </Menu> 
                        </div>
                    </div>
                </div>
            </nav>
        </div>
        </>
    )
}