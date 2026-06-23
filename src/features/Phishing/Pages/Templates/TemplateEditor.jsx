import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";

import PhishingAlert from "../../Components/Shared/PhishingAlert";
import PhishingLoading from "../../Components/Shared/PhishingLoading";
import RoleGate from "../../Components/Shared/RoleGate";
import { canEditTemplates } from "../../utils/roles";
import useTemplates from "../../hooks/useTemplates";
import "../../Components/Shared/PhishingShared.css";

export default function TemplateEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isNew = id === "new";

  const { template, loading, createTemplate, updateTemplate } =
    useTemplates(isNew ? null : id);

  // ✅ Validation function (Formik only)
  const validate = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = "Name is required";
    } else if (values.name.length < 3) {
      errors.name = "Name must be at least 3 characters";
    }

    if (!values.subject) {
      errors.subject = "Subject is required";
    } else if (values.subject.length < 5) {
      errors.subject = "Subject must be at least 5 characters";
    }

    if (!values.category) {
      errors.category = "Category is required";
    } else if (
      !["credential", "finance", "delivery"].includes(values.category)
    ) {
      errors.category = "Invalid category";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      subject: "",
      body: "",
      category: "credential",
    },

    validate, // ✅ Formik validation only

    enableReinitialize: true,

    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        if (isNew) {
          const res = await createTemplate(values);

          const newId =
            res.data?.id ?? res.data?.template?.id;

          navigate(`/Phishing/Templates/${newId}/edit`);
        } else {
          await updateTemplate(id, values);
        }
      } catch (err) {
        setFieldError("api", err.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // load template into form
  useEffect(() => {
    if (template) {
      formik.setValues({
        name: template.name || "",
        subject: template.subject || "",
        body: template.body || "",
        category: template.category || "credential",
      });
    }
  }, [template]);

  if (loading && !isNew) {
    return <PhishingLoading message="Loading template..." />;
  }

  return (
    <RoleGate
      allow={canEditTemplates}
      fallback={
        <p className="text-danger p-3">
          Template edit access denied.
        </p>
      }
    >
      <div className="phishing-soc-page">

        {/* Header */}
        <div className="d-flex justify-content-between mb-3">
          <h5 className="text-white">
            {isNew ? "Create Template" : "Edit Template"}
          </h5>

          <Link
            to="/Phishing/Templates"
            className="btn import-btn text-white"
          >
            Back
          </Link>
        </div>

        {/* API error */}
        {formik.errors.api && (
          <PhishingAlert
            type="danger"
            message={formik.errors.api}
          />
        )}

        {/* Form */}
        <form
          onSubmit={formik.handleSubmit}
          className="dashboard-card p-3"
        >
          {/* Name */}
          <div className="mb-3">

          {formik.touched.name && formik.errors.name && (
              <div className="text-danger small">
                {formik.errors.name}
              </div>
            )}
            
            <label className="text-secondary mb-2" htmlFor="name">
              Name
            </label>

            <input
              className="form-control header-search-input ps-2"
              name="name"
              id="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            
          </div>

          {/* Subject */}
          <div className="mb-3">

            
          {formik.touched.subject && formik.errors.subject && (
              <div className="text-danger small">
                {formik.errors.subject}
              </div>
            )}

            <label className="text-secondary mb-2" htmlFor="subject">
              Subject
            </label>

            <input
              className="form-control header-search-input ps-2"
              name="subject"
              id="subject"
              value={formik.values.subject}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

          </div>

          {/* Category */}
          <div className="mb-3">

          {formik.touched.category &&
              formik.errors.category && (
                <div className="text-danger small">
                  {formik.errors.category}
                </div>
              )}

            <label className="text-secondary mb-2" htmlFor="category">
              Category
            </label>

            <select
              className="form-select scanType-select border-0 ps-2"
              name="category"
              id="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="credential">Credential</option>
              <option value="finance">Finance</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>

          {/* Body */}
          <div className="mb-3">
            <label className="text-secondary mb-2" htmlFor="htmlBody">
              HTML Body
            </label>

            <textarea
              className="form-control header-search-input ps-2"
              rows={12}
              name="body"
              id="htmlBody"
              value={formik.values.body}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn add-btn text-white border-0"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting
              ? "Saving..."
              : "Save Template"}
          </button>
        </form>
      </div>
    </RoleGate>
  );
}