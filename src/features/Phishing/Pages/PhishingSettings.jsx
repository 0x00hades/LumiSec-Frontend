import React from "react";
import { useFormik } from "formik";
import "./PhishingSettings.css";

export default function PhishingSettings() {
  // ✅ Validation (Formik only)
  const validate = (values) => {
    const errors = {};

    // Organisation
    if (!values.orgName) {
      errors.orgName = "Organisation name is required";
    } else if (values.orgName.length < 3) {
      errors.orgName = "Must be at least 3 characters";
    }

    if (!values.timezone) {
      errors.timezone = "Timezone is required";
    }

    // Email
    if (!values.fromAddress) {
      errors.fromAddress = "From address is required";
    } else if (!values.fromAddress.includes("@")) {
      errors.fromAddress = "Invalid email format";
    }

    // Security
    if (!values.sessionTimeout) {
      errors.sessionTimeout = "Session timeout is required";
    } else if (isNaN(values.sessionTimeout)) {
      errors.sessionTimeout = "Must be a number";
    } else if (values.sessionTimeout < 5) {
      errors.sessionTimeout = "Minimum 5 minutes";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      orgName: "LumiSec Corp",
      timezone: "",
      fromAddress: "security@lumisec.io",

      autoReports: true,
      slackNotifications: false,

      requireMFA: true,
      sessionTimeout: 30,
    },

    validate,

    onSubmit: (values) => {
      console.log("Saved Settings:", values);
      alert("Settings saved successfully!");
    },
  });

  return (
    <div className="custom-width-container">
          <form onSubmit={formik.handleSubmit}>

            {/* HEADER */}
            <div>
              <h5 className="text-white">Settings</h5>
              <p className="dashboard-desc">
                Platform configuration and preferences
              </p>
            </div>

            {/* ================= ORGANISATION ================= */}
            <div className="dashboard-card mb-3">
              <p className="text-white mb-0">Organisation</p>
              <hr />

              {/* Org Name */}
              <div className="mb-3">
                {formik.touched.orgName && formik.errors.orgName && (
                  <div className="text-danger small mb-1">
                    {formik.errors.orgName}
                  </div>
                )}

                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-white mb-0">
                      Organisation Name
                    </p>
                    <p>Shown in reports and exports</p>
                  </div>

                  <input
                    className="form-control w-25 ps-2 header-search-input"
                    name="orgName"
                    value={formik.values.orgName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>

              {/* Timezone */}
              <div>
                {formik.touched.timezone && formik.errors.timezone && (
                  <div className="text-danger small mb-1">
                    {formik.errors.timezone}
                  </div>
                )}

                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-white mb-0">Timezone</p>
                    <p>
                      Used for campaign scheduling and timestamps
                    </p>
                  </div>

                  <input
                    className="form-control w-25 ps-2 header-search-input"
                    name="timezone"
                    value={formik.values.timezone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>
            </div>

            {/* ================= EMAIL ================= */}
            <div className="dashboard-card mb-3">
              <p className="text-white mb-0">
                Email Configuration
              </p>
              <hr />

              {/* From Address */}
              <div className="mb-3">
                {formik.touched.fromAddress &&
                  formik.errors.fromAddress && (
                    <div className="text-danger small mb-1">
                      {formik.errors.fromAddress}
                    </div>
                  )}

                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-white mb-0">
                      From Address
                    </p>
                    <p>Sender address for simulation emails</p>
                  </div>

                  <input
                    className="form-control w-25 ps-2 header-search-input"
                    name="fromAddress"
                    value={formik.values.fromAddress}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>

              {/* Auto Reports */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <p className="text-white mb-0">
                    Auto-generate Reports
                  </p>
                  <p>Send PDF report after each campaign ends</p>
                </div>

                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    name="autoReports"
                    checked={formik.values.autoReports}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "autoReports",
                        e.target.checked
                      )
                    }
                  />
                </div>
              </div>

              {/* Slack */}
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-white mb-0">
                    Slack Notifications
                  </p>
                  <p>
                    Post campaign milestones to Slack
                  </p>
                </div>

                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    name="slackNotifications"
                    checked={formik.values.slackNotifications}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "slackNotifications",
                        e.target.checked
                      )
                    }
                  />
                </div>
              </div>
            </div>

            {/* ================= SECURITY ================= */}
            <div className="dashboard-card mb-3">
              <p className="text-white mb-0">Security</p>
              <hr />

              {/* MFA */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <p className="text-white mb-0">
                    Require MFA
                  </p>
                  <p>
                    Enforce multi-factor authentication for all users
                  </p>
                </div>

                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    name="requireMFA"
                    checked={formik.values.requireMFA}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "requireMFA",
                        e.target.checked
                      )
                    }
                  />
                </div>
              </div>

              {/* Session Timeout */}
              <div>
                {formik.touched.sessionTimeout &&
                  formik.errors.sessionTimeout && (
                    <div className="text-danger small mb-1">
                      {formik.errors.sessionTimeout}
                    </div>
                  )}

                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-white mb-0">
                      Session Timeout (minutes)
                    </p>
                    <p>Auto-logout after inactivity</p>
                  </div>

                  <input
                    className="form-control w-25 ps-2 header-search-input"
                    name="sessionTimeout"
                    value={formik.values.sessionTimeout}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>
            </div>

            {/* ================= SAVE ================= */}
            <div className="d-flex justify-content-end">
              <button
                type="submit"
                className="save-btn p-2 rounded-3 text-white border-0"
              >
                <i className="fa-solid fa-save pe-2"></i>
                Save Settings
              </button>
            </div>
            </form>
    </div>
  );
}