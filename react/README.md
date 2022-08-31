About QrCode logged in.
First User will enter the credentials then He/She will get to Authenticator Form. Now here he/she will enter the code(after scanning qrcode and recieving the code in phone) then when he click on Sign in, TwoFactorAPIView. will recieve code, verify it. If it's the first time 'tfa_secret' will be set for the user. Then the view will finally sent the access_token as 
dictionary to the frontend.
In the Frontend(React), We will use axios api for authentication, then set cookie 

for eg:
 const {status, data} = await axios.post('two-factor', {
            ...props.loginData, code
        }, {withCredentials: true})

        console.log('data:', data )

        //this sets a cookie in Browser for authentication
        axios.defaults.headers.common['Authorization'] = `Bearer ${data['token']}`;
        if (status === 200){
            props.success();
}

Note: {withCredentials: true}
axios.defaults.headers.common['Authorization'] = `Bearer ${data['token']}`;
These are a must to be included.

About Google Logged In
we use 'google-auth' package for google loggin.