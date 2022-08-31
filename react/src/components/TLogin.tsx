import axios from "axios";
import {Navigate} from "react-router-dom";
import {useState, SyntheticEvent} from "react";
import GoogleLogin, { GoogleLoginResponse } from 'react-google-login';

export const TLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [navigate, setNavigate] = useState(false);

    const submit = async (e:SyntheticEvent) => {
        e.preventDefault();

        //set credentials to true for accessing token.
        const {data} = await axios.post('login', {
            email, password
        }, {withCredentials: true});
        console.log('data:', data )

         //this sets a cookie in Browser for authentication
        axios.defaults.headers.common['Authorization'] = `Bearer ${data['token']}`;

        setNavigate(true);
    }

    const onSuccess = async (googleUser:any) =>{
         const {data} = await axios.post('google-auth', {
            token: googleUser.tokenId,
         },{withCredentials: true})
         console.log('data:', data )

         axios.defaults.headers.common['Authorization'] = `Bearer ${data['token']}`;

         setNavigate(true);
        googleUser.getBasicProfile()
    }

    const onFailure = (e:any) =>{
        alert(e)
    }


    if (navigate) {
        return <Navigate to="/"/>;
    }

    return <main className="form-signin">
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
    </main>
}
