import React from "react";
import styled from "styled-components";
import MoTube from "../img/motube-48.png";

import { Link } from 'react-router-dom';

// Material UI Icons
import HomeIcon from '@mui/icons-material/Home';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import SubscriptionsOutlinedIcon from '@mui/icons-material/SubscriptionsOutlined';
import VideoLibraryOutlinedIcon from '@mui/icons-material/VideoLibraryOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import SmartDisplayOutlinedIcon from '@mui/icons-material/SmartDisplayOutlined'; // Your Videos
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
const Container = styled.div`
  flex: 1;
  min-width: 200px;
  background-color:${({ theme }) => theme.bg};
  height: 100vh;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  overflow-y: auto;
  position:sticky;
  top : 0;
&::-webkit-scrollbar {
  width: 4px;
}

&::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

  @media (min-width: 768px) {
    flex: 1.2;
    min-width: 240px;  
  }
`;

const Wrapper = styled.div`
  padding: 18px 15px;
  overflow:visible;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 20px;
  font-weight: bold;
  padding: 0px 10px;
`;

const Img = styled.img`
  height: 40px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  padding: 10px 10px;
  
  &:hover {
    background-color:${({ theme }) => theme.soft};
    border-radius: 5px;
    
  }
`;

const Divider = styled.hr`
  margin: 15px 0;
  border: 0.5px solidrgb(66, 65, 65);
`;

const Login = styled.div`
padding:2px;
  `;

const Button = styled.button`
  padding: 5px 10px;
  background-color: transparent;
  border: 1px solid rgb(58, 142, 202);
  color:rgb(19, 123, 201);
  border-radius: 18px;
  cursor: pointer;
  margin-top: 10px;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  `;

const Menu = () => {
  const { currentUser } = useSelector(state => state.user);

  const dispatch= useDispatch();

  const handleLogout=()=>{
    dispatch(logout());
  }
  return (
    <Container>
      <Wrapper>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Logo>
            <MenuIcon></MenuIcon>
            <Img src={MoTube} />
            MoTube
          </Logo>
        </Link>
        <Item>
          <HomeIcon />
          <Link to="random" style={{ textDecoration: "none", color: 'inherit' }}>
            Home
          </Link>
        </Item>
        <Item>
          <ExploreOutlinedIcon />
          <Link to="trending" style={{ textDecoration: "none", color: 'inherit' }}>
            Explore
          </Link>
        </Item>

        <Item>
          <SubscriptionsOutlinedIcon />
          <Link to="subscriptions" style={{ textDecoration: "none", color: 'inherit' }}>
            Subscribed
          </Link>
        </Item>
        <Divider />
        {!currentUser && <>
          <Login>
            Sign in to like videos, comment, and subscribe.
            <Link to="signin" style={{ textDecoration: "none" }}>
              <Button><AccountCircleIcon />Sign In</Button>
            </Link>
          </Login>
          <Divider /></>}
        <Item>
          <VideoLibraryOutlinedIcon />
          Library
        </Item>
        <Item>
          <HistoryOutlinedIcon />
          History
        </Item>
        <Item>
          <SmartDisplayOutlinedIcon />
          Your Videos
        </Item>
        <Item>
          <WatchLaterOutlinedIcon />
          Watch Later
        </Item>
        <Item>
          <ThumbUpOutlinedIcon />
          Liked Videos
        </Item>
        <Item>
          <ExpandMoreOutlinedIcon />
          Show More
        </Item>

        <Divider />

        <Item>
          <SettingsOutlinedIcon />
          Settings
        </Item>
        <Item>
          <FlagOutlinedIcon />
          Report History
        </Item>
        <Item>
          <HelpOutlineOutlinedIcon />
          Help
        </Item>
        <Item>
          <FeedbackOutlinedIcon />
          Send Feedback
        </Item>
        {currentUser &&
          (
            <Item onClick={handleLogout}>
            <LogoutIcon />
              Logout
          </Item>
          )
        }
      </Wrapper>
    </Container>
  );
};

export default Menu;
