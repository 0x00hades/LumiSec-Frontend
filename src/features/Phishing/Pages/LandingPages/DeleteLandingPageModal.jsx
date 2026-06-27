import React, { useCallback, useEffect, useRef } from "react";
import "./DeleteLandingPageModal.css";

export default function DeleteLandingPageModal({
  pageName,
  deleting = false,
  onCancel,
  onConfirm,
}) {
  const modalRef = useRef(null);
  const cancelRef = useRef(null);

  const handleDismiss = useCallback(() => {
    if (deleting) return;
    onCancel();
  }, [deleting, onCancel]);

  const handleBackdropClick = useCallback(
    (event) => {
      if (event.target === event.currentTarget) {
        handleDismiss();
      }
    },
    [handleDismiss]
  );

  useEffect(() => {
    cancelRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      const modals = document.querySelectorAll(".landing-page-delete-modal.show");
      const topModal = modals[modals.length - 1];
      if (topModal && modalRef.current === topModal) {
        handleDismiss();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleDismiss]);

  const message = pageName ? (
    <>
      Are you sure you want to permanently delete <strong>&quot;{pageName}&quot;</strong>?
    </>
  ) : (
    <>Are you sure you want to delete this landing page?</>
  );

  return (
    <>
      <div
        ref={modalRef}
        className="modal fade show landing-page-delete-modal d-block"
        tabIndex={-1}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-landing-page-title"
        aria-describedby="delete-landing-page-desc"
        onClick={handleBackdropClick}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="landing-page-delete-modal__icon-wrap" aria-hidden="true">
                <i className="fa-solid fa-trash-can" />
              </div>
              <div className="landing-page-delete-modal__header-text">
                <h5 className="modal-title" id="delete-landing-page-title">
                  Delete Landing Page
                </h5>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={handleDismiss}
                disabled={deleting}
                aria-label="Close"
              />
            </div>
            <div className="modal-body" id="delete-landing-page-desc">
              <p className="landing-page-delete-modal__message">{message}</p>
              <p className="landing-page-delete-modal__warning">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button
                ref={cancelRef}
                type="button"
                className="btn landing-page-delete-modal__btn-cancel"
                onClick={handleDismiss}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn landing-page-delete-modal__btn-delete"
                onClick={onConfirm}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-trash-can" aria-hidden="true" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal-backdrop fade show"
        onClick={deleting ? undefined : handleDismiss}
        aria-hidden="true"
      />
    </>
  );
}
