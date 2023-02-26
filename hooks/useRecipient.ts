import { auth, db } from "@/config/firebase";
import { AppUser, Conversation } from "@/types";
import { getRecipientEmail } from "@/utils/getRecipientEmail";
import { collection, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

export const useRecipient=(conversationUsers: Conversation['users'])=>{
    const [loggedInUser, _loading, _error]= useAuthState(auth)
    // lay email nguoi mk dang chat 
    const recipientEmail = getRecipientEmail(conversationUsers, loggedInUser)
    // get recipient avatar 
    const queryRecipient = query(
        collection(db,'users'),
        where('email','==', recipientEmail)
    )// return snap shot 

    const[recipientSnapshot, __loading, __error]= useCollection(queryRecipient)
    
    //recipient neu co 1 phan tu thi lay ra phan tu dau tien so we have to force ? after 
    // doc[0] being undefined 
    // data() return all fields in the record 
    const recipient = recipientSnapshot?.docs[0]?.data() as AppUser | undefined

    return {
        recipient,
        recipientEmail,
    }
}