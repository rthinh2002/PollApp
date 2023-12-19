import React, { useEffect, useState } from 'react';
import { Grid, Card, Typography, Divider, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import QuestionService from '../services/questionService';

import Loader from './Loader';

const Questions = (questionType) => {
    const questionService = new QuestionService();
    const navigate = useNavigate();
    questionType = Object.values(questionType);
    const [questions, setQuestions] = useState(null);
    const [newQuestions, setNewQuestions] = useState(null);
    const [doneQuestions, setDoneQuestions] = useState(null);

    useEffect(() => {
        questionService.fetchQuestions().then((questions) => {
            setQuestions(questions);

            const newQuestions = questions.filter((question) => !question.isDone);
            setNewQuestions(newQuestions);

            const doneQuestions = questions.filter((question) => question.isDone);
            setDoneQuestions(doneQuestions);
        });

    }, );

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const amOrPm = hours >= 12 ? 'PM' : 'AM';
      
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      
        const formattedDate = `${formattedHours}:${formattedMinutes}:${amOrPm} | ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      
        return formattedDate;
    }

    const handleShowButtonClicked = (questionId) => {
        navigate(`/question/${questionId}`);
    }

    return (
      <div>
        {questions === null || newQuestions === null || doneQuestions === null ? (
          <Loader />
        ) : (
          <>
            {questionType[0] === 'new' && (
              <Grid container spacing={1}>
                {newQuestions.map((question) => (
                  <Grid item xs={12} sm={6} md={4} key={question.id}>
                    <Card sx={{ p: 2, bgcolor: 'white', color: 'black', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)' }}>
                      <Typography variant='h6' sx={{ fontWeight: 'bold' }}>{question.author}</Typography>
                      <Typography variant='body1'>{formatTimestamp(question.timestamp)}</Typography>
                      <Divider sx={{ mb: 2, mt: 2 }} />
                      <Button 
                        onClick={() => handleShowButtonClicked(question.id)} 
                        variant='outlined' 
                        sx={{ width: '100%', color: 'green', borderColor: 'green' }}
                      >
                        Show
                      </Button>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {questionType[0] === 'done' && (
              <Grid container spacing={1}>
                {doneQuestions.map((question) => (
                  <Grid item xs={12} sm={6} md={4} key={question.id}>
                    <Card sx={{ p: 2, bgcolor: 'white', color: 'black', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)' }}>
                      <Typography variant='h6' sx={{ fontWeight: 'bold' }}>{question.author}</Typography>
                      <Typography variant='body1'>{formatTimestamp(question.timestamp)}</Typography>
                      <Divider sx={{ mb: 2, mt: 2 }} />
                      <Button 
                        onClick={() => handleShowButtonClicked(question.id)}
                        variant='outlined' 
                        sx={{ width: '100%', color: 'green', borderColor: 'green' }}
                      >
                        Show
                      </Button>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </div>
    );
}

export default Questions;