import { NavLink, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import "../../styles/login.css";
import { useLoginFetch } from "../../hooks/useLoginFetch";
import { toast } from 'react-toastify'
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login } = useAuth();
    const { loginFetch, loading, error } = useLoginFetch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.currentTarget;

        // Prevent API call when form invalid
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        try{
            const response = await loginFetch('/user/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            }, toast);

            if(response.success === true){
                login(response.data);

                navigate('/');
            }
        }catch(err){
            throw new Error("Error while login.");
        }
    };

    return(
        <div className="login-page">
            <div className="login-card">
                <div className="logo" aria-hidden="true" />
                <div className="title">
                    <h2>Welcome back</h2>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <InputField
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isRequired={true}
                        labelTxt="Email"
                        validationMessage="Please enter a valid email address."
                    />
                    <InputField
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        isRequired={true}
                        labelTxt="Password"
                        validationMessage="Password is required."
                    />

                    <div className="actions">
                        <Button content={loading ? "Logging in" : "Login"} buttonType="contained" isDisabled={loading}/>

                        <div className="links">
                            <NavLink to={'/forgot-password'}>
                                Forgot Password
                            </NavLink>
                            <NavLink to={'/register'}>
                                Create account
                            </NavLink>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;