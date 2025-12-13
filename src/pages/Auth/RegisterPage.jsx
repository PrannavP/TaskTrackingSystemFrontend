import { NavLink, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import "../../styles/register.css";
import { useLoginFetch } from "../../hooks/useLoginFetch";
import { toast } from 'react-toastify'
import { useState } from "react";

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [full_name, setFullName] = useState('');
    const { loginFetch, loading } = useLoginFetch();
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
            const response = await loginFetch('/user/register', {
                method: 'POST',
                body: JSON.stringify({ full_name, email, password })
            }, toast);

            if(response.success === true){
                navigate('/login');
            }
        }catch(err){
            throw new Error("Error while registering.");
        }
    };

    return(
        <div className="register-page">
            <div className="register-card">
                <div className="logo" aria-hidden="true" />
                <div className="title">
                    <h2>Create an account</h2>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <InputField
                        type="text"
                        value={full_name}
                        onChange={(e) => setFullName(e.target.value)}
                        isRequired={true}
                        labelTxt="Full Name"
                        validationMessage="Please enter full name."
                    />
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
                        <Button content={loading ? "Creating account..." : "Create account"} type="contained" isDisabled={loading}/>

                        <div className="links">
                            <NavLink to={'/login'}>
                                Already have an account
                            </NavLink>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;