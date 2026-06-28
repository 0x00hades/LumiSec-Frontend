import React, { useState } from "react";
import { Formik, Form } from "formik";
import "./AddTaskRemediationModal.css";
import { Upload } from "lucide-react";
import { toTaskPayload } from "../../utils/normalizers";
import FormFieldError from "../../../../components/forms/FormFieldError";
import { hideBootstrapModal } from "../../../../utils/bootstrapModal";

const INITIAL_VALUES = {
  controlId: "",
  riskLevel: "High",
  description: "",
  assignedTo: "",
  dueDate: "",
  status: "Open",
  remediationPlan: "",
};

export default function AddTaskRemediationModal({ onCreate, onUpload, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = async (event, controlId) => {
    const file = event.target.files?.[0];
    if (!file || !onUpload) return;
    await onUpload(file, { controlId: controlId || undefined });
  };

  return (
    <div className="modal fade" id="AddTaskRemediationModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered AddTaskRemediationModal" role="document">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title text-white">Create Remediation Task</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          <Formik
            initialValues={INITIAL_VALUES}
            validate={(values) => {
              const errors = {};

              if (!values.controlId.trim()) {
                errors.controlId = "Control ID is required";
              }

              if (!values.description.trim()) {
                errors.description = "Finding / description is required";
              }

              if (!values.riskLevel.trim()) {
                errors.riskLevel = "Risk level is required";
              }

              return errors;
            }}
            onSubmit={async (values, { resetForm }) => {
              if (!onCreate) return;
              setSubmitting(true);
              try {
                await onCreate(
                  toTaskPayload({
                    controlId: values.controlId,
                    riskLevel: values.riskLevel,
                    finding: values.description,
                    description: values.description,
                    assignedTo: values.assignedTo || undefined,
                    dueDate: values.dueDate || undefined,
                    status: values.status,
                    remediationPlan: values.remediationPlan || undefined,
                  })
                );
                hideBootstrapModal("AddTaskRemediationModal");
                onSuccess?.();
                resetForm();
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              resetForm,
            }) => (
              <>
                <div className="modal-body border-0">
                  <Form id="addTaskForm" onSubmit={handleSubmit} noValidate>
                    <div className="row g-3 justify-content-between align-items-start mb-4">
                      <div className="col-12 col-md-6">
                        <label htmlFor="controlId" className="d-block mb-2">
                          Control ID
                        </label>
                        <FormFieldError name="controlId" errors={errors} touched={touched} />
                        <input
                          className="form-control border-0"
                          type="text"
                          placeholder="Type to search Control ID..."
                          id="controlId"
                          name="controlId"
                          value={values.controlId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          aria-invalid={Boolean(touched.controlId && errors.controlId)}
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <label htmlFor="riskLevel" className="d-block mb-2">
                          Risk Level
                        </label>
                        <FormFieldError name="riskLevel" errors={errors} touched={touched} />
                        <input
                          className="form-control border-0"
                          type="text"
                          id="riskLevel"
                          name="riskLevel"
                          value={values.riskLevel}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          aria-invalid={Boolean(touched.riskLevel && errors.riskLevel)}
                        />
                      </div>
                    </div>

                    <label htmlFor="description" className="d-block mb-2">
                      Finding / Description
                    </label>
                    <FormFieldError name="description" errors={errors} touched={touched} />
                    <input
                      className="form-control border-0 mb-1"
                      type="text"
                      id="description"
                      name="description"
                      placeholder="Brief description of the issue..."
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={Boolean(touched.description && errors.description)}
                    />

                    <div className="row g-3 justify-content-between align-items-center mt-4">
                      <div className="col-12 col-md-6">
                        <label htmlFor="assignedTo" className="d-block mb-2">
                          Assigned To
                        </label>
                      </div>
                      <div className="col-12 col-md-6">
                        <label htmlFor="dueDate" className="d-block mb-2">
                          Due Date
                        </label>
                      </div>
                    </div>

                    <div className="row g-3 justify-content-between align-items-center mb-4">
                      <div className="col-12 col-md-6">
                        <select
                          id="assignedTo"
                          name="assignedTo"
                          className="form-select bg-dark text-white border-0 me-3"
                          value={values.assignedTo}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option value="">-- Select assignee --</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <input
                          className="form-control border-0"
                          type="date"
                          id="dueDate"
                          name="dueDate"
                          value={values.dueDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </div>
                    </div>

                    <label htmlFor="status" className="d-block mb-2">
                      Status
                    </label>
                    <input
                      className="form-control border-0 mb-4"
                      type="text"
                      id="status"
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <label htmlFor="remediationPlan" className="d-block mb-2">
                      Remediation Plan (Optional)
                    </label>
                    <textarea
                      className="form-control mb-4 border-0"
                      id="remediationPlan"
                      name="remediationPlan"
                      placeholder="Steps required to fix this issue..."
                      value={values.remediationPlan}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <div className="upload-box">
                      <label htmlFor="taskUpload" className="upload-label">
                        <Upload size={40} className="mb-3" />
                        <small className="text-secondary">
                          Click to browse or drag & drop (.xlsx, .csv)
                        </small>
                      </label>
                      <input
                        id="taskUpload"
                        name="taskUpload"
                        type="file"
                        className="d-none"
                        onChange={(event) => handleFileChange(event, values.controlId)}
                      />
                    </div>
                  </Form>
                </div>

                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn import-btn border-0 btn-primary"
                    data-bs-dismiss="modal"
                    onClick={() => resetForm()}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="addTaskForm"
                    className="btn add-btn text-white border-0"
                    disabled={submitting}
                  >
                    Add Task
                  </button>
                </div>
              </>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
