import { useAuth } from '../Authentication/authContext'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import axios from 'axios'

export default function ProtectedRoute({children} : {children : React.ReactNode}) {
    const router = useRouter()
    const {user} = useAuth()

    useEffect(() => {
      if (!user){
        router.push('/login')
      }
      else{
        axios.get(`api/authentication/${user.email}`).then(function (response){
          if (response.data == ''){
            router.push('/register-addition')
          }
        }).catch(function (err){
          console.log(err)
        })
      }
    }, [router, user])
    
  return (
    <>{user ? children : null}</>
  )
}