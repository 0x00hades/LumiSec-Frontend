import React, { useState } from "react";
import { Formik, Form } from "formik";
import "./AddNewStandardModal.css";
import { Upload } from "lucide-react";
import { toControlPayload } from "../../utils/normalizers";
import FormFieldError from "../../../../components/forms/FormFieldError";
import { hideBootstrapModal } from "../../../../utils/bootstrapModal";

export default function AddStandardModal({ onCreate, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="modal fade" id="addStandardModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title text-white">Add New Standard</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          <Formik
            initialValues={{ framework: "" }}
            validate={(values) => {
              const errors = {};
              if (!values.framework) {
                errors.framework = "Please select a framework";
              }
              return errors;
            }}
            onSubmit={async (values, { resetForm }) => {
              if (!onCreate) return;
              setSubmitting(true);
              try {
                await onCreate(toControlPayload({ framework: values.framework }));
                hideBootstrapModal("addStandardModal");
                onSuccess?.();
                resetForm();
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
              <>
                <div className="modal-body border-0">
                  <Form id="addStandardForm" onSubmit={handleSubmit} noValidate>
                    <label htmlFor="framework" className="d-block mb-2">
                      Select from Library
                    </label>
                    <FormFieldError name="framework" errors={errors} touched={touched} />
                    <select
                      id="framework"
                      name="framework"
                      className="form-control form-select bg-dark text-white mb-1 border-0"
                      value={values.framework}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={Boolean(touched.framework && errors.framework)}
                    >
                      <option value="">-- Choose a framework --</option>
                      <option value="ISO27001">ISO 27001:2022</option>
                      <option value="PCI_DSS">PCI-DSS v4.0</option>
                      <option value="SOC2">SOC 2</option>
                      <option value="NIST">NIST CSF 1.1</option>
                    </select>

                    <p className="text-secondary text-center position-relative sepration-text">OR</p>

                    <label htmlFor="standardUpload" className="mb-3">
                      Upload Custom Framework
                    </label>
                    <div className="upload-box">
                      <label htmlFor="standardUpload" className="upload-label">
                        <Upload size={40} className="mb-3" />
                        <small className="text-secondary">
                          Click to browse or drag & drop (.xlsx, .csv)
                        </small>
                      </label>
                      <input id="standardUpload" name="standardUpload" type="file" className="d-none" />
                    </div>
                  </Form>
                </div>

                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn import-btn border-0 btn-primary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="addStandardForm"
                    className="btn add-btn text-white border-0"
                    disabled={submitting || !values.framework}
                  >
                    Add Standard
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
