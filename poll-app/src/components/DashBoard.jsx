import React from 'react';
import { Box } from '@mui/material';
import {Container} from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useSelector } from 'react-redux';

import Questions from './Questions';
import Loader from './Loader';

const DashBoard = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
      !isAuthenticated ? <Loader /> :
      <Container>
        <Container sx={{
          display: 'flex',
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
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>New Questions</Typography>
            </Box>
            <Divider sx={{ width: '100%', mb: 2, borderTop: '1px solid black', }} variant="fullWidth" /> 
            <Box sx={{ textAlign: 'center' }}> 
              <Questions questionType="new"/>
            </Box>
          </Box>
        </Container>

        <Container sx={{
          display: 'flex',
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
            }}
          >
            <Box sx={{ textAlign: 'center' }}> 
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>Done</Typography>
            </Box>
            <Divider sx={{ width: '100%', mb: 2, borderTop: '1px solid black', }} variant="fullWidth" /> 
            <Box sx={{ textAlign: 'center' }}> 
              <Questions questionType="done"/>
            </Box>
          </Box>
        </Container>
      </Container>
  )
}

export default DashBoard