import React from 'react'
import axios from 'axios';
import {SyntheticEvent, useState} from "react";
import GoogleLogin from 'react-google-login';

export const LoginForm= (props:{
    loginData:Function
    success:Function
}) => {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    //for Sign In Btn
    const submit = async (e:SyntheticEvent) => {
        e.preventDefault();

        const {data} = await axios.post('login', {
            email, password
        });
        //calls the Login.jsx loginData function
        props.loginData(data)

        
    }
    //for Google Auth Btn
    const onSuccess = async (googleUser:any) =>{
        const {data, status} = await axios.post('google-auth', {
            token: googleUser.tokenId,
         },{withCredentials: true})

         console.log('data:', data )

         //this sets a cookie in Browser for authentication
         axios.defaults.headers.common['Authorization'] = `Bearer ${data['token']}`;
         
         if (status === 200){
            //calls the Login.jsx success function
            props.success()
         }
    }

    const onFailure = (e:any) =>{
        alert(e)
    }


  return (
        <>
        <form onSubmit={submit}>
            <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

            <div className="form-floating">
                <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"
                    onChange={e => setEmail(e.target.value)}
                />
                <label htmlFor="floatingInput">Email address</label>
            </div>

            <div className="form-floating">
                <input type="password" className="form-control" id="floatingPassword" placeholder="Password"
                    onChange={e => setPassword(e.target.value)}
                />
                <label htmlFor="floatingPassword">Password</label>
            </div>

            <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
        </form>

            <GoogleLogin clientId='848686387472-1cmojobb1oqs50591bglb73fc9rbac6e.apps.googleusercontent.com' 
            buttonText='Login With Google'
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy="single_host_origin"
            className='mt-3 w-100'
            />
        </>
  )
}
