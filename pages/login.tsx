import Head from "next/head"
import styled from "styled-components"
import Image from "next/image"
import whatsapplogo from '../assets/whatsapplogo.png'
import Button from '@mui/material/Button'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { auth } from '../config/firebase'
const StyleContainer= styled.div`
    height: 100vh;
    display: grid;
    place-items: center; /** place in center quickly in grid */
    background-color: whitesmoke;
`
const StyleLoginContainer= styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100px;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
`
const StyledImageWrapper = styled.div`
	margin-bottom: 50px;
`
const login = () => {
    const [signInWithGoogle, _user, _loading, _error] = useSignInWithGoogle(auth)
    const signIn=()=>{
        signInWithGoogle()
    }
  return (
    <StyleContainer>
        <Head>
            <title>Login</title>
        </Head>
        <StyleLoginContainer>
            <StyledImageWrapper>
                <Image
                    src={whatsapplogo}
                    alt="chat app logo"
                    height='200'
                    width='200'       
                />
            </StyledImageWrapper>

            <Button variant='outlined' onClick={signIn}>
                Sign In With Google
            </Button>
        </StyleLoginContainer>
    </StyleContainer>
  )
}

export default login