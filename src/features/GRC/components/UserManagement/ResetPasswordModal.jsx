import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import FormFieldError from "../../../../components/forms/FormFieldError";
import { hideBootstrapModal, validateResetPasswordForm } from "../../utils/userNormalizers";
import "../StandardModal/AddNewStandardModal.css";

export const RESET_PASSWORD_MODAL_ID = "resetPasswordModal";

const INITIAL_VALUES = {
  password: "",
  confirmPassword: "",
};

export default function ResetPasswordModal({ user, onReset, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    const element = document.getElementById(RESET_PASSWORD_MODAL_ID);
    if (element && window.bootstrap?.Modal) {
      window.bootstrap.Modal.getOrCreateInstance(element).show();
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="modal fade" id={RESET_PASSWORD_MODAL_ID} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title text-white">Reset Password</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          <Formik
            initialValues={INITIAL_VALUES}
            validate={validateResetPasswordForm}
            onSubmit={async (values, { resetForm }) => {
              if (!onReset) return;
              setSubmitting(true);
              try {
                await onReset(user.id, values.password);
                resetForm();
                hideBootstrapModal(RESET_PASSWORD_MODAL_ID);
                onSuccess?.();
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
              <>
                <div className="modal-body border-0">
                  <p className="text-secondary small mb-3">
                    Set a new password for <strong className="text-white">{user.name}</strong> (
                    {user.email}).
                  </p>

                  <Form id="resetPasswordForm" onSubmit={handleSubmit} noValidate>
                    <label htmlFor="resetPassword" className="d-block mb-2 text-secondary">
                      New Password
                    </label>
                    <FormFieldError name="password" errors={errors} touched={touched} />
                    <input
                      type="password"
                      id="resetPassword"
                      name="password"
                      className="form-control bg-dark text-white border-0 mb-2"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="new-password"
                    />

                    <label htmlFor="resetConfirmPassword" className="d-block mb-2 text-secondary">
                      Confirm Password
                    </label>
                    <FormFieldError
                      name="confirmPassword"
                      errors={errors}
                      touched={touched}
                    />
                    <input
                      type="password"
                      id="resetConfirmPassword"
                      name="confirmPassword"
                      className="form-control bg-dark text-white border-0 mb-1"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="new-password"
                    />
                  </Form>
                </div>

                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-secondary border-0"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="resetPasswordForm"
                    className="btn add-btn text-white border-0"
                    disabled={submitting}
                  >
                    {submitting ? "Resetting..." : "Reset Password"}
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
