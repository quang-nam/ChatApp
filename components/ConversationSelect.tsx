import { useRecipient } from "@/hooks/useRecipient";
import { Conversation } from "@/types";
import { useRouter } from "next/router";
import styled from "styled-components";
import RecipientAvatar from "./RecipientAvatar";

interface ConversationChoose{
    id: string;
    conversationUsers: Conversation['users'];
}
const StyledContainer = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 15px;
	word-break: break-all; /** email dai qua tu xuong dong */
	:hover {
		background-color: #e9eaeb;
	}
`

export default function ConversationSelect(props:ConversationChoose){
  const {id, conversationUsers} = props;
  const { recipient, recipientEmail } = useRecipient(conversationUsers)
  // tìm user nào có email, photourl 
  // ko có thì để avtar chữ cái đầu tiên nằm trong email của họ 

  // thay doi duong dan trong url
  const router = useRouter()
  const onSelectConversation=() =>{
    router.push(`/conversations/${id}`)
  }
  return (
    <StyledContainer  onClick={onSelectConversation}>
        <RecipientAvatar recipient={recipient} recipientEmail={recipientEmail}/>
        <span>{recipientEmail}</span>
        
    </StyledContainer>
  )

  }