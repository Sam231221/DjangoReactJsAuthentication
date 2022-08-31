import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Login} from "../../react/src/components/login/Login";
import { TLogin } from './components/TLogin';
import {Register} from "../../react/src/components/Register";
import {Home} from "../../react/src/components/Home";
import Navbar from './components/Navbar';
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min';
import { ForgotPassword } from './components/ForgotPassword';
import { ResetPassword } from './components/ResetComponent';

function App() {
    return <BrowserRouter>

      <Navbar />
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/forgot" element={<ForgotPassword/>}/>
            <Route path="/reset/:token" element={<ResetPassword/>}/>
        </Routes>
    </BrowserRouter>;
}

export default App;
