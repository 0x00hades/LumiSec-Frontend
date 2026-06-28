import React, { useState } from "react";
import { Formik, Form } from "formik";
import { Link } from "react-router-dom";
import PhishingAlert from "../../Components/Shared/PhishingAlert";
import RoleGate from "../../Components/Shared/RoleGate";
import { canManageRecipients } from "../../utils/roles";
import useRecipients from "../../hooks/useRecipients";
import FormFieldError from "../../../../components/forms/FormFieldError";
import "../../Components/Shared/PhishingShared.css";

export default function ImportRecipients() {
  const { importCsv } = useRecipients();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  return (
    <RoleGate allow={canManageRecipients} fallback={<p className="text-danger p-3">Import access denied.</p>}>
      <div className="phishing-soc-page">
        <div className="d-flex justify-content-between mb-3">
          <h5 className="text-white">Import Recipients (CSV)</h5>
          <Link to="/Phishing/Recipients" className="btn integration-btn">Back</Link>
        </div>
        <PhishingAlert type="danger" message={error} />
        {success && <PhishingAlert type="success" message="Recipients imported successfully." />}

        <Formik
          initialValues={{ file: null }}
          validate={(values) => {
            const errors = {};
            if (!values.file) {
              errors.file = "Please select a CSV file";
            } else if (!values.file.name.toLowerCase().endsWith(".csv")) {
              errors.file = "File must be a CSV";
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setError(null);
            setSuccess(false);
            setSubmitting(true);
            try {
              await importCsv(values.file);
              setSuccess(true);
              resetForm();
            } catch (err) {
              setError(err.message);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, errors, touched, setFieldValue, setFieldTouched, isSubmitting }) => (
            <Form className="dashboard-card p-4" noValidate>
              <p className="text-secondary">CSV columns: name, email, department</p>
              <label className="text-secondary d-block mb-2" htmlFor="recipientCsvFile">
                CSV File
              </label>
              <FormFieldError name="file" errors={errors} touched={touched} />
              <input
                id="recipientCsvFile"
                name="file"
                type="file"
                accept=".csv"
                className="form-control mb-1"
                onChange={(event) => {
                  setFieldValue("file", event.currentTarget.files?.[0] ?? null);
                  setFieldTouched("file", true, false);
                }}
                onBlur={() => setFieldTouched("file", true)}
                aria-invalid={Boolean(touched.file && errors.file)}
              />
              <button
                type="submit"
                className="btn add-btn text-white border-0 mt-3"
                disabled={!values.file || isSubmitting}
              >
                {isSubmitting ? "Importing..." : "Upload & Import"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </RoleGate>
  );
}
