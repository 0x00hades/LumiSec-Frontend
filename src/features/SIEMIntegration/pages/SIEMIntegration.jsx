import React from 'react';
import { useFormik } from 'formik';
import logo from "../../../assets/LumiSecLogoB 1@3x.png";
import icon from "../../../assets/Vector.png";
import "./SIEMIntegration.css";
import "../../../styles/global.css";

export default function SIEMIntegration() {

    const siemFormik = useFormik({
        initialValues: {
            protocol: 'HTTPS',
            host: 'siem.local or 10.0.0.5',
            port: '443',
            endpoint: 'https://siem.example.com/api/collect',
            format: 'JSON',
            apiKey: ''
        },
        validate: (values) => {
            const errors = {};
            if (!values.protocol) errors.protocol = "Protocol is required";
            if (!values.host) errors.host = "Host/IP is required";
            if (!values.port) {
                errors.port = "Port is required";
            } else if (isNaN(values.port)) {
                errors.port = "Port must be a number";
            }
            if (!values.format) errors.format = "Format is required";
            if (!values.apiKey) errors.apiKey = "API Key is required";
            return errors;
        },
        onSubmit: (values) => {
            console.log("Submitted Data:", values);
        }
    });

    return (
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
                                <p className='text-secondary'>Dark Web Email Breach & Threat Platform.</p>
                            </div>
                        </div>
                        <h2 className='colred-text w-35 mb-2'>SIEM Integration</h2>
                        <p className='text-secondary w-50 mb-5'>Connect your SIEM vendor to LumiSec. Fill the information and test the integration.</p>
                        <div className='rounded-3 p-3 dark-background'>
                            <h3 className='text-purple'>Integration checklist</h3>
                            <ul>
                                <li className='text-secondary'>Protocol, Host/IP, and Port must be reachable from LumiSec ingestion points.</li>
                                <li className='text-secondary'>Use HTTPS where possible.</li>
                                <li className='text-secondary'>Store API keys securely in your server vault.</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className='col-12 col-lg-6'>
                        <div className='login-form rounded-4 p-3 py-4 form-background'>
                            <div className='d-flex justify-content-between align-items-center mb-4'>
                                <h3 className='text-white'>Connect & Test</h3>
                                <p className='mb-0 d-flex align-items-center Idle rounded-5'>Idle</p>
                            </div>

                            <form onSubmit={siemFormik.handleSubmit}>
                                {/* Protocol */}
                                <div className='mb-4'>
                                {siemFormik.touched.protocol && siemFormik.errors.protocol && <div className='text-danger small'>{siemFormik.errors.protocol}</div>}
                                    <label className='text-secondary mb-1' htmlFor="protocol">Protocol</label>
                                    <input className='form-control input-field rounded-3 border-0' type="text" id='protocol' name='protocol' value={siemFormik.values.protocol} onChange={siemFormik.handleChange} onBlur={siemFormik.handleBlur} />
                                </div>

                                {/* Host & Port */}
                                <div className='row mb-4'>
                                    <div className='col-9'>
                                    {siemFormik.touched.host && siemFormik.errors.host && <div className='text-danger small'>{siemFormik.errors.host}</div>}
                                        <label className='text-secondary mb-1' htmlFor="host">Host / IP</label>
                                        <div className="d-flex align-items-center position-relative">
                                            <i className="fa-solid fa-server position-absolute ms-3 text-white"></i>
                                            <input className='form-control input-field border-0 ps-5' type="text" id='host' name='host' value={siemFormik.values.host} onChange={siemFormik.handleChange} onBlur={siemFormik.handleBlur} />
                                        </div>
                                    </div>
                                    <div className='col-3'>
                                    {siemFormik.touched.port && siemFormik.errors.port && <div className='text-danger small'>{siemFormik.errors.port}</div>}
                                        <label className='text-secondary mb-1' htmlFor="port">Port</label>
                                        <input className='form-control input-field border-0' type="text" id='port' name='port' value={siemFormik.values.port} onChange={siemFormik.handleChange} onBlur={siemFormik.handleBlur} />
                                    </div>
                                </div>

                                {/* Endpoint */}
                                <div className='mb-4'>
                                    <label className='text-secondary mb-1' htmlFor="endpoint">Endpoint (optional)</label>
                                    <div className="d-flex align-items-center position-relative">
                                        <i className="fa-solid fa-link position-absolute ms-3 text-white"></i>
                                        <input className='form-control input-field border-0 ps-5' type="text" id='endpoint' name='endpoint' value={siemFormik.values.endpoint} onChange={siemFormik.handleChange} onBlur={siemFormik.handleBlur} />
                                    </div>
                                </div>

                                {/* Format */}
                                <div className='mb-4'>
                                {siemFormik.touched.format && siemFormik.errors.format && <div className='text-danger small'>{siemFormik.errors.format}</div>}
                                    <label className='text-secondary mb-1' htmlFor="format">Format</label>
                                    <input className='form-control input-field border-0 ps-5' type="text" id='format' name='format' value={siemFormik.values.format} onChange={siemFormik.handleChange} onBlur={siemFormik.handleBlur} />
                                </div>

                                {/* API Key */}
                                <div className='mb-4'>
                                {siemFormik.touched.apiKey && siemFormik.errors.apiKey && <div className='text-danger small'>{siemFormik.errors.apiKey}</div>}
                                    <label className='text-secondary mb-1' htmlFor="apiKey">API Key / Token</label>
                                    <div className="d-flex align-items-center position-relative">
                                        <i className="fa-solid fa-key position-absolute ms-3 text-white"></i>
                                        <input className='form-control input-field border-0 ps-5' type="text" id='apiKey' name='apiKey' placeholder='Paste API key' value={siemFormik.values.apiKey} onChange={siemFormik.handleChange} onBlur={siemFormik.handleBlur} />
                                    </div>
                                </div>

                                <div className='row align-items-center gy-3'>
                                    <div className="col-8">
                                        <button type="submit" className='btn connect-btn w-100 text-white rounded-3'>Connect & Test</button>
                                    </div>
                                    <div className="col text-center">
                                        <button type="button" className='btn seim-save-btn text-white rounded-3'>Save</button>
                                    </div>
                                    <div className="col text-center">
                                        <button type="button" className='btn seim-reset-btn text-white rounded-3'>Reset</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}