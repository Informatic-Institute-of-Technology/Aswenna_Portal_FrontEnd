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
          width: '72px',
          height: '72px',
          '.banter-loader__box': {
            float: 'left',
            position: 'relative',
            width: '20px',
            height: '20px',
            marginRight: '6px',
            '&:before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              background: 'var(--color-olive)',
              borderRadius: '7px',
            },
            '&:nth-of-type(3n)': {
              marginRight: 0,
              marginBottom: '6px',
            },
            '&:nth-of-type(1):before, &:nth-of-type(4):before': {
              marginLeft: '26px',
            },
            '&:nth-of-type(3):before': {
              marginTop: '52px',
            },
            '&:last-child': {
              marginBottom: 0,
            },
          },
          '@keyframes moveBox-1': {
            '9.0909090909%': { transform: 'translate(-26px, 0)' },
            '18.1818181818%': { transform: 'translate(0px, 0)' },
            '27.2727272727%': { transform: 'translate(0px, 0)' },
            '36.3636363636%': { transform: 'translate(26px, 0)' },
            '45.4545454545%': { transform: 'translate(26px, 26px)' },
            '54.5454545455%': { transform: 'translate(26px, 26px)' },
            '63.6363636364%': { transform: 'translate(26px, 26px)' },
            '72.7272727273%': { transform: 'translate(26px, 0px)' },
            '81.8181818182%': { transform: 'translate(0px, 0px)' },
            '90.9090909091%': { transform: 'translate(-26px, 0px)' },
            '100%': { transform: 'translate(0px, 0px)' },
          },
          '.banter-loader__box:nth-of-type(1)': {
            animation: 'moveBox-1 4s infinite',
          },
          '@keyframes moveBox-2': {
            '9.0909090909%': { transform: 'translate(0, 0)' },
            '18.1818181818%': { transform: 'translate(26px, 0)' },
            '27.2727272727%': { transform: 'translate(0px, 0)' },
            '36.3636363636%': { transform: 'translate(26px, 0)' },
            '45.4545454545%': { transform: 'translate(26px, 26px)' },
            '54.5454545455%': { transform: 'translate(26px, 26px)' },
            '63.6363636364%': { transform: 'translate(26px, 26px)' },
            '72.7272727273%': { transform: 'translate(26px, 26px)' },
            '81.8181818182%': { transform: 'translate(0px, 26px)' },
            '90.9090909091%': { transform: 'translate(0px, 26px)' },
            '100%': { transform: 'translate(0px, 0px)' },
          },
          '.banter-loader__box:nth-of-type(2)': {
            animation: 'moveBox-2 4s infinite',
          },
          '@keyframes moveBox-3': {
            '9.0909090909%': { transform: 'translate(-26px, 0)' },
            '18.1818181818%': { transform: 'translate(-26px, 0)' },
            '27.2727272727%': { transform: 'translate(0px, 0)' },
            '36.3636363636%': { transform: 'translate(-26px, 0)' },
            '45.4545454545%': { transform: 'translate(-26px, 0)' },
            '54.5454545455%': { transform: 'translate(-26px, 0)' },
            '63.6363636364%': { transform: 'translate(-26px, 0)' },
            '72.7272727273%': { transform: 'translate(-26px, 0)' },
            '81.8181818182%': { transform: 'translate(-26px, -26px)' },
            '90.9090909091%': { transform: 'translate(0px, -26px)' },
            '100%': { transform: 'translate(0px, 0px)' },
          },
          '.banter-loader__box:nth-of-type(3)': {
            animation: 'moveBox-3 4s infinite',
          },
          '@keyframes moveBox-4': {
            '9.0909090909%': { transform: 'translate(-26px, 0)' },
            '18.1818181818%': { transform: 'translate(-26px, 0)' },
            '27.2727272727%': { transform: 'translate(-26px, -26px)' },
            '36.3636363636%': { transform: 'translate(0px, -26px)' },
            '45.4545454545%': { transform: 'translate(0px, 0px)' },
            '54.5454545455%': { transform: 'translate(0px, -26px)' },
            '63.6363636364%': { transform: 'translate(0px, -26px)' },
            '72.7272727273%': { transform: 'translate(0px, -26px)' },
            '81.8181818182%': { transform: 'translate(-26px, -26px)' },
            '90.9090909091%': { transform: 'translate(-26px, 0px)' },
            '100%': { transform: 'translate(0px, 0px)' },
          },
          '.banter-loader__box:nth-of-type(4)': {
            animation: 'moveBox-4 4s infinite',
          },
          '@keyframes moveBox-5': {
            '9.0909090909%': { transform: 'translate(0, 0)' },
            '18.1818181818%': { transform: 'translate(0, 0)' },
            '27.2727272727%': { transform: 'translate(0, 0)' },
            '36.3636363636%': { transform: 'translate(26px, 0)' },
            '45.4545454545%': { transform: 'translate(26px, 0)' },
            '54.5454545455%': { transform: 'translate(26px, 0)' },
            '63.6363636364%': { transform: 'translate(26px, 0)' },
            '72.7272727273%': { transform: 'translate(26px, 0)' },
            '81.8181818182%': { transform: 'translate(26px, -26px)' },
            '90.9090909091%': { transform: 'translate(0px, -26px)' },
            '100%': { transform: 'translate(0px, 0px)' },
          },
          '.banter-loader__box:nth-of-type(5)': {
            animation: 'moveBox-5 4s infinite',
          },
          '@keyframes moveBox-6': {
            '9.0909090909%': { transform: 'translate(0, 0)' },
            '18.1818181818%': { transform: 'translate(-26px, 0)' },
            '27.2727272727%': { transform: 'translate(-26px, 0)' },
            '36.3636363636%': { transform: 'translate(0px, 0)' },
            '45.4545454545%': { transform: 'translate(0px, 0)' },
            '54.5454545455%': { transform: 'translate(0px, 0)' },
            '63.6363636364%': { transform: 'translate(0px, 0)' },
            '72.7272727273%': { transform: 'translate(0px, 26px)' },
            '81.8181818182%': { transform: 'translate(-26px, 26px)' },
            '90.9090909091%': { transform: 'translate(-26px, 0px)' },
            '100%': { transform: 'translate(0px, 0px)' },
          },
          '.banter-loader__box:nth-of-type(6)': {
            animation: 'moveBox-6 4s infinite',
          },
          '@keyframes moveBox-7': {
            '9.0909090909%': { transform: 'translate(26px, 0)' },
            '18.1818181818%': { transform: 'translate(26px, 0)' },
            '27.2727272727%': { transform: 'translate(26px, 0)' },
            '36.3636363636%': { transform: 'translate(0px, 0)' },
            '45.4545454545%': { transform: 'translate(0px, -26px)' },
            '54.5454545455%': { transform: 'translate(26px, -26px)' },
            '63.6363636364%': { transform: 'translate(0px, -26px)' },
            '72.7272727273%': { transform: 'translate(0px, -26px)' },
            '81.8181818182%': { transform: 'translate(0px, 0px)' },
            '90.9090909091%': { transform: 'translate(26px, 0px)' },
            '100%': { transform: 'translate(0px, 0px)' },
          },
          '.banter-loader__box:nth-of-type(7)': {
            animation: 'moveBox-7 4s infinite',
          },
          '@keyframes moveBox-8': {
            '9.0909090909%': { transform: 'translate(0, 0)' },
            '18.1818181818%': { transform: 'translate(-26px, 0)' },
            '27.2727272727%': { transform: 'translate(-26px, -26px)' },
            '36.3636363636%': { transform: 'translate(0px, -26px)' },
            '45.4545454545%': { transform: 'translate(0px, -26px)' },
            '54.5454545455%': { transform: 'translate(0px, -26px)' },
            '63.6363636364%': { transform: 'translate(0px, -26px)' },
            '72.7272727273%': { transform: 'translate(0px, -26px)' },
            '81.8181818182%': { transform: 'translate(26px, -26px)' },
            '90.9090909091%': { transform: 'translate(26px, 0px)' },
            '100%': { transform: 'translate(0px, 0px)' },
          },
          '.banter-loader__box:nth-of-type(8)': {
            animation: 'moveBox-8 4s infinite',
          },
          '@keyframes moveBox-9': {
            '9.0909090909%': { transform: 'translate(-26px, 0)' },
            '18.1818181818%': { transform: 'translate(-26px, 0)' },
            '27.2727272727%': { transform: 'translate(0px, 0)' },
            '36.3636363636%': { transform: 'translate(-26px, 0)' },
            '45.4545454545%': { transform: 'translate(0px, 0)' },
            '54.5454545455%': { transform: 'translate(0px, 0)' },
            '63.6363636364%': { transform: 'translate(-26px, 0)' },
            '72.7272727273%': { transform: 'translate(-26px, 0)' },
            '81.8181818182%': { transform: 'translate(-52px, 0)' },
            '90.9090909091%': { transform: 'translate(-26px, 0)' },
            '100%': { transform: 'translate(0px, 0)' },
          },
          '.banter-loader__box:nth-of-type(9)': {
            animation: 'moveBox-9 4s infinite',
          },
        }}
      >
        <Box className="banter-loader__box" />
        <Box className="banter-loader__box" />
        <Box className="banter-loader__box" />
        <Box className="banter-loader__box" />
        <Box className="banter-loader__box" />
        <Box className="banter-loader__box" />
        <Box className="banter-loader__box" />
        <Box className="banter-loader__box" />
        <Box className="banter-loader__box" />
      </Box>
    </Box>
  );
};

export default LoadingAnimation;
