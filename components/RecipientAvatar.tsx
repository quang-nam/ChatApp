
// recipient is the return type of the useRecipient 

import { useRecipient } from "@/hooks/useRecipient"
import Avatar from "@mui/material/Avatar"
import styled from "styled-components"

type Props= ReturnType<typeof useRecipient>

// 2 truong hop
//+ nguoi chat da dang nhap vao he thong roi => co photourl and avatr
//+ chu cai dau tien trong email cua ho 
const StyledAvatar = styled(Avatar)`
	margin: 5px 15px 5px 5px;
`
const RecipientAvatar = ({recipient, recipientEmail}:Props) => {
  return (
     recipient?.photoUrl ?(
    <StyledAvatar>{recipient.photoUrl}</StyledAvatar>):
    (<StyledAvatar>
        {recipientEmail && recipientEmail.charAt(0).toUpperCase()}
    </StyledAvatar>)
  )
}

export default RecipientAvatar