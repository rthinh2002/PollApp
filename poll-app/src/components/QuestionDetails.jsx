import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, Container, Box, Typography, Grid, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { styled } from '@mui/system';
import QuestionService from '../services/questionService';
import { onChildAdded, ref } from 'firebase/database';
import { db } from '../firebase';

import Loader from './Loader';

const CustomButton = styled(Button)(({ theme }) => ({
    color: 'black', 
    borderColor: '#63B2AC',
    '&:hover': {
        backgroundColor: '#63B2AC', 
        color: 'white', 
    },
    '&.selected': {
        backgroundColor: '#63B2AC', 
        color: 'white', 
    },
}));

const QuestionDetails = () => {
    const questionService = new QuestionService();
    const navigate = useNavigate();
    const [author, setAuthor] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [optionOneVotes, setOptionOneVotes] = useState([]);
    const [optionTwoVotes, setOptionTwoVotes] = useState([]);

    const { questionId } = useParams();
    const userData = useSelector((state) => state.auth.user);

    useEffect(() => {
        const fetchInformationOnLoad = async () => {
            try {
                const question = await questionService.getQuestionById(questionId);
                setCurrentQuestion(question);

                setOptionOneVotes(question.optionOne.votes || []);
                setOptionTwoVotes(question.optionTwo.votes || []);
                // Listen for changes in option 1 votes
                const optionOneRef = ref(db, `questions/${questionId}/optionOne/votes`);
                onChildAdded(optionOneRef, snapshot => {
                    const updatedVotes = [...optionOneVotes, snapshot.val()];
                    setOptionOneVotes(updatedVotes);
                });

                // Listen for changes in option 2 votes
                const optionTwoRef = ref(db, `questions/${questionId}/optionTwo/votes`);
                onChildAdded(optionTwoRef, snapshot => {
                    const updatedVotes = [...optionTwoVotes, snapshot.val()];
                    setOptionTwoVotes(updatedVotes);
                });

                //Get user
                const user = await questionService.getUserByUserName(question.author);
                setAuthor(user);
            } catch (error) {
                console.error(error);
            }
        };

        fetchInformationOnLoad();
    }, );

    const handleCloseAndOpenPollClicked = async (type) => {
        try {
            const doneChangeStatus = await questionService.changeQuestionStatus(questionId, type);
            if(doneChangeStatus) {
                navigate(`/dashboard`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleVoteClicked = async (option) => {
        try {
            await questionService.vote(questionId, option, userData.username);

            // Update local state based on voted option
            if (option === 'optionOne') {
                const updatedVotes = [...optionOneVotes, userData.username];
                setOptionOneVotes(updatedVotes);
            } else {
                const updatedVotes = [...optionTwoVotes, userData.username];
                setOptionTwoVotes(updatedVotes);
            }
            alert('Your vote has been recorded');
            navigate(`/dashboard`);
        } catch (error) {
            console.error(error);
        }
    }


    return (
        author === null || currentQuestion === null ? <Loader /> : 
        <Container>
            {userData.username === author.username && !currentQuestion.isDone ? (
                <Box sx={{mt: 2, display: 'flex', justifyContent: 'flex-end'}}>
                    <Button variant='outlined' onClick={() => handleCloseAndOpenPollClicked(true)}>Close The Poll</Button>
                </Box>
            ) : null}

            {userData.username === author.username && currentQuestion.isDone ? (
                <Box sx={{mt: 2, display: 'flex', justifyContent: 'flex-end'}}>
                    <Button variant='outlined' onClick={() => handleCloseAndOpenPollClicked(false)}>Open The Poll</Button>
                </Box>
            ) : null}
            
            <Box
                sx={{
                bgcolor: 'white',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column', 
                width: '80%', 
                color: 'black',
                margin: 'auto',
                my: 2,
                justifyContent: 'center',
                alignItems: 'center',
                }}
            >
                <Box>
                    <Typography variant="h6" sx={{ mb: 6 }}>Poll by {author.name}</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <Avatar sx={{width: 200, height: 200, mb: 2}} alt={author.name} src="/static/images/avatar/2.jpg" />
                </Box>
                {currentQuestion.isDone ? (
                        <>
                            <Box>
                                <Typography variant="h6" sx={{ mb: 2 }}>This question was closed by author, view result below</Typography>
                            </Box>

                            <Grid container spacing={12} sx={{justifyContent: 'center', alignItems: 'center',}}>
                                <Grid item>
                                    <Typography>Option 1: {currentQuestion.optionOne.votes ? Object.keys(currentQuestion.optionOne.votes).length : 0}</Typography>
                                </Grid>

                                <Grid item>
                                    <Typography>Option 2: {currentQuestion.optionTwo.votes ? Object.keys(currentQuestion.optionTwo.votes).length : 0}</Typography>
                                </Grid>
                            </Grid>
                        </>
                    ) : (
                        <>
                            <Box>
                                <Typography variant="h6" sx={{ mb: 4 }}>Would You Rather</Typography>
                            </Box>
                            <Grid container spacing={12} sx={{justifyContent: 'center', alignItems: 'center',}}>
                                <Grid item>
                                    <CustomButton 
                                        sx={{p: 6, width: 300, height: 200}} 
                                        className={optionOneVotes.includes(userData.username) ? 'selected' : ''}
                                        variant="outlined"
                                        onClick={() => handleVoteClicked('optionOne')}
                                    >
                                        {currentQuestion.optionOne.text}
                                    </CustomButton>    
                                </Grid>

                                <Grid item>
                                    <CustomButton 
                                        sx={{p: 6, width: 300, height: 200}} 
                                        className={optionTwoVotes.includes(userData.username) ? 'selected' : ''}
                                        variant="outlined"
                                        onClick={() => handleVoteClicked('optionTwo')}
                                    >
                                        {currentQuestion.optionTwo.text}
                                    </CustomButton>
                                </Grid>
                            </Grid>
                        </>          
                    )
                }
                
            </Box>
        </Container>
    );
}

export default QuestionDetails;