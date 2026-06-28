import React, { useState } from "react";
import { Formik, Form } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/LumiSecLogoB 1@3x.png";
import "./login.css";
import "../../../styles/global.css";
import { useAuth } from "../context/AuthContext";
import { getAllowedTools } from "../../../components/rbac/rbac";
import { normalizeBackendRole } from "../../../components/rbac/roleMap";
import FormFieldError from "../../../components/forms/FormFieldError";
import { isValidEmail } from "../../../utils/formValidation";

function resolvePostLoginPath(returnUrl, role) {
  if (returnUrl && returnUrl.startsWith("/")) {
    return returnUrl;
  }
  const normalizedRole = normalizeBackendRole(role);
  const allowedTools = getAllowedTools(normalizedRole);
  return allowedTools[0]?.path ?? "/welcome";
}

export default function Login() {
  const { demoLogin, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notice, setNotice] = useState(null);

  const params = new URLSearchParams(location.search);
  const sessionExpired = params.get("session") === "expired";
  const returnUrl = params.get("returnUrl");

  const handleForgotPassword = (email) => {
    const targetEmail = email.trim() || "your account email";
    setNotice({
      type: "info",
      message: `Password reset is enabled for demo mode. Use any password to continue as ${targetEmail}.`,
    });
  };

  return (
    <div className="login-body pb-5">
      <div className="container">
        <div className="row vh-100 d-flex justify-content-center align-items-center">
          <div className="col-12 col-lg-6">
            <div className="d-flex align-items-center">
              <figure className="me-3 w-25">
                <img src={logo} className="w-100" alt="logo" />
              </figure>
              <div>
                <h1 className="text-purple">LumiSec</h1>
                <p className="text-secondary w-75">
                  A Hybrid Cybersecurity Simulation and Real-Time Response Platform.
                </p>
              </div>
            </div>
            <h2 className="colred-text w-35 mb-2">Sign in to your account</h2>
            <p className="text-secondary w-50 mb-5">
              Use your institution credentials or project account to access LumiSec dashboard.
              Access is logged and audited.
            </p>
            <div className="rounded-3 p-3 dark-background">
              <h3 className="text-purple">Why secure login?</h3>
              <ul>
                <li className="text-secondary">All checks are recorded in audit logs.</li>
                <li className="text-secondary">Secure Your Environment.</li>
                <li className="text-secondary">
                  Use institution authorization for sensitive operations.
                </li>
              </ul>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="login-form rounded-4 p-3 py-4 form-background">
              <div className="d-flex justify-content-between align-align-items-center">
                <div>
                  <h3 className="text-white">Welcome back</h3>
                  <p className="text-secondary">Sign in to continue to LumiSec</p>
                </div>
                <p className="text-secondary mb-0 d-flex align-items-center">secure</p>
              </div>

              {sessionExpired && (
                <div className="auth-alert auth-alert-warning mb-3" role="alert">
                  Your session has expired. Please sign in again.
                </div>
              )}

              {notice && (
                <div className={`auth-alert auth-alert-${notice.type} mb-3`} role="alert">
                  {notice.message}
                </div>
              )}

              <Formik
                initialValues={{ email: "", password: "", rememberMe: true }}
                validate={(values) => {
                  const errors = {};
                  const email = values.email.trim();

                  if (email && !isValidEmail(email)) {
                    errors.email = "Enter a valid email address";
                  }

                  return errors;
                }}
                onSubmit={async (values, { setSubmitting }) => {
                  setNotice(null);
                  setSubmitting(true);

                  try {
                    let destinationRole = "admin";
                    const email = values.email.trim();

                    if (email && values.password) {
                      const result = await login(email, values.password, values.rememberMe);
                      destinationRole = result.user?.role ?? destinationRole;
                    } else {
                      const result = demoLogin(email, values.rememberMe);
                      destinationRole = result.user?.role ?? destinationRole;
                    }

                    navigate(resolvePostLoginPath(returnUrl, destinationRole), { replace: true });
                  } catch (err) {
                    setNotice({
                      type: "danger",
                      message: err.message || "Login failed. Try demo mode with any password.",
                    });
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                  <Form noValidate>
                    <div className="mb-4">
                      <label className="text-secondary" htmlFor="email">
                        Email
                      </label>
                      <FormFieldError name="email" errors={errors} touched={touched} />
                      <input
                        className="form-control input-field rounded-3 mb-1"
                        type="email"
                        id="email"
                        name="email"
                        placeholder="you@organization.org"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="email"
                        disabled={isSubmitting}
                        aria-invalid={Boolean(touched.email && errors.email)}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="text-secondary" htmlFor="password">
                        Password
                      </label>
                      <FormFieldError name="password" errors={errors} touched={touched} />
                      <input
                        className="form-control mb-1 input-field rounded-3"
                        placeholder="Your secure password"
                        type="password"
                        id="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="current-password"
                        disabled={isSubmitting}
                        aria-invalid={Boolean(touched.password && errors.password)}
                      />
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                      <div className="mb-3 d-flex align-items-center">
                        <input
                          className="checkbox-input me-2"
                          type="checkbox"
                          id="rememberMe"
                          name="rememberMe"
                          checked={values.rememberMe}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                        <label className="rememberMe-label" htmlFor="rememberMe">
                          Remember me
                        </label>
                      </div>
                      <button
                        type="button"
                        className="link-action text-purple"
                        onClick={() => handleForgotPassword(values.email)}
                        disabled={isSubmitting}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <button
                      type="submit"
                      className="sign-in-btn border-0 text-white w-100 pt-3 p-2 rounded-3 mb-3"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin me-2" />
                          Signing in...
                        </>
                      ) : (
                        "Sign in"
                      )}
                    </button>
                  </Form>
                )}
              </Formik>
              <p className="text-secondary">
                By signing in you agree to our <span className="text-purple">Terms</span> &{" "}
                <span className="text-purple">Privacy</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
