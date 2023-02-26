
import { useRecipient } from '@/hooks/useRecipient'
import { Conversation, IMessage } from '@/types'
import { convertFilestoreTimestamTostring } from '@/utils/getMessageInConversation'
import IconButton from '@mui/material/IconButton'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import styled from 'styled-components'
import RecipientAvatar from './RecipientAvatar'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useRouter } from 'next/router'
import { generateQueryGetMessages, transformMessage } from "@/utils/getMessageInConversation"
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '@/config/firebase'
import { useCollection } from 'react-firebase-hooks/firestore'
import Message from './Message'
import SendIcon from '@mui/icons-material/Send'
import MicIcon from '@mui/icons-material/Mic'
import { KeyboardEventHandler, MouseEventHandler, useRef, useState } from 'react'
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore'
const StyledRecipientHeader = styled.div`
	position: sticky;
	background-color: white;
	z-index: 100; /**noi len tren */
	top: 0;
	display: flex;
	align-items: center;
	padding: 11px;
	height: 80px;
	border-bottom: 1px solid whitesmoke;
`
const StyledHeaderInfo = styled.div`
	flex-grow: 1;
	> h3 {
		margin-top: 0;
		margin-bottom: 3px;
	}
	> span {
		font-size: 14px;
		color: gray;
	}
`

const StyledH3 = styled.h3`
	word-break: break-all;
`

const StyledHeaderIcons = styled.div`
	display: flex;
`

const StyledMessageContainer = styled.div`
	padding: 30px;
	background-color: #e5ded8;
	min-height: 90vh;
`
const StyledInputContainer = styled.form`
	display: flex;
	align-items: center;
	padding: 10px;
	position: sticky;
	bottom: 0;
	background-color: white;
	z-index: 100;
`

const StyledInput = styled.input`
	flex-grow: 1;
	outline: none;
	border: none;
	border-radius: 10px;
	background-color: whitesmoke;
	padding: 15px;
	margin-left: 15px;
	margin-right: 15px;
`

const EndOfMessagesForAutoScroll = styled.div`
	margin-bottom: 30px;
`

const ConversationScreen = ({conversation, messages}:{conversation: Conversation,
    messages: IMessage[]}) => {
	const [newMessage, setNewMessage]= useState('')
    const conversationUser = conversation.users
    const {recipient,recipientEmail}=useRecipient(conversationUser)

	const router = useRouter();
	const conversationId= router.query.id
	const queryGetMessages= generateQueryGetMessages(conversationId as string)
	const [loggedInUser, _loading, _error]= useAuthState(auth)

	const [messagesSnapShot, __loading, __error]= useCollection(queryGetMessages)
	const showMessage=()=>{
		// co message tu server side roi thi hien thi 
		// ket noi voi firestore, update message tu phia firestore 

		// if front-end loading message, display message retrieved from ssr
		if(_loading){
			return messages.map(message=>
				<Message key={message.id} message={message}/>
			)
		}
		if(messagesSnapShot){
			return messagesSnapShot.docs.map(message=>(
				<Message key={message.id} message={transformMessage(message)}/>
			))
		}
		return null;
	}

	const addMessageToDbAndUpdateLastSeen= async()=>{
		// update last seen in 'users' collection
		await setDoc(doc(db,'users',loggedInUser?.email as string),
		{
			lastSeen: serverTimestamp()
		},{merge: true})
		// add new message to 'messages' collection
		await addDoc(collection(db,'message'),{
			conversation_id: conversationId,
			sent_at: serverTimestamp(),// ban dau la servertimestamp
			text: newMessage,
			user: loggedInUser?.email
		})
		// reset input fields
		setNewMessage('')

		// scroll to bottom
		scrollToBottom()
	}
	const sendMessageOnEnter:KeyboardEventHandler<HTMLInputElement> = event => {
		if(event.key ==="Enter") {
			event.preventDefault();
			if(!newMessage) return 
			// add message to db abd last seen 
			addMessageToDbAndUpdateLastSeen();
		}
	}
	const sendMessageOnClick:MouseEventHandler<HTMLButtonElement>= event=>{
		event.preventDefault();
		if(!newMessage) return
		addMessageToDbAndUpdateLastSeen();
	}

	const endOfMessageRef = useRef< HTMLDivElement>(null)

	const scrollToBottom= ()=>{
		endOfMessageRef.current?.scrollIntoView({behavior:'smooth'})
	}
  return (
	<>
     <StyledRecipientHeader>
            <RecipientAvatar
					recipient={recipient}
					recipientEmail={recipientEmail}
				/>
            <StyledHeaderInfo>
                <StyledH3>{recipientEmail}</StyledH3>
                { /**phai dki len firebase moi co last seen */
                    recipient && <span>Last active: {convertFilestoreTimestamTostring(recipient.lastSeen)}</span>
                }
            </StyledHeaderInfo>

			<StyledHeaderIcons>
					<IconButton>
						<AttachFileIcon />
					</IconButton>
					<IconButton>
						<MoreVertIcon />
					</IconButton>
				</StyledHeaderIcons>
				</StyledRecipientHeader>
			<StyledMessageContainer >
				{showMessage()}
				{/**for auto scroll when new message is sent */}
				<EndOfMessagesForAutoScroll ref={endOfMessageRef}/>
			</StyledMessageContainer>
			{/** enter new message */}

			<StyledInputContainer>
				<InsertEmoticonIcon />
				<StyledInput 
					value={newMessage}
					onChange={e=>setNewMessage(e.target.value)}
					onKeyDown={sendMessageOnEnter}
				/>
				<IconButton onClick={sendMessageOnClick} disabled={!newMessage}>
						<SendIcon/>
				</IconButton>
			</StyledInputContainer>
	</>
  )     
}

export default ConversationScreen