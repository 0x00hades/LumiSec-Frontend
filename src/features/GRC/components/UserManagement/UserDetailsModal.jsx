import React, { useEffect } from "react";
import { getUserDetailFields, showBootstrapModal } from "../../utils/userNormalizers";
import "../StandardModal/AddNewStandardModal.css";

export const USER_DETAILS_MODAL_ID = "userDetailsModal";

export default function UserDetailsModal({ user, onEdit, onClose }) {
  useEffect(() => {
    if (!user) return;
    showBootstrapModal(USER_DETAILS_MODAL_ID);
  }, [user]);

  if (!user) return null;

  return (
    <div className="modal fade" id={USER_DETAILS_MODAL_ID} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title text-white">User Details</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            />
          </div>

          <div className="modal-body border-0">
            <dl className="user-management__details mb-0">
              {getUserDetailFields(user).map(({ label, value }) => (
                <div key={label} className="user-management__detail-row">
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="modal-footer border-0">
            <button
              type="button"
              className="btn btn-secondary border-0"
              data-bs-dismiss="modal"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn add-btn text-white border-0"
              data-bs-dismiss="modal"
              onClick={() => onEdit?.(user)}
            >
              Edit User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
