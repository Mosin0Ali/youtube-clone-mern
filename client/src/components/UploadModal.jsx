import React, { useEffect, useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CelebrationIcon from '@mui/icons-material/Celebration';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchFileUploadStart,
    fetchFileUploadSuccess,
    fetchFileUploadFailure,
    clearUpload
} from '../redux/uploadSlice';

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const Wrapper = styled.div`
  width: 600px;
  height: 650px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;

const Close = styled.div`
  position: absolute;
  cursor: pointer;
  top: 10px;
  right: 10px;
  font-weight: 600;
`;

const Title = styled.h1`
  font-size: 20px;
  text-align: center;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const TextArea = styled.textarea`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const Button = styled.button`
  color: ${({ theme }) => theme.buttontext};
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
  line-height: 36px;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background-color: #FF3D00;
    color: white;
    border-color: #FF3D00;
  }
`;

const Label = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  margin: 0 0 5px 5px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProgressBar = styled.div`
  height: 6px;
  background-color: ${({ theme }) => theme.soft};
  border-radius: 4px;
  overflow: hidden;
  margin-top: 5px;
`;

const Fill = styled.div`
  height: 100%;
  background-color: #FF3D00;
  width: ${({ perc }) => perc}%;
  transition: width 0.3s ease;
`;

const SuccessUpload = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: pink;
  gap: 10px;
`;

const CelebText = styled.h3`
  font-size: 20px;
  color: pink;
`;

const UploadModal = ({ setUploadModalOpen }) => {
    const dispatch = useDispatch();
    const { currentVideo, currentImage } = useSelector(state => state.upload || {});

    const [img, setImg] = useState(undefined);
    const [video, setVideo] = useState(undefined);
    const [imgPerc, setImgPerc] = useState(0);
    const [vidPerc, setVidPerc] = useState(0);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [tags, setTags] = useState([]);
    const [isUploaded, setUploaded] = useState(false);

    const [errors, setErrors] = useState({
        title: "",
        desc: "",
        tags: "",
        videoUrl: "",
        imageUrl: ""
    });

    const imageInputRef = useRef();
    const videoInputRef = useRef();

    const handleTags = (e) => {
        setTags(e.target.value.split(",").map(tag => tag.trim()));
    }

    const uploadFile = useCallback(async (file, type) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("filetype", type);
        dispatch(fetchFileUploadStart());

        try {
            const res = await axios.post(`http://localhost:8001/api/uploadfile`, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const progressCompleted = Math.round(progressEvent.loaded * 100 / progressEvent.total);
                    type === "image" ? setImgPerc(progressCompleted) : setVidPerc(progressCompleted);
                }
            });
            const payload = {
                path: res.data.file.path,
                type
            };
            dispatch(fetchFileUploadSuccess(payload));
        } catch (err) {
            console.error(err);
            dispatch(fetchFileUploadFailure());
        }
    }, [dispatch]);

    useEffect(() => {
        if (video) uploadFile(video, "video");
    }, [video, uploadFile]);

    useEffect(() => {
        if (img) uploadFile(img, "image");
    }, [img, uploadFile]);

    const clearFields = () => {
        setTitle("");
        setDesc("");
        setTags([]);
        setImg(undefined);
        setVideo(undefined);
        setImgPerc(0);
        setVidPerc(0);
        setErrors({
            title: "",
            desc: "",
            tags: "",
            videoUrl: "",
            imageUrl: ""
        });
        if (videoInputRef.current) videoInputRef.current.value = '';
        if (imageInputRef.current) imageInputRef.current.value = '';
    };

    const handleFormSubmit = async () => {
        const newErrors = {
            title: title ? "" : "Title is required",
            desc: desc ? "" : "Description is required",
            tags: tags.length > 0 ? "" : "Tags are required",
            videoUrl: currentVideo ? "" : "Video upload is required",
            imageUrl: currentImage ? "" : "Thumbnail is required"
        };
        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(err => err !== "");
        if (hasErrors) return;

        try {
            await axios.post(`http://localhost:8001/api/video/`,
                { title, desc, imgUrl: currentImage, videoUrl: currentVideo },
                { withCredentials: true }
            );
            clearFields();
            dispatch(clearUpload());
            setUploaded(true);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Container>
            <Wrapper>
                <Close onClick={() => setUploadModalOpen(false)}>
                    <CloseIcon />
                </Close>
                <Title>Upload a new video</Title>

                {isUploaded && (
                    <SuccessUpload>
                        <CelebrationIcon />
                        <CelebText>Your video was uploaded successfully!</CelebText>
                    </SuccessUpload>
                )}

                <FormGroup>
                    <Label>Video</Label>
                    <Input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        onChange={e => setVideo(e.target.files[0])}
                    />
                    {vidPerc > 0 && <ProgressBar><Fill perc={vidPerc} /></ProgressBar>}
                    {errors.videoUrl && <span style={{ color: 'red', fontSize: '12px' }}>{errors.videoUrl}</span>}
                </FormGroup>

                <FormGroup>
                    <Input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    {errors.title && <span style={{ color: 'red', fontSize: '12px' }}>{errors.title}</span>}
                </FormGroup>

                <FormGroup>
                    <TextArea
                        rows="8"
                        placeholder="Description"
                        value={desc}
                        onChange={e => setDesc(e.target.value)}
                    />
                    {errors.desc && <span style={{ color: 'red', fontSize: '12px' }}>{errors.desc}</span>}
                </FormGroup>

                <FormGroup>
                    <Input
                        type="text"
                        placeholder="Tags with comma video,extra,mags,motube"
                        value={tags.join(",")}
                        onChange={handleTags}
                    />
                    {errors.tags && <span style={{ color: 'red', fontSize: '12px' }}>{errors.tags}</span>}
                </FormGroup>

                <FormGroup>
                    <Label>Thumbnail</Label>
                    <Input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={e => setImg(e.target.files[0])}
                    />
                    {imgPerc > 0 && <ProgressBar><Fill perc={imgPerc} /></ProgressBar>}
                    {errors.imageUrl && <span style={{ color: 'red', fontSize: '12px' }}>{errors.imageUrl}</span>}
                </FormGroup>

                <Button onClick={handleFormSubmit}><CloudUploadIcon />Upload</Button>
            </Wrapper>
        </Container>
    );
};

export default UploadModal;
