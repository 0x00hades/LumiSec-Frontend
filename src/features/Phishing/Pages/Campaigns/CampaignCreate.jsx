import React, { useState } from "react";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import PhishingAlert from "../../Components/Shared/PhishingAlert";
import useCampaigns from "../../hooks/useCampaigns";
import useTemplates from "../../hooks/useTemplates";
import useRecipients from "../../hooks/useRecipients";
import RoleGate from "../../Components/Shared/RoleGate";
import { canManageCampaigns } from "../../utils/roles";
import FormFieldError from "../../../../components/forms/FormFieldError";
import "../../Components/Shared/PhishingShared.css";

const STEPS = ["Create", "Recipients", "Review"];

export default function CampaignCreate() {
  const navigate = useNavigate();
  const { createCampaign, attachCampaignRecipients } = useCampaigns();
  const { templates } = useTemplates();
  const { allRecipients } = useRecipients();
  const [step, setStep] = useState(0);
  const [error, setError] = useState(null);
  const [campaignForm, setCampaignForm] = useState({ name: "", description: "", templateId: "" });
  const [selectedRecipients, setSelectedRecipients] = useState([]);

  const toggleRecipient = (id) => {
    setSelectedRecipients((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    setError(null);
    try {
      const created = await createCampaign(campaignForm);
      const campaignId = created?.id;
      const recipientPayload = allRecipients.filter((r) => selectedRecipients.includes(r.id));
      if (recipientPayload.length && campaignId) {
        await attachCampaignRecipients(campaignId, recipientPayload);
      }
      navigate(`/Phishing/Campaigns/${campaignId}/launch`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <RoleGate allow={canManageCampaigns} fallback={<p className="text-danger p-3">Access denied.</p>}>
      <div className="phishing-soc-page">
        <h5 className="text-white">Create Campaign</h5>
        <PhishingAlert type="danger" message={error} />

        <div className="wizard-steps">
          {STEPS.map((s, i) => (
            <div key={s} className={`wizard-step ${i === step ? "active" : i < step ? "done" : ""}`}>{i + 1}. {s}</div>
          ))}
        </div>

        {step === 0 && (
          <Formik
            initialValues={campaignForm}
            enableReinitialize
            validate={(values) => {
              const errors = {};
              if (!values.name.trim()) errors.name = "Campaign name is required";
              if (!values.templateId) errors.templateId = "Please select an email template";
              return errors;
            }}
            onSubmit={(values) => {
              setCampaignForm(values);
              setStep(1);
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, submitForm, setTouched }) => (
              <Form className="dashboard-card p-3" noValidate>
                <div className="mb-3">
                  <label className="text-secondary" htmlFor="createCampaignName">Campaign Name</label>
                  <FormFieldError name="name" errors={errors} touched={touched} />
                  <input
                    id="createCampaignName"
                    name="name"
                    className="form-control header-search-input"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={Boolean(touched.name && errors.name)}
                  />
                </div>
                <div className="mb-3">
                  <label className="text-secondary" htmlFor="createCampaignDescription">Description (optional)</label>
                  <textarea
                    id="createCampaignDescription"
                    name="description"
                    className="form-control header-search-input"
                    rows={2}
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="mb-3">
                  <label className="text-secondary" htmlFor="createCampaignTemplate">Email Template</label>
                  <FormFieldError name="templateId" errors={errors} touched={touched} />
                  <select
                    id="createCampaignTemplate"
                    name="templateId"
                    className="form-select scanType-select border-0"
                    value={values.templateId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={Boolean(touched.templateId && errors.templateId)}
                  >
                    <option value="">Select template</option>
                    {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <button
                  type="button"
                  className="btn add-btn text-white border-0"
                  onClick={() => {
                    setTouched({ name: true, templateId: true });
                    submitForm();
                  }}
                >
                  Next
                </button>
              </Form>
            )}
          </Formik>
        )}

        {step === 1 && (
          <div className="dashboard-card p-3">
            <h6 className="text-white mb-3">Attach Recipients</h6>
            <div style={{ maxHeight: 300, overflowY: "auto" }}>
              {allRecipients.map((r) => (
                <label key={r.id} className="d-flex align-items-center gap-2 mb-2 text-white" htmlFor={`recipient-${r.id}`}>
                  <input
                    id={`recipient-${r.id}`}
                    name={`recipient-${r.id}`}
                    type="checkbox"
                    checked={selectedRecipients.includes(r.id)}
                    onChange={() => toggleRecipient(r.id)}
                  />
                  {r.name} — {r.email} ({r.department})
                </label>
              ))}
            </div>
            <div className="mt-3 d-flex gap-2">
              <button type="button" className="btn integration-btn" onClick={() => setStep(0)}>Back</button>
              <button type="button" className="btn add-btn text-white border-0" onClick={() => setStep(2)}>Next</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="dashboard-card p-3">
            <h6 className="text-white">Review & Create</h6>
            <p className="text-secondary">Name: {campaignForm.name}</p>
            <p className="text-secondary">Recipients: {selectedRecipients.length}</p>
            <div className="d-flex gap-2 mt-3">
              <button type="button" className="btn integration-btn" onClick={() => setStep(1)}>Back</button>
              <button type="button" className="btn add-btn text-white border-0" onClick={handleCreate}>Create & Go to Launch</button>
            </div>
          </div>
        )}
      </div>
    </RoleGate>
  );
}
