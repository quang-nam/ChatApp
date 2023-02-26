import Loading from '@/components/Loading';
import { auth, db } from '@/config/firebase';
import '@/styles/globals.css'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import type { AppProps } from 'next/app'
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Login from './login';
export default function App({ Component, pageProps }: AppProps) {
  // chan login 
  // quan li tat ca moi trang cua nextjs 
  const [loggedInUser, _loading, error]= useAuthState(auth)
  useEffect(()=>{
    const setuserInDb= async()=>{
      // doc: db, collection (users), key harshed in db 
      try{
        await setDoc(
          doc(db,'users',loggedInUser?.email as string),
          {
            email: loggedInUser?.email,
            lastSeen: serverTimestamp(),// update lan cuoi nguoi dung truy cap 
            photoUrl: loggedInUser?.photoURL
          },
          {merge: true}// login lan 1 tao ra lan 1, lan 2 thi thoi 
          // xem trong db co gi can update thi se merge lai thoi 
        )
      }catch(err){
        console.log('error setting user in db', err)
      }
    }
    if(loggedInUser){
      setuserInDb()
    }
  },[loggedInUser])

  if(_loading) return <Loading/>
  
  if(!loggedInUser) return <Login/>

  return <Component {...pageProps} />

}
