import { useAuth } from '../Authentication/authContext'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { TweetProfile } from '../models/tweetProfile'
import Card from './card'

export default function LayoutProfile({avatar, username}: {avatar:string, username:string}){
    const {user} = useAuth();
    const [tweet, setTweet] = useState<TweetProfile[]>()

    useEffect(() => {
        axios.get(`api/tweet/get-profile/${user.email}`).then((response) => {
          setTweet(response.data)
        })
    }, [tweet]);

    return(
        <div className="flex-col" id="todo">
            {tweet?.map((t, idx: number) => (
                <Card avatar={avatar} username={username} date={t.createdAt} tweet={t.tweets} id={t.id} own={true} cf={t.closeFriend} key={idx}/>
            ))}
        </div>
    )
}