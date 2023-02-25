import { useAuth } from '../Authentication/authContext'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Tweet } from '../models/tweet'
import Card from './card'

export default function Layout(){
    const {user} = useAuth();
    const [tweet, setTweet] = useState<Tweet[]>()

    useEffect(() => {
        axios.get(`api/tweet/${user.email}`).then((response) => {
          setTweet(response.data)
        })
    }, [tweet]);

    return(
        <div className="flex-col" id="todo">
            {tweet?.map((t, idx: number) => (
                <Card avatar={t.avatarUrl} username={t.username} date={t.createAt} tweet={t.tweets} id={t.id} own={t.email == user.email} cf={t.closeFriend} key={idx}/>
            ))}
        </div>
    )
}