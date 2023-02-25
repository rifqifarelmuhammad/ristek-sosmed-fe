import { Card, CardHeader, CardBody, CardFooter, Button, Text, Flex, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import Image from 'next/image'
import axios from 'axios'
import styles from '../styles/card.module.css'
import { useState } from 'react';
import { Plus_Jakarta_Sans } from '@next/font/google'

const fontStyle = Plus_Jakarta_Sans({
    weight: '400',
    subsets: ['latin'],
})

export default function CardTweet({avatar, username, date, tweet, id, own, cf}: {avatar: string, username: string, date: Date, tweet: string, id: number, own: boolean, cf: boolean}){
    const tempDate = new Date(date)
    const getDate = (tempDate.getDate() < 10)? ('0' + tempDate.getDate()): tempDate.getDate()
    const getMonth = ((tempDate.getMonth() + 1) < 10)? ('0' + (tempDate.getMonth() + 1)): (tempDate.getMonth() + 1)
    const [edit, setEdit] = useState<boolean>()
    const [data, setData] = useState('')

    const formatDate = getDate + "-" + getMonth + "-" + tempDate.getFullYear()

    const imageLoader = ({src}: {src: any}) => {
        return src
    }

    const handleDelete = (tweetId: number) => {
        axios.delete(`api/tweet/delete-tweet/${tweetId}`).catch(function (error) {console.log(error)})
    }

    const handleUpdate = () => {
        setEdit(!edit)
    }

    const submitUpdate = () => {
        if (data == ''){
            alert('Please fill the new tweet')
        }else{
            axios.patch(`api/tweet/update-tweet/${id}`, {
                'tweets': data
            }).then(function (response){
                setEdit(!edit)
                setData('')
            }).catch(function (err) {console.log(err)})
        }
    }

    const handleInput = (obj: any) => {
        setData(obj.target.value)
    }

    return(
        <div className={fontStyle.className}>
        <Card className={styles.card}>
            <CardHeader className={styles.cardHeader}>
                <Flex flex='1' gap='3' alignItems='center' flexWrap='wrap'>
                    <Image loader={imageLoader} src={avatar || "https://res.cloudinary.com/decwxgqs5/image/upload/v1675212347/my-uploads/ajgxzxl6mx8osx5zuioe.png"} width={42.66} height={42.67} alt="Avatar" className={styles.avatar} />
                    <p className={styles.textUsername}>{username}</p>
                    <p className={styles.textDate}>{formatDate}</p>

                    {(cf)?
                    <p className={styles.textCF}>Close Friend</p>
                    :
                    <div></div>
                    }

                    {(own)?
                    <div>
                    <button onClick={() => handleDelete(id)}>
                    <Image src='/Icon-delete.png' width={19.18} height={18} alt='Delete' className={styles.deleteIcon} />
                    </button>
                    <button  onClick={handleUpdate}>
                    <Image src='/Icon-edit.png' width={26} height={23} alt='Delete' className={styles.editIcon} />
                    </button>
                    </div>:
                    <div></div>
                    }

                </Flex>
            </CardHeader>

            <CardBody>
                <p className={styles.textTweet}>{tweet}</p>
            </CardBody>

            {(edit)?
            <CardFooter>
                <InputGroup size='md'>
                <Input
                    pr='4.5rem'
                    placeholder='New Tweet'
                    textColor='white'
                    value={data}
                    onChange={(obj) => handleInput(obj)}
                />
                <InputRightElement width='4.5rem' className='mr-2'>
                    <Button h='1.75rem' size='sm' onClick={submitUpdate}>
                    Submit
                    </Button>
                </InputRightElement>
                </InputGroup>
            </CardFooter>:
            <div></div>
            }            
        </Card>
        </div>
    )
}