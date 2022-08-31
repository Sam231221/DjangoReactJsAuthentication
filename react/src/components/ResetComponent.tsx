import axios from 'axios'
import React, { SyntheticEvent, useState } from 'react'
import { useParams , Navigate} from 'react-router-dom'

export const ResetPassword = () => {
    const [password, setPassword] =useState('')
    const [passwordconfirm, setPasswordConfirm] =useState('')

    const {token} = useParams();

    const [redirect, setRedirect] = useState(false)
    const submit = async (e:SyntheticEvent) => {
        e.preventDefault()
 
            await axios.post('reset', {token, password, passwordconfirm})
            setRedirect(true)
    }

    if (redirect){
        return <Navigate to ="/login/" />
    }
  return (
    <form className='form-signin' onSubmit={submit}>
    <h1 className="h3 mb-3 fw-normal">Reset your Password.</h1>

        <div className="form-floating">
                    <input type="password" className="form-control" id="floatingPassword" placeholder="Password"
                        onChange={e => setPassword(e.target.value)}
                    />
            <label htmlFor="floatingPassword">Password</label>
        </div>
        <div className="form-floating">
            <input type="password" className="form-control" id="floatingPasswordConfirm" placeholder="Password Confirm"
                    onChange={e => setPasswordConfirm(e.target.value)}
            />
            <label htmlFor="floatingPasswordConfirm">Password Confirm</label>
        </div>


    <button className="w-100 btn btn-lg btn-primary" type="submit">Submit</button>
</form>
  )
}
