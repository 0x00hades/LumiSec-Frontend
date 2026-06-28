import React from "react";
import { Formik, Form } from "formik";
import { Link, useNavigate, useParams } from "react-router-dom";
import PhishingAlert from "../../Components/Shared/PhishingAlert";
import PhishingLoading from "../../Components/Shared/PhishingLoading";
import RoleGate from "../../Components/Shared/RoleGate";
import { canManageRecipients } from "../../utils/roles";
import useRecipients from "../../hooks/useRecipients";
import FormFieldError from "../../../../components/forms/FormFieldError";
import { validateEmailField } from "../../../../utils/formValidation";
import "../../Components/Shared/PhishingShared.css";

export default function RecipientEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipient, loading, error, updateRecipient } = useRecipients(id);
  const [saveError, setSaveError] = React.useState(null);

  if (loading) return <PhishingLoading message="Loading recipient..." />;

  return (
    <RoleGate allow={canManageRecipients} fallback={<p className="text-danger p-3">Access denied.</p>}>
      <div className="phishing-soc-page">
        <div className="d-flex justify-content-between mb-3">
          <h5 className="text-white">Edit Recipient</h5>
          <Link to={`/Phishing/Recipients/${id}`} className="btn integration-btn">Back</Link>
        </div>
        <PhishingAlert type="danger" message={error || saveError} />

        <Formik
          enableReinitialize
          initialValues={{
            fullName: recipient?.fullName ?? recipient?.name ?? "",
            email: recipient?.email ?? "",
            department: recipient?.department ?? "",
            jobTitle: recipient?.jobTitle ?? "",
            manager: recipient?.manager ?? "",
            status: recipient?.status ?? "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.fullName.trim()) errors.fullName = "Full name is required";
            const emailError = validateEmailField(values.email, { required: true });
            if (emailError) errors.email = emailError;
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            setSaveError(null);
            setSubmitting(true);
            try {
              await updateRecipient(id, values);
              navigate(`/Phishing/Recipients/${id}`);
            } catch (err) {
              setSaveError(err.message);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form className="dashboard-card p-3" noValidate>
              <div className="mb-3">
                <label className="text-secondary" htmlFor="recipientFullName">Full Name</label>
                <FormFieldError name="fullName" errors={errors} touched={touched} />
                <input
                  id="recipientFullName"
                  name="fullName"
                  className="form-control header-search-input"
                  value={values.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(touched.fullName && errors.fullName)}
                />
              </div>
              <div className="mb-3">
                <label className="text-secondary" htmlFor="recipientEmail">Email</label>
                <FormFieldError name="email" errors={errors} touched={touched} />
                <input
                  id="recipientEmail"
                  name="email"
                  type="email"
                  className="form-control header-search-input"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(touched.email && errors.email)}
                />
              </div>
              <div className="mb-3">
                <label className="text-secondary" htmlFor="recipientDepartment">Department</label>
                <input
                  id="recipientDepartment"
                  name="department"
                  className="form-control header-search-input"
                  value={values.department}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div className="mb-3">
                <label className="text-secondary" htmlFor="recipientJobTitle">Job Title</label>
                <input
                  id="recipientJobTitle"
                  name="jobTitle"
                  className="form-control header-search-input"
                  value={values.jobTitle}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div className="mb-3">
                <label className="text-secondary" htmlFor="recipientManager">Manager</label>
                <input
                  id="recipientManager"
                  name="manager"
                  className="form-control header-search-input"
                  value={values.manager}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <button type="submit" className="btn add-btn text-white border-0" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </RoleGate>
  );
}
