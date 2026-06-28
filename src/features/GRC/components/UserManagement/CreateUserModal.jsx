import React, { useState } from "react";
import { Formik, Form } from "formik";
import { BACKEND_ROLES } from "../../../../constants/backendRoles";
import FormFieldError from "../../../../components/forms/FormFieldError";
import { hideBootstrapModal, validateSignupForm } from "../../utils/userNormalizers";
import "../StandardModal/AddNewStandardModal.css";

export const CREATE_USER_MODAL_ID = "createUserModal";

const INITIAL_VALUES = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
  department: "",
};

export default function CreateUserModal({ onCreate, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="modal fade" id={CREATE_USER_MODAL_ID} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog CreateUserModal modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title text-white">Create User</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          <Formik
            initialValues={INITIAL_VALUES}
            validate={validateSignupForm}
            onSubmit={async (values, { resetForm }) => {
              if (!onCreate) return;
              setSubmitting(true);
              try {
                await onCreate(values);
                resetForm();
                hideBootstrapModal(CREATE_USER_MODAL_ID);
                onSuccess?.();
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
              <>
                <div className="modal-body border-0">
                  <Form id="createUserForm" onSubmit={handleSubmit} noValidate>
                    <label htmlFor="createUserName" className="d-block mb-2 text-secondary">
                      Full Name
                    </label>
                    <FormFieldError name="name" errors={errors} touched={touched} />
                    <input
                      type="text"
                      id="createUserName"
                      name="name"
                      className="form-control bg-dark text-white border-0 mb-2"
                      placeholder="Enter full name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <label htmlFor="createUserEmail" className="d-block mb-2 text-secondary">
                      Email Address
                    </label>
                    <FormFieldError name="email" errors={errors} touched={touched} />
                    <input
                      type="email"
                      id="createUserEmail"
                      name="email"
                      className="form-control bg-dark text-white border-0 mb-2"
                      placeholder="Enter email address"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <label htmlFor="createUserRole" className="d-block mb-2 text-secondary">
                      Role
                    </label>
                    <FormFieldError name="role" errors={errors} touched={touched} />
                    <select
                      id="createUserRole"
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

                    <label htmlFor="createUserDepartment" className="d-block mb-2 text-secondary">
                      Department <span className="text-secondary">(optional)</span>
                    </label>
                    <input
                      type="text"
                      id="createUserDepartment"
                      name="department"
                      className="form-control bg-dark text-white border-0 mb-2"
                      placeholder="Enter department"
                      value={values.department}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <hr className="my-3" />

                    <label htmlFor="createUserPassword" className="d-block mb-2 text-secondary">
                      Password
                    </label>
                    <FormFieldError name="password" errors={errors} touched={touched} />
                    <input
                      type="password"
                      id="createUserPassword"
                      name="password"
                      className="form-control bg-dark text-white border-0 mb-2"
                      placeholder="Enter password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="new-password"
                    />

                    <label htmlFor="createUserConfirmPassword" className="d-block mb-2 text-secondary">
                      Confirm Password
                    </label>
                    <FormFieldError name="confirmPassword" errors={errors} touched={touched} />
                    <input
                      type="password"
                      id="createUserConfirmPassword"
                      name="confirmPassword"
                      className="form-control bg-dark text-white border-0 mb-1"
                      placeholder="Confirm password"
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
                    form="createUserForm"
                    className="btn add-btn text-white border-0"
                    disabled={submitting}
                  >
                    {submitting ? "Creating..." : "Create User"}
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
