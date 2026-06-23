import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";

import PhishingAlert from "../../Components/Shared/PhishingAlert";
import PhishingLoading from "../../Components/Shared/PhishingLoading";
import RoleGate from "../../Components/Shared/RoleGate";
import { canEditTemplates } from "../../utils/roles";
import useLandingPages from "../../hooks/useLandingPages";
import "../../Components/Shared/PhishingShared.css";

export default function LandingPageEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isNew = id === "new";

  const {
    page,
    loading,
    createLandingPage,
    updateLandingPage,
  } = useLandingPages(isNew ? null : id);

  // ✅ Validation (Formik only)
  const validate = (values) => {
    const errors = {};

    // Name
    if (!values.name) {
      errors.name = "Name is required";
    } else if (values.name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters";
    }

    // URL
    if (!values.url) {
      errors.url = "URL is required";
    } else if (!values.url.startsWith("/")) {
      errors.url = "URL must start with / (example: /lp/test)";
    }

    // HTML
    if (!values.html) {
      errors.html = "HTML content is required";
    } else if (values.html.trim().length < 10) {
      errors.html = "HTML content is too short";
    }

    // Category
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
      url: "",
      html: "",
      category: "credential",
    },

    validate,

    enableReinitialize: true,

    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        if (isNew) {
          const res = await createLandingPage(values);

          const newId = res.data?.id;

          navigate(`/Phishing/LandingPages/${newId}/edit`);
        } else {
          await updateLandingPage(id, values);
        }
      } catch (err) {
        setFieldError("api", err.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Load existing page
  useEffect(() => {
    if (page) {
      formik.setValues({
        name: page.name || "",
        url: page.url || "",
        html: page.html || "",
        category: page.category || "credential",
      });
    }
  }, [page]);

  if (loading && !isNew) {
    return <PhishingLoading message="Loading landing page..." />;
  }

  return (
    <RoleGate
      allow={canEditTemplates}
      fallback={
        <p className="text-danger p-3">
          Access denied.
        </p>
      }
    >
      <div className="phishing-soc-page">

        {/* Header */}
        <div className="d-flex justify-content-between mb-3">
          <h5 className="text-white">
            {isNew
              ? "Create Landing Page"
              : "Edit Landing Page"}
          </h5>

          <Link
            to="/Phishing/LandingPages"
            className="btn import-btn text-white"
          >
            Back
          </Link>
        </div>

        {/* API Error */}
        {formik.errors.api && (
          <PhishingAlert
            type="danger"
            message={formik.errors.api}
          />
        )}

        {/* FORM */}
        <form
          onSubmit={formik.handleSubmit}
          className="dashboard-card p-3"
        >

          {/* NAME */}
          <div className="mb-3">
            {formik.touched.name && formik.errors.name && (
              <div className="text-danger small mb-1">
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

          {/* URL */}
          <div className="mb-3">
            {formik.touched.url && formik.errors.url && (
              <div className="text-danger small mb-1">
                {formik.errors.url}
              </div>
            )}

            <label className="text-secondary mb-2" htmlFor="url">
              URL Path
            </label>

            <input
              className="form-control header-search-input ps-2"
              name="url"
              id="url"
              value={formik.values.url}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="/lp/example"
            />
          </div>

          {/* HTML */}
          <div className="mb-3">
            {formik.touched.html && formik.errors.html && (
              <div className="text-danger small mb-1">
                {formik.errors.html}
              </div>
            )}

            <label className="text-secondary mb-2" htmlFor="content">
              HTML Content
            </label>

            <textarea
              className="form-control header-search-input ps-2"
              rows={14}
              name="html"
              id="content"
              value={formik.values.html}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          {/* CATEGORY */}
          <div className="mb-3">
            {formik.touched.category &&
              formik.errors.category && (
                <div className="text-danger small mb-1">
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
              <option value="credential">
                Credential
              </option>
              <option value="finance">
                Finance
              </option>
              <option value="delivery">
                Delivery
              </option>
            </select>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="btn add-btn text-white border-0"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting
              ? "Saving..."
              : "Save Landing Page"}
          </button>
        </form>
      </div>
    </RoleGate>
  );
}