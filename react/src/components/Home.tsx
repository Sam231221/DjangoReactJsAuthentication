import {useEffect, useState} from "react";
import axios from "axios";
import {Navigate} from "react-router-dom";

export const Home = () => {
    const [name, setName] = useState('')
    const [navigate, setNavigate] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const {data, request} = await axios.get('user');
                console.log(data,'response:', request)
               
                setName(data.email);
            } catch (e) {
                //for reload or redirection
                setNavigate(true);
            }
        })();
    }, []);

    const logout = async () => {
        await axios.post('logout', {}, {withCredentials: true});
        setNavigate(true);
    }

    if (navigate) {
        return <Navigate to="/login"/>;
    }

    return <div className="form-signin mt-5 text-center">
        <h3>Hi {name}</h3>

        <a href="/" className="btn btn-lg btn-primary"
           onClick={logout}
        >Logout</a>
    </div>
}
