import { Box } from '@mui/material';
import React from 'react';

interface LoadingAnimationProps {
  message?: string;
  minHeight?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({  
  minHeight = '60vh' 
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: minHeight,
        gap: 3,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '6.250em',
          height: '6.250em',
          animation: 'rotate5123 2.4s linear infinite',
          '@keyframes rotate5123': {
            '0%': {
              transform: 'rotate(0)',
            },
            '10%': {
              width: '6.250em',
              height: '6.250em',
            },
            '66%': {
              width: '2.4em',
              height: '2.4em',
            },
            '100%': {
              transform: 'rotate(360deg)',
              width: '6.250em',
              height: '6.250em',
            },
          },
          '@keyframes dotsY': {
            '66%': {
              opacity: 0.1,
              width: '2.4em',
            },
            '77%': {
              opacity: 1,
              width: 0,
            },
          },
          '@keyframes dotsX': {
            '66%': {
              opacity: 0.1,
              height: '2.4em',
            },
            '77%': {
              opacity: 1,
              height: 0,
            },
          },
          '@keyframes flash': {
            '33%': {
              opacity: 0,
              borderRadius: '0%',
            },
            '55%': {
              opacity: 0.6,
              borderRadius: '100%',
            },
            '66%': {
              opacity: 0,
            },
          },
        }}
      >
        {/* White center dot */}
        <Box
          sx={{
            position: 'absolute',
            margin: 'auto',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: '2.4em',
            height: '2.4em',
            borderRadius: '100%',
            background: 'white',
            animation: 'flash 2.4s linear infinite',
            opacity: 0,
          }}
        />
        {/* Red dot (top-left) */}
        <Box
          sx={{
            position: 'absolute',
            margin: 'auto',
            width: '2.4em',
            height: '2.4em',
            borderRadius: '100%',
            top: 0,
            bottom: 0,
            left: 0,
            background: '#FF4444',
            animation: 'dotsY 2.4s linear infinite',
            transition: 'all 1s ease',
          }}
        />
        {/* Yellow dot (top-right) */}
        <Box
          sx={{
            position: 'absolute',
            margin: 'auto',
            width: '2.4em',
            height: '2.4em',
            borderRadius: '100%',
            left: 0,
            right: 0,
            top: 0,
            background: '#FFBB33',
            animation: 'dotsX 2.4s linear infinite',
            transition: 'all 1s ease',
          }}
        />
        {/* Green dot (bottom-right) */}
        <Box
          sx={{
            position: 'absolute',
            margin: 'auto',
            width: '2.4em',
            height: '2.4em',
            borderRadius: '100%',
            top: 0,
            bottom: 0,
            right: 0,
            background: '#99CC00',
            animation: 'dotsY 2.4s linear infinite',
            transition: 'all 1s ease',
          }}
        />
        {/* Blue dot (bottom-left) */}
        <Box
          sx={{
            position: 'absolute',
            margin: 'auto',
            width: '2.4em',
            height: '2.4em',
            borderRadius: '100%',
            left: 0,
            right: 0,
            bottom: 0,
            background: '#33B5E5',
            animation: 'dotsX 2.4s linear infinite',
            transition: 'all 1s ease',
          }}
        />
      </Box>
    </Box>
  );
};

export default LoadingAnimation;
