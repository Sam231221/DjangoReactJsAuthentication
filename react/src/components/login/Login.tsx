
import {Navigate} from "react-router-dom";
import {useState} from "react";

import { LoginForm } from "./LoginForm";
import {useDispatch} from 'react-redux';
import { AuthenticatorForm } from "./AuthenticatorForm";
import {setAuth} from '../../redux/authSlice'

export const Login = () => {
    const dispatch = useDispatch()
    const [navigate, setNavigate] = useState(false);
    const [loginData, setloginData] = useState<{
        id:number;
        secret?: string; 
        otpauth_url?:string;
    }>({
        id:0
    })
   
    const success = () => {
        setNavigate(true);
        dispatch(setAuth(true));
    }

    if (navigate) {
        return <Navigate to="/" />;
    }

    let form;
    //initilally loginData id will be 0 so it will always render LoginForm first
    if(loginData?.id === 0){
         form = <LoginForm success={success} loginData={setloginData} />
    }else{
        form = <AuthenticatorForm loginData={loginData} success={success} />
    }

    return <main className="form-signin">
       {form}
    </main>
}
