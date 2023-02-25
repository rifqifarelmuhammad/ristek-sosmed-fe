import Navbar from '../components/navbar'
import styles from '../styles/homepage.module.css'
import { useAuth } from '../Authentication/authContext'
import axios from 'axios'
import { useState } from 'react'
import Layout from '../components/layout'
import {AlertDialog, Checkbox, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogBody, Menu, MenuButton, MenuList, MenuItem, Button, Input, Modal, ModalOverlay, ModalContent, Textarea,  ModalHeader, ModalCloseButton, ModalBody, ModalFooter, InputGroup, Card, CardBody} from '@chakra-ui/react'
import React from 'react'
import { useRouter } from 'next/router'
import { Roboto } from '@next/font/google'

const fontStyle = Roboto({
  weight: '700',
  subsets: ['latin'],
})

export default function Home() {
  const cancelRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const router = useRouter()
  const {user} = useAuth();
  const [username, setUsername] = useState<string>()
  const [data, setData] = useState('')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [add, setAdd] = useState<string>('')
  const [textUsername, setTextUsername] = useState<string>()
  const [mayAdd, setMayAdd] = useState<string[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [error, setError] = useState<boolean>()
  const [message, setMessage] = useState<string>()
  const [openAlert, setOpenAlert] = useState<boolean>(false)

  if (username == undefined){
    axios.get(`api/authentication/${user.email}`).then(function (response){
      if (response.data == ''){
        router.push('/register-addition')
      }else{
        setUsername(response.data.username)

        axios.get(`api/friend/add-close-friend/${user.email}`).then(function (response){
          setMayAdd(response.data)
        }).catch(function (err){
          console.log(err)
        })
      }
    }).catch(function (err){
      console.log(err)
    })
  }

  const handleInput = (obj: any) => {
    setData(obj.target.value)
  }

  const handleInputUsername = (obj: any) => {
    setTextUsername(obj.target.value)
  }

  const handlePost = () => {
    if (data == ''){
      setOpenAlert(true)
    }else{
      axios.patch('api/tweet/post-tweet', {
        'email': user.email,
        'tweet': data,
        'cf': false
      }).then(function (response){
        setData('')
      }).catch(function (err) {console.log(err)})
    }
  }

  const handlePostCF = () => {
    if (data == ''){
      setOpenAlert(true)
    }else{
      axios.patch('api/tweet/post-tweet', {
        'email': user.email,
        'tweet': data,
        'cf': true
      }).then(function (response){
        setData('')
      }).catch(function (err) {console.log(err)})
    }
  }

  const openModalFriend = () => {
    setAdd('friend')
    setIsOpen(true)
  }

  const OpenModalCF = () => {
    setAdd('cf')
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setError(false)
    setTextUsername('')
  }

  const closeAlert = () => {
    setOpenAlert(false)
  }

  const handleAddFriend = () => {
    if (textUsername == ''  || textUsername == undefined){
      setError(true)
      setMessage('Please fill the username field')
    }else{
      setError(false)
      setMessage(undefined)
      axios.patch('api/friend/add-friend', {
        'email': user.email,
        'usernameFriend': textUsername
      }).then(function (response){
        if (response.data.status == 'failed'){
          setError(true)
          
          if (response.data.message == 'account doesnt exists'){
            setMessage("Account doesn't exists")
          }else if (response.data.message == 'friend already add'){
            setMessage("Friend is already add")
          }
        }else{
          const temp = mayAdd;
          temp.push(textUsername)
          setMayAdd(temp)
          setTextUsername('')
          setIsOpen(false)
        }
      }).catch(function (err) {console.log(err)})
    }
  }

  const handleAddCF = () =>{
    if (selectedUsers.length == 0){
      setError(true)
      setMessage('Please select one or more friend')
    }else{
      setError(false)
      axios.patch(`api/authentication/post-cf`, {
        'email': user.email,
        'cf': selectedUsers
      }).then(function  (response){
        setSelectedUsers([])
        setIsOpen(false)
      }).catch(function (err){
        console.log(err)
      })
    }
  }

  return (
    <>
    {(username != undefined)?
    <div className={fontStyle.className}>
      <div className={styles.layout}>
        <Navbar />

        <div className="flex flex-col items-center justify-center ">
          <div className={styles.mainFrame}>
            <p className={styles.textWelcome}>Welcome back,</p>
            <p className={styles.textUsername}>@{username}</p>

            <div className={styles.framePost}>
              
              <Textarea required resize='none' rows={4} name="tweet" placeholder="What's happening?" onChange={(obj) => handleInput(obj)} value={data} className={styles.formTweet} />

              <div className={styles.frameButton}>
                <Menu>
                    <MenuButton className={styles.button}>
                      Add
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={openModalFriend}>Friend</MenuItem>
                      <MenuItem onClick={OpenModalCF}>Close Friend</MenuItem>
                    </MenuList>
                  </Menu>     

                <Menu>
                  <MenuButton className={styles.button}>
                    Post
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={handlePost}>Public</MenuItem>
                    <MenuItem onClick={handlePostCF}>Close Friend</MenuItem>
                  </MenuList>
                </Menu>  
              </div>
            </div>

            <div className="flex flex-col items-center justify-center mt-5">
              <Layout />
            </div>
          </div>
        </div> 
    </div>

    <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
        {(add == 'cf')?
          <ModalHeader>Add Close Friend</ModalHeader>: <ModalHeader>Add Friend</ModalHeader>}
          <ModalCloseButton />
          <ModalBody>
            {(add == 'cf')?
            <div className='flex flex-col items-center justify-center'>
              <div className='mt-2'>
                {mayAdd?.map((t, idx: number) => (
                  <Card className='mt-2'>
                    <CardBody className={styles.cardCF}>
                    <Checkbox
                      name='checkbox'
                      onChange={(e) => !selectedUsers.includes(mayAdd[idx]) ? setSelectedUsers([...selectedUsers,mayAdd[idx]]):setSelectedUsers(selectedUsers.filter(function(name){
                        return name != mayAdd[idx];
                    }))}
                    >
                      {mayAdd[idx]}
                    </Checkbox>
                    </CardBody>
                  </Card>
                ))}

              </div>
              {(error)?<p className='font-bold mt-2 text-yellow-500'>{message}</p>:<div></div>}
                </div>
            :<div>
              <div>
              <InputGroup size='md'>
                <Input
                    pr='4.5rem'
                    placeholder='Username'
                    textColor='black'
                    value={textUsername}
                    onChange={(obj) => handleInputUsername(obj)}
                />
                </InputGroup>
                </div>
                {(error)?<p className='font-bold mt-2 text-red-500'>{message}</p>:<div></div>}
                </div>}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={closeModal}>
              Close
            </Button>
            {(add == 'cf')?<Button colorScheme='blue' onClick={handleAddCF} className={styles.buttonAdd}>Save</Button>
            :<Button onClick={handleAddFriend} colorScheme='blue' className={styles.buttonAdd}>Add Friend</Button>}
          </ModalFooter>
        </ModalContent>
      </Modal></div>:<div></div>
    }

    <AlertDialog
        isOpen={openAlert}
        onClose={closeAlert}
        leastDestructiveRef={cancelRef}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              ERROR
            </AlertDialogHeader>

            <AlertDialogBody>
            Please fill the new tweet!
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={closeAlert} className = 'text-red-500 font-bold'>
                OK
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
