import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
import Iconify from '../components/iconify';
// sections
import { ForgotForm } from '../sections/auth/forgot';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function ForgotPage() {
  const mdUp = useResponsive('up', 'md');

  return (
    <>
      <Helmet>
        <title> Forgot Pass </title>
        <link rel='icon' type='image/x-icon' href='/assets/logo.svg' />


      </Helmet>

      <StyledRoot className='forgot-section'>
        
        {/* <a href={"/login"}>
          <img className='logo-img' src="/assets/logo.png" alt="logo-img" />
        </a> */}
        <Container maxWidth="sm">
          <StyledContent>
            <div className='auth-form'> 
              <Typography variant="h4" gutterBottom>
                Recovery your password at Demo page
              </Typography>

              <Typography variant="body2" sx={{ mb: 5 }}>
                Already have an account? {''}
                <Link href={"/login"} variant="subtitle2" style={{ cursor: "pointer" }}>Sign in</Link>
              </Typography>

              {/* <Stack direction="row" spacing={2}>
                <Button fullWidth size="large" color="inherit" variant="outlined">
                  <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
                </Button>

                <Button fullWidth size="large" color="inherit" variant="outlined">
                  <Iconify icon="eva:facebook-fill" color="#1877F2" width={22} height={22} />
                </Button>

                <Button fullWidth size="large" color="inherit" variant="outlined">
                  <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={22} height={22} />
                </Button>
              </Stack> */}

              {/* <Divider sx={{ my: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  OR
                </Typography>
              </Divider> */}

              <ForgotForm />

            </div>

          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
