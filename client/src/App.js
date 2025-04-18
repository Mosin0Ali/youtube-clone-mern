
import Menu from './components/Menu';
import React, { useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Navbar from './components/Navbar';

import { darkTheme, lightTheme } from './utils/Theme';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Video from './pages/Video';

import './index.css';
import SignIn from './pages/SignIn';
const Container = styled.div`
  display: flex;
`;

const Main = styled.div`
  flex: 7;
  background: ${({ theme }) => theme.bg};
  height:100%;
`;
const Wrapper = styled.div`
background-color:${(theme) => theme.bg};
height:100%;
padding:0px 30px;
`;

function App() {
  const [themeMode, setThemeMode] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setThemeMode(prefersDarkMode ? 'dark' : 'light');
    const themeChangeListener = (e) => {
      setThemeMode(e.matches ? 'dark' : 'light');
    };
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', themeChangeListener);
    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', themeChangeListener);
    };
  }, []);
  return (
    <ThemeProvider theme={themeMode === 'dark' ? darkTheme : lightTheme}>
      <Container>
        <BrowserRouter>
          <Menu />
          <Main>
            <Navbar onSearch={setSearchQuery} />
            <Wrapper>
              <Routes>
                <Route path='/'>
                  <Route path="/" element={<Home type="random" searchQuery={searchQuery} />} />
                  <Route path="subscriptions" element={<Home type="subscribed" searchQuery={searchQuery} />} />
                  <Route path="trending" element={<Home type="trending" searchQuery={searchQuery} />} />
                  <Route path="random" element={<Home type="random" searchQuery={searchQuery} />} />
                  <Route path="signin" element={<SignIn />} />
                  <Route path="video" >
                    <Route path=":id" element={<Video />} />
                  </Route>
                </Route>
              </Routes>
            </Wrapper>
          </Main>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;
