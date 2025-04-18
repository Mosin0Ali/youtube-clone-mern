import styled from "styled-components";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import { useEffect, useState } from "react";
import { format } from "timeago.js";
import axios from "axios";
const CommentsWrapper = styled.div`
margin-top:20px;
margin-bottom:20px;
gap:10px;
display:flex;
align-items:start;
justify-content:space-between;
`;
const CommentorDisplayPicture = styled.img`
 width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #999;
`;


const CommentAndActions = styled.div`
    display:flex;
    flex-direction:column;
    width:100%;
  gap: 8px 12px;
  color: ${({ theme }) => theme.text};
`;
const CommentUser = styled.h5`
color:${({ theme }) => theme.text};
`;
const CommentTimeAgo = styled.p`
color:${({ theme }) => theme.textSoft};
font-size:14px;
`;


const CommentContent = styled.p`
color:${({ theme }) => theme.text};
font-size:14px;
font-weight:500;
`;

const CommentButtonWrapper = styled.div`
display:flex;
gap:30px;
align-items:center;
`;
const CommentInteractButton = styled.button`
border:none;
background:transparent;
color:${({ theme }) => theme.text};
font-weight:400;
line-height:18px;
position:relative;
`;

const NumberofCommentsLike = styled.span`
position:absolute;
color:${({ theme }) => theme.textSoft};
margin-left:5px;
`;


const ComentOptionButton = styled.button`
background-color:transparent;
color:${({ theme }) => theme.text};
border:none;
cursor:pointer;

`;


const CommentHeader = styled.div`
display:flex;
gap:10px;
align-items:center;
`;

const SingleComment = ({ commentdata }) => {
    const [commentUser, setCommentUser] = useState({});
    useEffect(
        () => {
            const fetchUser= async ()=>{
                const userDet= await axios.get(`http://localhost:8001/api/users/find/${commentdata.userId}`);
                setCommentUser(userDet.data);
            }
            fetchUser();
        }, [commentdata.userId]
    );
    return (
        <CommentsWrapper>
            <CommentorDisplayPicture src={commentUser.img}></CommentorDisplayPicture>
            <CommentAndActions>
                <CommentHeader><CommentUser>{commentUser.name}</CommentUser><CommentTimeAgo>{format(commentdata.createdAt)}</CommentTimeAgo></CommentHeader>
                <CommentContent>{commentdata.desc}</CommentContent>
                <CommentButtonWrapper>
                    <CommentInteractButton><ThumbUpOffAltIcon></ThumbUpOffAltIcon><NumberofCommentsLike>42</NumberofCommentsLike></CommentInteractButton>
                    <CommentInteractButton><ThumbDownOffAltIcon></ThumbDownOffAltIcon></CommentInteractButton>
                    <CommentInteractButton>Reply</CommentInteractButton>
                </CommentButtonWrapper>
            </CommentAndActions>
            <ComentOptionButton><MoreVertIcon /></ComentOptionButton>
        </CommentsWrapper>
    )
}
export default SingleComment;