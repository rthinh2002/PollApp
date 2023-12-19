import React from 'react';
import { Typography, Box, Container, TextField, Button } from '@mui/material';
import QuestionService from '../services/questionService';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AddQuestion = () => {
    const questionService = new QuestionService();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.user);
    console.log(userData)
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const question = {
            author: userData.username,
            isDone: false,
            optionOne: {
                text: data.get('option1'),
                votes: [],
            },
            optionTwo: {
                text: data.get('option2'),
                votes: [],
            },
            timestamp: Date.now(),
        }
        await questionService.addNewQuestion(question);
        navigate('/dashboard');
    }

    return (
        <Container>
            <Container sx={{ 
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Box
                sx={{
                    bgcolor: 'white',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column', // Adjusted to column layout
                    border: '1px solid black', // Border for the entire box
                    width: '80%', // Adjusted width for better display
                    p: 2,
                    color: 'black',
                    margin: 'auto',
                    my: 6,
                }}
                >
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>Add Question</Typography>
                </Box>
            </Box>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="option1"
                    label="Option 1"
                    name="option1"
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="option2"
                    label="Option 2"
                    id="option2"
                    autoFocus
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Add Question
                </Button>
            </Box>
            </Container>
        </Container>
    )
}

export default AddQuestion