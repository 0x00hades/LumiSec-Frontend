import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/LumiSecLogoB 1@3x.png";
import icon from "../../../assets/Vector.png";
import "./login.css";
import "../../../styles/global.css";
import { useAuth } from "../context/AuthContext";
import { AuthApiError } from "../../../services/auth.api";
import { useFormik } from "formik";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const params = new URLSearchParams(location.search);
  const sessionExpired = params.get("session") === "expired";
  const returnUrl = params.get("returnUrl");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email.trim(), password, rememberMe);
      const destination =
        returnUrl && returnUrl.startsWith("/") ? returnUrl : "/GRC";
      navigate(destination, { replace: true });
    } catch (err) {
      const authError =
        err instanceof AuthApiError
          ? err
          : new AuthApiError(err.message || "Login failed");
      setError(authError);
    } finally {
      setLoading(false);
    }
  };

  const errorClass =
    error?.status === 403
      ? "auth-alert-warning"
      : error?.status >= 500
        ? "auth-alert-incident"
        : "auth-alert-danger";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        const loginFormik = useFormik({
          initialValues: {
            email: "",
            password: ""
          },
        
          validate: (values) => {
        
            const errors = {};
        
            if (!values.email) {
                errors.email = "This field is required";
            } else if (!emailRegex.test(values.email)) {
                errors.email = "Please enter valid email";
            }
            
            if (!values.password) {
              errors.password = "This field is required";
            }
        
            return errors;
          },
        
          onSubmit: (values) => {
            console.log(values);
          }
        });
        
        
        
            return <>
            <div className='login-body pb-5'>
                <div className='container'>
                <div className='row vh-100 d-flex justify-content-center align-items-center'>
                    <div className='col-12 col-lg-6'>
                        <div className='d-flex align-items-center'>
                            <figure className='me-3 w-25'>
                                <img src={logo} className='w-100' alt="logo" />
                            </figure>
                            <div>
                                <h1 className='text-purple'>LumiSec</h1>
                                <p className='text-secondary w-75'>A Hybrid Cybersecurity Simulation and Real-Time Response Platform.</p>
                            </div>
                        </div>
                        <h2 className='colred-text w-35 mb-2'>Sign in to your account</h2>
                        <p className='text-secondary w-50 mb-5'>Use your institution credentials or project account to access LumiSec dashboard. Access is logged and audited.</p>
                        <div className='rounded-3 p-3 dark-background'>
                            <h3 className='text-purple'>Why secure login?</h3>
                            <ul>
                                <li className='text-secondary'>All checks are recorded in audit logs.</li>
                                <li className='text-secondary'>Secure Your Environment.</li>
                                <li className='text-secondary'>Use institution authorization for sensitive operations.</li>
                            </ul>
                        </div>
                    </div>
                    <div className='col-12 col-lg-6'>
                        <div className='login-form rounded-4 p-3 py-4 form-background'>
                                <div className='d-flex justify-content-between align-align-items-center'>
                                    <div>
                                        <h3 className='text-white'>Welcome back</h3>
                                        <p className='text-secondary'>Sign in to continue to LumiSec</p>
                                </div>
                                    <p className='text-secondary mb-0 d-flex align-items-center'>secure</p>
                                </div>
                            <form action="" onSubmit={loginFormik.handleSubmit}>
                                <div className='mb-4'>
                                {loginFormik.touched.email && loginFormik.errors.email && (
                                <div className='text-danger'>{loginFormik.errors.email}</div>)}
                                    <label className='text-secondary pb-1' htmlFor="email">Email</label>
                                    <input className='form-control input-field rounded-3 mb-3' value={loginFormik.values.email} onChange={loginFormik.handleChange} onBlur={loginFormik.handleBlur} type="email" id='email' placeholder='you@organization.org' />
                                </div>
                                <div className='mb-4'>
                                {loginFormik.touched.password && loginFormik.errors.password && (
                                    <div className='text-danger'>{loginFormik.errors.password}</div>
                                )}
                                    <label className='text-secondary pb-1' htmlFor="Password">Password</label>
                                    <input className='form-control mb-3 input-field rounded-3 mb-3' value={loginFormik.values.password} onChange={loginFormik.handleChange} onBlur={loginFormik.handleBlur} placeholder='Your secure password' type="password" id="Password"  />
                                </div>
                                <div className='d-flex justify-content-between mb-4'>
                                    <div className='mb-3 d-flex align-items-center'>
                                    <input className='checkbox-input me-2' type="checkbox" id='rememberMe' />
                                    <label className='rememberMe-label' htmlFor="rememberMe">Remember me</label>
                                    </div>
                                    <Link className='text-purple text-decoration-none'>Forgot password?</Link>
                                </div>
                                <button className='sign-in-btn border-0 text-white w-100 pt-3 p-2 rounded-3 mb-3'>Sign in</button>
                                <p className='text-secondary text-center position-relative sepration-text'>or continue with</p>
                                <button className='bg-sso-btn text-white w-100 pt-3 p-2 rounded-3 mb-3'>
                                    <img className='mx-3 w-4' src={icon} alt="icon" />
                                    SSO
                                    </button>
                            </form>
                            <p className='text-secondary'>By signing in you agree to our <span className='text-purple'>Terms</span>  & <span className='text-purple'>Privacy</span> </p>
                        </div>
                    </div>
                </div>
            </div>
            </div>
  </>;
}
