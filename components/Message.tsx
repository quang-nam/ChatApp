import { auth } from '@/config/firebase'
import { IMessage } from '@/types'

import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'

const StyledMessage = styled.p`
	width: fit-content;
	word-break: break-all;
	max-width: 90%;
	min-width: 30%;
	padding: 15px 15px 30px;
	border-radius: 8px;
	margin: 10px;
	position: relative;
`
const StyledTimestamp= styled.span`
    color: gray;
    position: absolute;
    padding: 10px;
    font-size: x-small;
    bottom:0;
    right:0;
    text-align: right;
`
// long cac style lai voi nhau 
const StyledSenderMessage = styled(StyledMessage)`
	margin-left: auto;
	background-color: #dcf8c6;
`

const StyledReceiverMessage = styled(StyledMessage)`
	background-color: whitesmoke;
`
const Message = ({message}:{message:IMessage}) => {
    // co 2 loai message: gui di va nhan ve
    const [loggedInUser,_loading,_error]= useAuthState(auth)
    const MessageType= loggedInUser?.email === message.user ?
        StyledSenderMessage :
        StyledReceiverMessage
  return (
    <MessageType>
        {message.text}
        <StyledTimestamp>{message.sent_at}</StyledTimestamp>
    </MessageType>
  )
}

export default Message