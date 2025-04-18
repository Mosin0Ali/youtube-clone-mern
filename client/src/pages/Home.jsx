import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from "axios";
import Card from '../components/VideoCards';

const Container = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  height: 100%;
  overflow-y: auto;
`;

const Home = ({ type, searchQuery }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        let res;
        if (searchQuery) {
          res = await axios.get(`http://localhost:8001/api/video/search?q=${encodeURIComponent(searchQuery)}`, {
            withCredentials: true
          });
        } else {
          res = await axios.get(`http://localhost:8001/api/video/${type}`, {
            withCredentials: true
          });
        }
        setVideos(res.data);
      } catch (err) {
        console.error("Failed to fetch videos:", err);
      }
    };
    fetchVideos();
  }, [type, searchQuery]);

  return (
    <Container>
      {videos.map((video) => (
        <Card key={video._id} video={video} />
      ))}
    </Container>
  );
};

export default Home;
