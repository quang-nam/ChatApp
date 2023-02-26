import ConversationScreen from "@/components/ConversationScreen"
import Sidebar from "@/components/Sidebar"
import { auth, db } from "@/config/firebase"
import { Conversation, IMessage } from "@/types"
import { generateQueryGetMessages, transformMessage } from "@/utils/getMessageInConversation"
import { getRecipientEmail } from "@/utils/getRecipientEmail"
import { doc, getDoc, getDocs } from "firebase/firestore"
import { GetServerSideProps } from "next"
import Head from "next/head"
import { useAuthState } from "react-firebase-hooks/auth"
import styled from "styled-components"


interface Props {
	conversation: Conversation
	messages : IMessage[]
}
const StyledContainer= styled.div`
    display: flex;

`
const StyledConversationContainer = styled.div`
	flex-grow: 1;
	overflow: scroll;
	height: 100vh;
	/* Hide scrollbar for Chrome, Safari and Opera */
	::-webkit-scrollbar {
		display: none;
	}
	/* Hide scrollbar for IE, Edge and Firefox */
	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* Firefox */
`
// loading all message from url => server side rendering 
const Conversation= (props:Props)=> {
    const {conversation,messages}= props
    const [loggedInUser, _loading, _error]= useAuthState(auth)
  return (
    <StyledContainer>
        <Head>
            <title>Conversation with {getRecipientEmail(conversation.users,
                loggedInUser)}</title>
        </Head>

        <Sidebar/>

        {/* { message 
            messages.map(message=> <h1 key={message.id}>{JSON.stringify(message)}</h1>)
        } */}

            <StyledConversationContainer>
				<ConversationScreen 
                conversation={conversation} 
                messages={messages} 
                />
			</StyledConversationContainer>
        

    </StyledContainer>
  )
}

export default Conversation

// server
export const getServerSideProps: GetServerSideProps<Props, {id: string}>= async (context) => {
    const conversationId= context.params?.id
    // get conversation to know who we are chatting with

    const conversationRef = doc(db,'conversations',conversationId as string)
    // 1 doc, 1 nguoi co 1 hoi thoai
    const conversation = await getDoc(conversationRef)

    // get all message
    const queryMessages= generateQueryGetMessages(conversationId)
    // lay docs, not use collection in server side props 
    const messagesSnapShot= await getDocs(queryMessages)
    // bien doi message thanh data
    const messages = messagesSnapShot.docs.map(messageDoc=>
        transformMessage(messageDoc))
    return {
        props: {
            conversation: conversation.data() as Conversation,
            messages
        }
    }
}