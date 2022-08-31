import axios from 'axios'
import React, { SyntheticEvent, useState } from 'react'

export const ForgotPassword = () => {
    const [email, setEmail] =useState('')
    const [notify, setNotify] = useState({
        show:false,
        error: false,
        message: ''
    })
    const submit = async (e:SyntheticEvent) => {
        e.preventDefault()
        try{
            await axios.post('forgot', {email})
            setNotify({
                show:true,
                error:false,
                message: 'Please Check Your Email'
            })
        }catch(e){
            setNotify({
                show:true,
                error:true,
                message: 'Error Occured',
            });
        }

    }

    let info;
    if (notify.show){
        info = <div role="alert" className={notify.error?'alert alert-danger':'alert alert-success'}>
            {notify.message}
        </div>
    }
  return (
    <form className='form-signin' onSubmit={submit}>
        {info}
    <h1 className="h3 mb-3 fw-normal">Please put your email.</h1>

    <div className="form-floating">
        <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"
               onChange={e => setEmail(e.target.value)}
        />
        <label htmlFor="floatingInput">Email address</label>
    </div>


    <button className="w-100 btn btn-lg btn-primary" type="submit">Submit</button>
</form>
  )
}
