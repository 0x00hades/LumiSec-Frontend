import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { BACKEND_ROLES } from "../../../../constants/backendRoles";
import FormFieldError from "../../../../components/forms/FormFieldError";
import {
  hideBootstrapModal,
  showBootstrapModal,
  userToEditValues,
  validateUpdateForm,
} from "../../utils/userNormalizers";
import "../StandardModal/AddNewStandardModal.css";

export const EDIT_USER_MODAL_ID = "editUserModal";

export default function EditUserModal({ user, onSave, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    showBootstrapModal(EDIT_USER_MODAL_ID);
  }, [user]);

  if (!user) return null;

  return (
    <div className="modal fade" id={EDIT_USER_MODAL_ID} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title text-white">Edit User</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          <Formik
            enableReinitialize
            initialValues={userToEditValues(user)}
            validate={validateUpdateForm}
            onSubmit={async (values) => {
              if (!onSave) return;
              setSubmitting(true);
              try {
                await onSave(user.id, values);
                hideBootstrapModal(EDIT_USER_MODAL_ID);
                onSuccess?.();
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
              <>
                <div className="modal-body border-0">
                  <Form id="editUserForm" onSubmit={handleSubmit} noValidate>
                    <label htmlFor="editUserName" className="d-block mb-2 text-secondary">
                      Full Name
                    </label>
                    <FormFieldError name="name" errors={errors} touched={touched} />
                    <input
                      type="text"
                      id="editUserName"
                      name="name"
                      className="form-control bg-dark text-white border-0 mb-2"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <label htmlFor="editUserEmail" className="d-block mb-2 text-secondary">
                      Email Address
                    </label>
                    <FormFieldError name="email" errors={errors} touched={touched} />
                    <input
                      type="email"
                      id="editUserEmail"
                      name="email"
                      className="form-control bg-dark text-white border-0 mb-2"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <label htmlFor="editUserRole" className="d-block mb-2 text-secondary">
                      Role
                    </label>
                    <FormFieldError name="role" errors={errors} touched={touched} />
                    <select
                      id="editUserRole"
                      name="role"
                      className="form-control form-select bg-dark text-white border-0 mb-2"
                      value={values.role}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Select role</option>
                      {BACKEND_ROLES.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>

                    <label htmlFor="editUserDepartment" className="d-block mb-2 text-secondary">
                      Department <span className="text-secondary">(optional)</span>
                    </label>
                    <input
                      type="text"
                      id="editUserDepartment"
                      name="department"
                      className="form-control bg-dark text-white border-0 mb-1"
                      value={values.department}
                      onChange={handleChange}
                      onBlur={handleBlur}
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
                    form="editUserForm"
                    className="btn add-btn text-white border-0"
                    disabled={submitting}
                  >
                    {submitting ? "Saving..." : "Save Changes"}
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
