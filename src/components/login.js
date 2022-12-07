import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import TextField from '@mui/joy/TextField';
import Button from '@mui/joy/Button';
import { useNavigate } from "react-router-dom";
import post from '../services/post';

export default function Login() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    let navigate = useNavigate();
    const onSubmit=async ()=>{
      try{
    const loginRes = await post({email, password}, '/admin/login', 'post');
    if(loginRes?.status === 200){
      window.localStorage.setItem('user_id', loginRes.data.data.user_id);
      window.localStorage.setItem('user_name', loginRes.data.data.user_name);
    navigate('./categories');
    } else {
      console.log('error login')
    }
      } catch{
console.log('in catch')
      }
    }
  return (
    <CssVarsProvider>
      <main>
        <Sheet
          sx={{
            width: 300,
            mx: 'auto', // margin left & right
            my: 4, // margin top & botom
            py: 3, // padding top & bottom
            px: 2, // padding left & right
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRadius: 'sm',
            boxShadow: 'md',
          }}
          variant="outlined"
        >
          
          <div>
            <Typography level="h4" component="h1">
              <b>Welcome!</b>
            </Typography>
            <Typography level="body2">Sign in to continue.</Typography>
          </div>
          <TextField
            // html input attribute
            name="email"
            type="email"
            placeholder="johndoe@email.com"
            // pass down to FormLabel as children
            label="Email"
            onChange={(e)=>setEmail(e.target.value)}
            value={email}
          />
          <TextField
            name="password"
            type="password"
            placeholder="password"
            label="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
          <Button disabled={!(email && password)} sx={{ mt: 1 /* margin top */ }} onClick={()=>onSubmit()}>Log in</Button>
        </Sheet>
      </main>
    </CssVarsProvider>
  );
}