import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { format } from "timeago.js"
import axios from 'axios';


const StyledLink = styled(Link)`
  text-decoration: none;
  flex: 1 1 calc(33.33% - 20px);
  color: inherit;
`;

const Container = styled.div`
  margin-bottom: ${(props) => props.type === "sm" ? "10px" : "20px"};
  cursor: pointer;
  display:${(props) => props.type === "sm" && "flex"};
  gap:10px;
`;

const ImageContainer = styled.div`
  border-radius: ${(props) => props.type === "sm" ? "3px" : "5px"};
  overflow: hidden;
  width: ${(props) => props.type === "sm" ? "150px" : "100%"};
  aspect-ratio: 16/9;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  background-color: #999;
  object-fit: cover;
`;

const Detail = styled.div`
  display: flex;
  margin-top: ${(props) => props.type === "sm" ? "0" : "16px"};
  gap: 12px;
`;

const ChannelImage = styled.img`
  display:${(props) => props.type === "sm" ? "none" : "block"};
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #999;
`;

const Texts = styled.div``;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin-top: 0;
`;

const ChannelName = styled.h2`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin: ${(props) => props.type === "sm" ? "6px 0px" : "9px 0px"} ;
`;

const Info = styled.div`
  font-size: ${(props) => props.type === "sm" ? "12px" : "14px"};
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin: 9px 0px;
`;

const Card = ({ type, video }) => {
  const [channel, setChannel] = useState({});
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await axios.get(`http://localhost:8001/api/users/find/${video.userId}`);
        setChannel(res.data);
      } catch (error) {
        if (error.status === 404) {
          setChannel({
            name: 'N/A',
            img: '/default.jpg'
          });
        }
      }
    }
    fetchChannel();
  }, [video.userId])

  return (
    <StyledLink to={`/video/${video._id}`}>
      <Container type={type}>
        <ImageContainer type={type}>
          <Image src={`http://localhost:8001/api/cdn/${video.imgUrl}`} />
        </ImageContainer>
        <Detail type={type}>
          <ChannelImage type={type} src={channel.img} />
          <Texts>
            <Title>{video.title}</Title>
            <ChannelName type={type}>{channel.name}</ChannelName>
            <Info type={type} >{video.views} views · {format(video.createdAt)}</Info>
          </Texts>
        </Detail>
      </Container>
    </StyledLink>
  );
};

export default Card;
