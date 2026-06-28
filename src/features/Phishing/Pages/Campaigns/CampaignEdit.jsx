import React from "react";
import { Formik, Form } from "formik";
import { Link, useNavigate, useParams } from "react-router-dom";
import PhishingAlert from "../../Components/Shared/PhishingAlert";
import PhishingLoading from "../../Components/Shared/PhishingLoading";
import RoleGate from "../../Components/Shared/RoleGate";
import { canManageCampaigns } from "../../utils/roles";
import useCampaigns from "../../hooks/useCampaigns";
import useTemplates from "../../hooks/useTemplates";
import FormFieldError from "../../../../components/forms/FormFieldError";
import "../../Components/Shared/PhishingShared.css";

export default function CampaignEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { campaign, loading, error, updateCampaign } = useCampaigns(id);
  const { templates } = useTemplates();
  const [saveError, setSaveError] = React.useState(null);

  if (loading) return <PhishingLoading message="Loading campaign..." />;

  return (
    <RoleGate allow={canManageCampaigns} fallback={<p className="text-danger p-3">Access denied.</p>}>
      <div className="phishing-soc-page">
        <div className="d-flex justify-content-between mb-3">
          <h5 className="text-white">Edit Campaign</h5>
          <Link to={`/Phishing/Campaigns/${id}`} className="btn integration-btn">Back</Link>
        </div>
        <PhishingAlert type="danger" message={error || saveError} />

        <Formik
          enableReinitialize
          initialValues={{
            name: campaign?.name ?? "",
            description: campaign?.description ?? "",
            templateId: campaign?.templateId ?? "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.name.trim()) errors.name = "Campaign name is required";
            if (!values.templateId) errors.templateId = "Please select an email template";
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            setSaveError(null);
            setSubmitting(true);
            try {
              await updateCampaign(id, values);
              navigate(`/Phishing/Campaigns/${id}`);
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
                <label className="text-secondary" htmlFor="campaignName">Campaign Name</label>
                <FormFieldError name="name" errors={errors} touched={touched} />
                <input
                  id="campaignName"
                  name="name"
                  className="form-control header-search-input"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(touched.name && errors.name)}
                />
              </div>
              <div className="mb-3">
                <label className="text-secondary" htmlFor="campaignDescription">Description</label>
                <textarea
                  id="campaignDescription"
                  name="description"
                  className="form-control header-search-input"
                  rows={3}
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div className="mb-3">
                <label className="text-secondary" htmlFor="campaignTemplate">Email Template</label>
                <FormFieldError name="templateId" errors={errors} touched={touched} />
                <select
                  id="campaignTemplate"
                  name="templateId"
                  className="form-select scanType-select border-0"
                  value={values.templateId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(touched.templateId && errors.templateId)}
                >
                  <option value="">Select template</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
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
