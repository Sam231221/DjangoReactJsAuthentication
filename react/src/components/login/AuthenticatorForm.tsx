import axios from "axios";
import {useEffect,SyntheticEvent, useState, ReactElement} from "react";
import qrcode from 'qrcode';

export const AuthenticatorForm = (props:{
    loginData:{
        id:number;
        secret?:string;
        otpauth_url?:string;
    }
    success:Function
}) => {
    console.log(props.loginData)
    const [code, setCode] = useState('');
    const [img, setImg] = useState<ReactElement | null>(null);
    
    const submit = async (e:SyntheticEvent) => {
        e.preventDefault();

        //set credentials to true for accessing token.
        const {status, data} = await axios.post('two-factor', {
            ...props.loginData, code
        }, {withCredentials: true})

        console.log('data:', data )

        //this sets a cookie in Browser for authentication
        axios.defaults.headers.common['Authorization'] = `Bearer ${data['token']}`;
        if (status === 200){
            props.success();
        }
    }
        
    useEffect(()=>{
        if (props.loginData.otpauth_url){
            qrcode.toDataURL(props.loginData.otpauth_url, (err, data) => {
               setImg(<img src={data} style={{width:'100%'}} alt="qrcode" />)
            })
        }

    }, [props.loginData.otpauth_url])
    

    return  <>
        <form onSubmit={submit}>
            <h1 className="h3 mb-3 fw-normal">Please Insert Your Authentication Code</h1>

            <div className="form-floating">
                <input className="form-control" id="floatingInput" placeholder="6 digits code"
                    onChange={e => setCode(e.target.value)}
                />
                <label htmlFor="floatingInput">6 digits Code</label>
            </div>

            <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
        </form>

        {img}
    </>
}
