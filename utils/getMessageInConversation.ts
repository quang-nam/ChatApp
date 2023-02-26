import { db } from "@/config/firebase";
import { IMessage } from "@/types";
import { collection, DocumentData, orderBy, query, QueryDocumentSnapshot, Timestamp, where } from "firebase/firestore";

export const generateQueryGetMessages= (conversationId?: string)=>
    query(collection(db,'message'), where('conversation_id','==',
            conversationId), orderBy('sent_at', 'asc'));

export const transformMessage= (message:QueryDocumentSnapshot<DocumentData>)=>(
    {
        id: message.id,
        ...message.data(), // spread out conversation_id, text, sent_at, user
        sent_at: message.data().sent_at ? convertFilestoreTimestamTostring((message.data().sent_at as Timestamp)): null
    }as IMessage
) 

export const convertFilestoreTimestamTostring= (timestamp: Timestamp)=> 
    new Date(timestamp.toDate()).toLocaleString()