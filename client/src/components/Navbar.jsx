import { useState } from "react";
import styled from 'styled-components';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined'
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UploadModal from "./UploadModal";
const Container = styled.div`
position:sticky;
top:0;
background-color:${({ theme }) => theme.bg};
padding:10px;

`;
const Wrapper = styled.div`
                display:flex;
                align-items:center;
                justify-content:flex-end;
                padding:5px 10px;
                position:relative;
                z-index:999;
                `;
const Search = styled.div`
position:absolute;
left:0;
right:11%;
margin:auto;
width:50%;
display:flex;
align-items:center;
justify-content:space-between;
border:1px solid #ccc;
border-radius:22px;
color:${({ theme }) => theme.text};
padding:0px 10px;
`;
const Input = styled.input`
border:none;
background:transparent;
width:100%;
padding:10px;
color:${({ theme }) => theme.text};
 &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: none;
  }
`;
const Button = styled.button`
  padding: 5px 10px;
  background-color: transparent;
  border: 1px solid rgb(58, 142, 202);
  color:rgb(19, 123, 201);
  border-radius: 18px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;

const User = styled.div`
display:flex;
align-items:center;
gap:10px;
font-weight:500;
color:${({ theme }) => theme.text};
`;

const Avatar = styled.img`
width:32px;
height:32px;
border-radius:50%;
background-color:#999;
`;

const SearchIconWrap = styled.div`
cursor:pointer;
`;
const Navbar = ({ onSearch }) => {
  const { currentUser } = useSelector(state => state.user);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [input, setInput] = useState("");
  const handleSearchClick = () => {
    onSearch(input);
  };

  return (
    <>
      <Container>
        <Wrapper>
          <Search>
            <Input placeholder="Search"
              value={input}
              onChange={(e) => setInput(e.target.value)} />
            <SearchIconWrap>  <SearchIcon
              onClick={handleSearchClick}
              style={{ cursor: "pointer" }}
            /></SearchIconWrap>
          </Search>
          {currentUser ? <User>
            <VideoCallOutlinedIcon onClick={() => { setUploadModalOpen(true) }} />
            <Avatar src={currentUser.img} />
            {currentUser.name}
          </User> : <Link to="signin" style={{ textDecoration: "none" }}>
            <Button><AccountCircleIcon />Sign In</Button>
          </Link>}
        </Wrapper>
      </Container>
      {uploadModalOpen && <UploadModal setUploadModalOpen={setUploadModalOpen} />}
    </>
  )

}
export default Navbar;
