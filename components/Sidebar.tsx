import Avatar from "@mui/material/Avatar"
import styled from "styled-components"
import Tooltip from '@mui/material/Tooltip'
import IconButton from "@mui/material/IconButton"
import ChatIcon from '@mui/icons-material/Chat'
import Logout from '@mui/icons-material/Logout'
import MoverVerticalIcon from '@mui/icons-material/MoreVert'
import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button'
import { async } from "@firebase/util"
import { signOut } from "firebase/auth"
import { auth, db } from "@/config/firebase"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import TextField from "@mui/material/TextField"
import DialogActions from "@mui/material/DialogActions"
import { useAuthState } from "react-firebase-hooks/auth"
import { useState } from "react"
import * as EmailValidator from "email-validator"
import { addDoc, collection, query, where } from "firebase/firestore"
import { useCollection } from 'react-firebase-hooks/firestore'
import { Conversation } from "@/types"
import ConversationSelect from "./ConversationSelect"
const StyledContainer = styled.div`
    height: 100vh;
	min-width: 300px;
	max-width: 350px; /** set max and width  */
	overflow-y: scroll;
	border-right: 1px solid whitesmoke;
	/* Hide scrollbar for Chrome, Safari and Opera */
	::-webkit-scrollbar {
		display: none;
	}
	/* Hide scrollbar for IE, Edge and Firefox */
	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* Firefox */
`

const StyledHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 15px;
	height: 80px;
	border-bottom: 1px solid whitesmoke;
	position: sticky;
	top: 0;
	background-color: white;
	z-index: 1;
`

const StyledSearch= styled.div`
    display: flex;
    align-items: center;
    padding: 15px;
    border-radius: 2px;
`

// avatar cho materials ui 
const StyledUserAvatar= styled(Avatar)`
    cursor: pointer;
    :hover{
        opacity: 0.8
    }
`
const StyledSearchInput= styled.input`
    outline: none;
    border: none;
    flex: 1;
`
const StyledBarButton= styled(Button)`
    width: 100%;
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
`


function Sidebar() {
    // lay loggin user 
    const [loggedInUser, _loading, _error]= useAuthState(auth)
    
    const [isOpenNewConversationDialog, setIsOpenNewConversationDialog] =
		useState(false)

    const [recipientEmail, setRecipentEmail]= useState('')

    const toogleNewConversationDialog = (isOpen: boolean) =>{
            setIsOpenNewConversationDialog(isOpen)
            if(!isOpen) setRecipentEmail('')
    }
    const closeNewConversationDialog = ()=>{
        toogleNewConversationDialog(false)
    }
    // check if conversation already exists
    // users chua nguoi hien tai dang dang nhap 
    
    const queryGetConversationsForCurrentUser = query(
		collection(db, 'conversations') , where('users','array-contains',loggedInUser?.email)
	)
    // ban query di 
    const [conversationsSnapshot, __loading, __error] = useCollection(
		queryGetConversationsForCurrentUser
	)
    // check conversation exists 
    
    const isConversationExist =(recipientEmail: string)=>
        conversationsSnapshot?.docs.find(conversation=>
            (conversation.data() as Conversation).users.includes(recipientEmail)
    )
    const isInvitingSelf = recipientEmail === loggedInUser?.email
    const createNewConversation =async()=>{
        if(!recipientEmail) return 
        if(EmailValidator.validate(recipientEmail) && 
        !isInvitingSelf
        && !isConversationExist(recipientEmail)){
            // add conversation to db " conversation" collection
            // coveration currently is betwwen loggedin user and the user invited 
            await addDoc(collection(db,"conversations"),
            // document data 
            {
                users: [loggedInUser?.email, recipientEmail]
            })
        }
        closeNewConversationDialog()
    }
    const logout = async()=>{
        try{
            await signOut(auth)
        }catch(error){
            console.log("wrong error")
        }
    }
  return (
     <StyledContainer>
        <StyledHeader>
            <Tooltip title={loggedInUser?.email as string} placeholder="right">
            <StyledUserAvatar src={loggedInUser?.photoURL || ''}/>

            </Tooltip>
            <div>
                <IconButton>
                    <ChatIcon/>
                </IconButton>

                <IconButton>
                    <MoverVerticalIcon/>
                </IconButton>

                <IconButton onClick={logout}>
                    <Logout/>
                </IconButton>
            </div>
        </StyledHeader>

        <StyledSearch>
            <SearchIcon/>
            <StyledSearchInput placeholder="Search your input"/>
        </StyledSearch>

        <StyledBarButton onClick={()=>{
            toogleNewConversationDialog(true)
        }}>
            Start new conversation
        </StyledBarButton>
        {/**list of conversation */}
        {conversationsSnapshot?.docs.map(conversation => (
				<ConversationSelect
					key={conversation.id}
					id={conversation.id}
					conversationUsers={(conversation.data() as Conversation).users}
				/>
			))}


        <Dialog open={isOpenNewConversationDialog} 
        onClose={closeNewConversationDialog}>
        <DialogTitle> New Conversation </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a google email address for the user you wish to chat with
          </DialogContentText>
          <TextField
            autoFocus
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={recipientEmail}
            onChange={e=> setRecipentEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeNewConversationDialog}>Cancel</Button>
          <Button disabled={!recipientEmail} onClick={createNewConversation}>Create</Button>
        </DialogActions>
      </Dialog>

     </StyledContainer>
  )
}

export default Sidebar