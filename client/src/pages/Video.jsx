import { useEffect, useState } from 'react';
import styled from "styled-components";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpOffIcon from '@mui/icons-material/ThumbUp';
import ThumbDownOffIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import { format } from "timeago.js";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { dislike, fetchSuccess, like } from '../redux/videoSlice';
import { subscription } from '../redux/userSlice';
import Comments from '../components/Comments';
import ReactPlayer from 'react-player';
import Card from '../components/VideoCards';
const Container = styled.div`
display:flex;
gap:24px;
`;
const Content = styled.div`
flex:5;
`;



const VideoWrapper = styled.div`
height:60vh;
width:100%;
background:${({ theme }) => theme.textSoft};
`;
const StyledPlayer = styled(ReactPlayer)`
 height:100%;
 widht:100%;
 z-index:-1;
`;

const VideoTitle = styled.h1`
font-family: "Roboto", "Arial", sans-serif;
font-size:1.6rem;
font-weight:700;
margin:20px 0px 10px 0px;
color:${({ theme }) => theme.text}
`;

const VideoDetails = styled.div`
display:flex;
align-items:center;
justify-content:space-between;
`;


const Buttons = styled.div`
display:flex;
gap:20px;`;
const Button = styled.button`
color:${({ theme }) => theme.text};
    padding: 5px 10px;
    background-color: transparent;
    border: 1px solid ${({ theme }) => theme.textSoft};
    border-radius: 18px;
    cursor: pointer;
    margin-top: 10px;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    transition: all 0.3s ease; 
    font-size:14px;
    font-weight:400;
  &:hover {
    background-color: ${({ theme }) => theme.textSoft}; 
    color: ${({ theme }) => theme.bg};                  
    border-color: ${({ theme }) => theme.bg};       
  }
`;

const Hr = styled.hr`
margin:15px 0px;
border:0.5px solid ${({ theme }) => theme.textSoft}
`;

const ChannelInfo = styled.div`
display:flex;
gap:10px;
align-items:center;
font-size:14px;
font-weight:400;
color:${({ theme }) => theme.textSoft}
`;

const ChannelImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #999;
`;
const ChannelTitle = styled.h3`
color:${({ theme }) => theme.text};

font-weight:600;
`;

const ChannelInsights = styled.div`
display:flex;
gap:3px;
flex-direction:column;
`;

const ChannelSubscribers = styled.h5`
color:${({ theme }) => theme.textSoft};
font-size:12px;
`;

const SubscribeButton = styled.button`
color:${({ theme }) => theme.buttontext};
    padding: 0px 18px;
    background-color: ${({ theme }) => theme.buttoncolor};
    border: 1px solid ${({ theme }) => theme.buttoncolor};
    border-radius: 18px;
    cursor: pointer;
    margin-left: 10px;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    line-height:36px;
    transition: all 0.3s ease; 
    font-size:14px;
    font-weight:500;
  &:hover {
    background-color: ${({ theme }) => theme.textSoft}; 
    color: ${({ theme }) => theme.bg};                  
    border-color: ${({ theme }) => theme.bg};       
  }
`;


const DetailCard = styled.div`
display:flex;
flex-direction:column;
gap:10px;
background:${({ theme }) => theme.soft}; 
padding:10px 20px;
border-radius:10px;
`;

const ViewCounter = styled.h4`
font-size:14px;
color:${({ theme }) => theme.text};
`;
const TimeAgo = styled.h4`
font-size:14px;
color:${({ theme }) => theme.text};
`;
const Tag = styled.a`
color:#3ea6ff;
font-weight:500;
 
`;
const Details = styled.p`
color:${({ theme }) => theme.text};
font-size:14px;
line-height:18px;
font-weight:500;
`;

const DetailTopRow = styled.div`
display:flex;
gap:8px;
align-items:center;
`;
const CommentBoxWrapper = styled.div`
display:flex;
flex-direction:column;
gap:15px;
margin-top:10px;
`;
const CommentBoxInfo = styled.div`
display:flex;
align-items:center;
gap:15px;
margin-top:10px;
`;

const TotalComments = styled.h3`
color:${({ theme }) => theme.text};
`;

const SortButton = styled.button`
color:${({ theme }) => theme.buttontext};
    padding: 0px 18px;
    background-color: transparent;
     color: ${({ theme }) => theme.text};     
    border: none;
    cursor: pointer;
    margin-left: 10px;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    line-height:36px;
    transition: all 0.3s ease; 
    font-size:14px;
    font-weight:500;
`;



const Recomendation = styled.div`
flex:2;
color:${({ theme }) => theme.text};
`;

const Video = () => {
    const { currentUser } = useSelector((state) => state.user);
    const { currentVideo } = useSelector((state) => state.video);
    const dispatch = useDispatch();
    const path = useLocation().pathname.split("/")[2];
    const [channel, setChannel] = useState({});
    const [recomendedVideo, setRecomended] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const videoRes = await axios.get(`http://localhost:8001/api/video/find/${path}`);
                const channelRes = await axios.get(`http://localhost:8001/api/users/find/${videoRes.data.userId}`);
                setChannel(channelRes.data);
                dispatch(fetchSuccess(videoRes.data));
            } catch (err) {
                console.log(err)
            }
        }
        fetchData();
    }, [path, dispatch]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tags = currentVideo?.tags?.length > 0 ? currentVideo.tags.join(',') : 'random'; // Default to 'random' if no tags are present
                const recomended = await axios.get(`http://localhost:8001/api/video/tags?tags=${tags}`);
                setRecomended(recomended.data);
            } catch (err) {
                console.log(err);
            }
        };
        if (currentVideo?.tags) {
            fetchData();
        }
    }, [currentVideo]);


    const handleLike = async () => {
        try {
            await axios.put(
                `http://localhost:8001/api/users/like/${currentVideo._id}`,
                {},
                {
                    withCredentials: true,
                }
            );
            dispatch(like(currentUser._id));
        } catch (err) {
            console.error("Error liking video:", err);
        }
    };
    const handleDisLike = async () => {
        await axios.put(
            `http://localhost:8001/api/users/dislike/${currentVideo._id}`,
            {},
            {
                withCredentials: true,
            }
        );
        dispatch(dislike(currentUser._id));
    }

    const handleSubscribe = async () => {
        currentUser.subscribedUsers.includes(channel._id) ?
            await axios.put(
                `http://localhost:8001/api/users/unsub/${currentVideo._id}`,
                {},
                {
                    withCredentials: true,
                }
            ) : await axios.put(
                `http://localhost:8001/api/users/sub/${currentVideo._id}`,
                {},
                {
                    withCredentials: true,
                }
            )
        dispatch(subscription(channel._id));
    }
    return (
        <Container>
            <Content>
                <VideoWrapper>
                    <StyledPlayer url={`http://localhost:8001/api/cdn/${currentVideo.videoUrl}`} controls width="100%" height="100%" />
                </VideoWrapper>
                <VideoTitle>{currentVideo?.title}</VideoTitle>
                <VideoDetails>
                    <ChannelInfo><ChannelImage src={channel.img} /><ChannelInsights><ChannelTitle>{channel.name}</ChannelTitle><ChannelSubscribers >{channel.subscribers} Subscribers</ChannelSubscribers></ChannelInsights>{currentUser._id !== currentVideo.userId && <SubscribeButton onClick={handleSubscribe}>{currentUser?.subscribedUsers?.includes(channel._id) ? 'Subscribed' : 'Subscribe'}</SubscribeButton>}</ChannelInfo>
                    <Buttons>
                        <Button onClick={handleLike}>{currentVideo?.likes?.includes(currentUser?._id) ? <ThumbUpOffIcon /> : <ThumbUpOffAltIcon />}{currentVideo?.likes?.length}</Button>
                        <Button onClick={handleDisLike}>{currentVideo?.dislikes?.includes(currentUser?._id) ? <ThumbDownOffIcon /> : <ThumbDownOffAltIcon />}{currentVideo?.dislikes?.length}</Button>
                        <Button><ShareOutlinedIcon />Share</Button>
                        <Button><BookmarkBorderOutlinedIcon /></Button>
                    </Buttons>
                </VideoDetails>
                <Hr />
                <DetailCard>
                    <DetailTopRow>
                        <ViewCounter>{currentVideo?.views} views</ViewCounter>
                        <TimeAgo>{format(currentVideo?.createdAt)}</TimeAgo>
                        {currentVideo?.tags?.map((tag, key) => {
                            return <Tag key={key}>#{tag}</Tag>
                        })}
                    </DetailTopRow>
                    <Details>
                        {currentVideo?.desc}
                    </Details>
                </DetailCard>
                <Comments videoId={currentVideo._id} />
            </Content>
            <Recomendation>
                {recomendedVideo && recomendedVideo.map((video) => {
                    return <Card type="sm" key={video._id} video={video} />;  // Ensure you return the Card component
                })}
            </Recomendation>
        </Container>
    );
}
export default Video;