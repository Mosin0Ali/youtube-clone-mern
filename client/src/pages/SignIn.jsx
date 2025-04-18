import React, { useState } from "react";
import styled from "styled-components";
import GoogleLogo from '../img/google-logo.png';
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";

import { auth, provider } from '../firebase.js';

import { signInWithPopup } from "firebase/auth";

import { useNavigate } from 'react-router-dom';

const Container = styled.div`
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
height: calc(100vh - 56px);
color:${({ theme }) => theme.text}
`;

const Wrapper = styled.div`
width:450px;
display:flex;
flex-direction:column;
gap:10px;
align-items:center;
justify-content:center;
color:${({ theme }) => theme.text};
background-color:${({ theme }) => theme.bgLighter};
padding: 10px 30px;
border: 1px solid ${({ theme }) => theme.soft};
`;

const Title = styled.h3`
font-size:24px;
`;
const InfoText = styled.h5`
font-size:24px;
font-weight:300;`;
const Input = styled.input`
border:1px solid ${({ theme }) => theme.soft};
border-radius:3px;
background-color:transparent;
color:${({ theme }) => theme.text};
padding:10px;
width:100%;
`;

const Button = styled.button`
border-radius: 3px;
border:none;
padding: 10px 20px;
font-weight:500;
cursor:pointer;
background-color: ${({ theme }) => theme.buttoncolor};
color:${({ theme }) => theme.buttontext};

`;


const More = styled.div`
width:450px;
display:flex;
gap:10px;
justify-content:space-between;
margin-top: 10px;
    font-size: 12px;
`;

const Links = styled.div`
display:flex;
gap:5px;
`;

const Link = styled.div`
display:flex;
cursor:pointer;
&:hover {
    text-decoration: underline;
  }
`;

const ImageWrapper = styled.div`
height:36px;
width:36px;
border-radius:50%;
overflow:hidden;
`;

const SignInWithGoogleImage = styled.img`
height:100%;
width:100%;
`;

const SignIn = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch(loginStart())
        try {
            const res = await axios.post(`http://localhost:8001/api/auth/signin`, { name, password }, { withCredentials: true });
            dispatch(loginSuccess(res.data));
            navigate('/');
        } catch (err) {
            dispatch(loginFailure());
        }
    }

    const handleGoogleSignIn = async () => {
        dispatch(loginStart());
        signInWithPopup(auth, provider)
            .then((result) => {
                axios.post(`http://localhost:8001/api/auth/google`, {
                    name: result.user.displayName,
                    email: result.user.email,
                    img: result.user.photoURL,
                }).then((res) => {
                    dispatch(loginSuccess(res.data));
                }).catch((error) => {
                    dispatch(loginFailure());
                });
            }).catch((error) => {
                dispatch(loginFailure());
                console.log(error);
            });
    }

    return (
        <Container>
            <Wrapper>
                <Title>Sign In</Title>
                <InfoText>to continue to MoTube</InfoText>
                <Input type="text" placeholder="username" onChange={e => setName(e.target.value)}></Input>
                <Input type="password" placeholder="password" onChange={e => setPassword(e.target.value)}></Input>
                <Button onClick={handleLogin}>Sign In</Button>
                <Title>Sign Up</Title>
                <Input type="text" placeholder="username" onChange={e => setName(e.target.value)}></Input>
                <Input type="text" placeholder="email" onChange={e => setEmail(e.target.value)}></Input>
                <Input type="password" placeholder="password" onChange={e => setPassword(e.target.value)}></Input>
                <Title>or</Title>
                <Link onClick={handleGoogleSignIn}>
                    <ImageWrapper>
                        <SignInWithGoogleImage src={GoogleLogo} />
                    </ImageWrapper>
                </Link>
            </Wrapper>
            <More>
                English(USA)
                <Links>
                    <Link>Help</Link>
                    <Link>Privacy</Link>
                    <Link>Terms</Link>
                </Links>
            </More>
        </Container>
    )
}
export default SignIn;