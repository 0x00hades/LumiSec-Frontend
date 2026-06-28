import React from "react";
import { Formik, Form } from "formik";
import { Link, useNavigate, useParams } from "react-router-dom";
import PhishingAlert from "../../Components/Shared/PhishingAlert";
import PhishingLoading from "../../Components/Shared/PhishingLoading";
import RoleGate from "../../Components/Shared/RoleGate";
import { canEditTemplates } from "../../utils/roles";
import useLandingPages from "../../hooks/useLandingPages";
import FormFieldError from "../../../../components/forms/FormFieldError";
import { isValidUrl } from "../../../../utils/formValidation";
import "../../Components/Shared/PhishingShared.css";

export default function LandingPageEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";
  const { page, loading, createLandingPage, updateLandingPage } = useLandingPages(isNew ? null : id);
  const [error, setError] = React.useState(null);

  if (loading && !isNew) return <PhishingLoading message="Loading landing page..." />;

  return (
    <RoleGate allow={canEditTemplates} fallback={<p className="text-danger p-3">Access denied.</p>}>
      <div className="phishing-soc-page">
        <div className="d-flex justify-content-between mb-3">
          <h5 className="text-white">{isNew ? "Create Landing Page" : "Edit Landing Page"}</h5>
          <Link to="/Phishing/LandingPages" className="btn integration-btn">Back</Link>
        </div>
        <PhishingAlert type="danger" message={error} />

        <Formik
          enableReinitialize
          initialValues={{
            name: page?.name ?? "",
            title: page?.title ?? page?.name ?? "",
            htmlContent: page?.htmlContent ?? page?.html ?? "",
            redirectUrl: page?.redirectUrl ?? "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.name.trim()) errors.name = "Name is required";
            if (!values.title.trim()) errors.title = "Page title is required";
            if (!values.htmlContent.trim()) errors.htmlContent = "HTML content is required";
            if (values.redirectUrl.trim() && !isValidUrl(values.redirectUrl)) {
              errors.redirectUrl = "Enter a valid URL";
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            setError(null);
            setSubmitting(true);
            try {
              if (isNew) {
                const created = await createLandingPage(values);
                const nextId = created?._id ?? created?.id ?? created?.page?._id ?? created?.page?.id;
                if (!nextId) throw new Error("Landing page created but no id was returned.");
                navigate(`/Phishing/LandingPages/${nextId}/edit`);
              } else {
                await updateLandingPage(id, values);
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
                <label className="text-secondary" htmlFor="landingPageName">Name</label>
                <FormFieldError name="name" errors={errors} touched={touched} />
                <input
                  id="landingPageName"
                  name="name"
                  className="form-control header-search-input"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(touched.name && errors.name)}
                />
              </div>
              <div className="mb-3">
                <label className="text-secondary" htmlFor="landingPageTitle">Page Title</label>
                <FormFieldError name="title" errors={errors} touched={touched} />
                <input
                  id="landingPageTitle"
                  name="title"
                  className="form-control header-search-input"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(touched.title && errors.title)}
                />
              </div>
              <div className="mb-3">
                <label className="text-secondary" htmlFor="landingPageRedirectUrl">Redirect URL</label>
                <FormFieldError name="redirectUrl" errors={errors} touched={touched} />
                <input
                  id="landingPageRedirectUrl"
                  name="redirectUrl"
                  className="form-control header-search-input"
                  value={values.redirectUrl}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="https://example.com/after-training"
                  aria-invalid={Boolean(touched.redirectUrl && errors.redirectUrl)}
                />
              </div>
              <div className="mb-3">
                <label className="text-secondary" htmlFor="landingPageHtmlContent">HTML Content</label>
                <FormFieldError name="htmlContent" errors={errors} touched={touched} />
                <textarea
                  id="landingPageHtmlContent"
                  name="htmlContent"
                  className="form-control header-search-input"
                  rows={14}
                  value={values.htmlContent}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(touched.htmlContent && errors.htmlContent)}
                />
              </div>
              <button type="submit" className="btn add-btn text-white border-0" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </RoleGate>
  );
}
