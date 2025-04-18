import { useEffect, useState } from 'react';
import styled from "styled-components";
import axios from 'axios';
import SingleComment from "./SingleComment";
import SortIcon from '@mui/icons-material/Sort';
import { useSelector } from 'react-redux';

const CommentBox = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px 0px;
`;

const CommentInput = styled.input`
  width: 100%;
  height: 30px;
  background: none;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.buttoncolor};
  color: ${({ theme }) => theme.text};
  &:focus {
    outline: none;
  }
`;

const CommentBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 10px;
`;

const CommentBoxInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 10px;
`;

const TotalComments = styled.h3`
  color: ${({ theme }) => theme.text};
`;

const SortButton = styled.button`
  padding: 0px 18px;
  background-color: ${(props) => props.type === "comment" ? "#FF3D00" : "transparent"};
  color: ${({ theme }) => theme.text};     
  border: none;
  cursor: pointer;
  margin-left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  line-height: 36px;
  transition: all 0.3s ease; 
  font-size: 14px;
  font-weight: 500;
  float: ${(props) => props.type === "comment" ? "right" : "left"};
  width:${(props) => props.type === "comment" ? "100px" : ""};
`;

const CommentorDisplayPicture = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #999;
`;

const Comments = ({ videoId }) => {
    const { currentUser } = useSelector((state) => state.user);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const commentRes = await axios.get(`http://localhost:8001/api/comments/${videoId}`);
                setComments(commentRes.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchComments();
    }, [videoId]);

    const handleComment = async () => {
        if (!commentText.trim()) return;
        try {
            const res = await axios.post(
                `http://localhost:8001/api/comments/`,
                {
                    videoId,
                    desc: commentText,
                },
                { withCredentials: true }
            );
            setComments((prev) => [res.data, ...prev]);
            setCommentText('');
        } catch (err) {
            console.error("Error submitting comment:", err);
        }
    };
    return (
        <>
            <CommentBoxWrapper>
                <CommentBoxInfo>
                    <TotalComments>{comments.length} Comments</TotalComments>
                    <SortButton><SortIcon />Sort By</SortButton>
                </CommentBoxInfo>

                <CommentBox>
                    <CommentorDisplayPicture src={currentUser?.img} />
                    <CommentInput
                        placeholder="Add comment"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleComment();
                        }}
                    />
                </CommentBox>
                <SortButton onClick={handleComment} type="comment">Comment</SortButton>
            </CommentBoxWrapper>

            {comments.map((comment) => (
                <SingleComment key={comment._id} commentdata={comment} />
            ))}
        </>
    );
};

export default Comments;
