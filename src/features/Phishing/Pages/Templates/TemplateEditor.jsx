import React from "react";
import { Formik, Form } from "formik";
import { Link, useNavigate, useParams } from "react-router-dom";
import PhishingAlert from "../../Components/Shared/PhishingAlert";
import PhishingLoading from "../../Components/Shared/PhishingLoading";
import RoleGate from "../../Components/Shared/RoleGate";
import { canEditTemplates } from "../../utils/roles";
import useTemplates from "../../hooks/useTemplates";
import FormFieldError from "../../../../components/forms/FormFieldError";
import "../../Components/Shared/PhishingShared.css";

export default function TemplateEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";
  const { template, loading, createTemplate, updateTemplate } = useTemplates(isNew ? null : id);
  const [error, setError] = React.useState(null);

  if (loading && !isNew) return <PhishingLoading message="Loading template..." />;

  return (
    <RoleGate allow={canEditTemplates} fallback={<p className="text-danger p-3">Template edit access denied.</p>}>
      <div className="phishing-soc-page">
        <div className="d-flex justify-content-between mb-3">
          <h5 className="text-white">{isNew ? "Create Template" : "Edit Template"}</h5>
          <Link to="/Phishing/Templates" className="btn integration-btn">Back</Link>
        </div>
        <PhishingAlert type="danger" message={error} />

        <Formik
          enableReinitialize
          initialValues={{
            name: template?.name ?? "",
            subject: template?.subject ?? "",
            htmlBody: template?.htmlBody ?? template?.body ?? "",
            textBody: template?.textBody ?? "",
            category: template?.category ?? "credential",
            language: template?.language ?? "en",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.name.trim()) errors.name = "Template name is required";
            if (!values.subject.trim()) errors.subject = "Subject is required";
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            setError(null);
            setSubmitting(true);
            try {
              if (isNew) {
                const created = await createTemplate(values);
                navigate(`/Phishing/Templates/${created?.id}/edit`);
              } else {
                await updateTemplate(id, values);
              }
            } catch (err) {
              setError(err.message);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form className="dashboard-card p-3" noValidate>
              <div className="mb-3">
                <label className="text-secondary" htmlFor="templateName">Name</label>
                <FormFieldError name="name" errors={errors} touched={touched} />
                <input
                  id="templateName"
                  name="name"
                  className="form-control header-search-input"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(touched.name && errors.name)}
                />
              </div>
              <div className="mb-3">
                <label className="text-secondary" htmlFor="templateSubject">Subject</label>
                <FormFieldError name="subject" errors={errors} touched={touched} />
                <input
                  id="templateSubject"
                  name="subject"
                  className="form-control header-search-input"
                  value={values.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(touched.subject && errors.subject)}
                />
              </div>
              <div className="mb-3">
                <label className="text-secondary" htmlFor="templateCategory">Category</label>
                <select
                  id="templateCategory"
                  name="category"
                  className="form-select scanType-select border-0"
                  value={values.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="credential">Credential</option>
                  <option value="finance">Finance</option>
                  <option value="delivery">Delivery</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="text-secondary" htmlFor="templateHtmlBody">HTML Body</label>
                <textarea
                  id="templateHtmlBody"
                  name="htmlBody"
                  className="form-control header-search-input"
                  rows={12}
                  value={values.htmlBody}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <button type="submit" className="btn add-btn text-white border-0" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Template"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </RoleGate>
  );
}
