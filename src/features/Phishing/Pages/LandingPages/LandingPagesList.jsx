import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../../../components/toast/ToastContext";
import {
  DEFAULT_ERROR,
  DEFAULT_SUCCESS,
  extractApiMessage,
} from "../../../../components/toast/toastMessages";
import PhishingAlert from "../../Components/Shared/PhishingAlert";
import PhishingLoading from "../../Components/Shared/PhishingLoading";
import RoleGate from "../../Components/Shared/RoleGate";
import { canEditTemplates } from "../../utils/roles";
import useLandingPages from "../../hooks/useLandingPages";
import DeleteLandingPageModal from "./DeleteLandingPageModal";
import "../../Components/Shared/PhishingShared.css";
import "./LandingPagesList.css";

export default function LandingPagesList() {
  const { pages, loading, error, reload, deleteLandingPage } = useLandingPages();
  const toast = useToast();
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const deleteTriggerRef = useRef(null);

  const openDeleteConfirm = (page, event) => {
    deleteTriggerRef.current = event.currentTarget;
    setPendingDelete({ id: page.id, name: page.name });
  };

  const closeDeleteConfirm = () => {
    if (deleting) return;
    setPendingDelete(null);
    requestAnimationFrame(() => {
      deleteTriggerRef.current?.focus();
    });
  };

  const confirmDelete = async () => {
    if (!pendingDelete || deleting) return;

    setDeleting(true);
    try {
      await deleteLandingPage(pendingDelete.id);
      toast.success(
        pendingDelete.name
          ? `"${pendingDelete.name}" was deleted successfully.`
          : DEFAULT_SUCCESS
      );
      setPendingDelete(null);
      reload();
      requestAnimationFrame(() => {
        deleteTriggerRef.current?.focus();
      });
    } catch (err) {
      toast.error(
        extractApiMessage(err.response?.data ?? err, err.message || DEFAULT_ERROR)
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <PhishingLoading message="Loading landing pages..." />;

  return (
    <div className="phishing-soc-page">
      <div className="d-flex justify-content-between mb-3">
        <h5 className="text-white">Landing Pages</h5>
        <RoleGate allow={canEditTemplates}>
          <Link to="/Phishing/LandingPages/new/edit" className="btn add-btn text-white border-0">Create Page</Link>
        </RoleGate>
      </div>
      <PhishingAlert type="danger" message={error} onRetry={reload} />

      <div className="dashboard-card p-0 landing-pages-table">
        <div className="landing-pages-table__scroll">
          <table className="w-100 discover-tabel">
            <thead>
              <tr>
                <th>Name</th>
                <th>Title</th>
                <th>Redirect URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.id}>
                  <td className="text-white">{p.name}</td>
                  <td className="text-secondary">{p.title}</td>
                  <td className="text-secondary">{p.redirectUrl || "—"}</td>
                  <td className="landing-pages-table__actions-cell">
                    <div className="landing-pages-table__actions">
                      <Link
                        to={`/Phishing/LandingPages/${p.id}/edit`}
                        className="btn landing-pages-table__btn landing-pages-table__btn--edit"
                      >
                        <i className="fa-solid fa-pen-to-square" aria-hidden="true" />
                        Edit
                      </Link>
                      <RoleGate allow={canEditTemplates}>
                        <button
                          type="button"
                          className="btn landing-pages-table__btn landing-pages-table__btn--delete"
                          onClick={(event) => openDeleteConfirm(p, event)}
                        >
                          <i className="fa-solid fa-trash-can" aria-hidden="true" />
                          Delete
                        </button>
                      </RoleGate>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pendingDelete && (
        <DeleteLandingPageModal
          pageName={pendingDelete.name}
          deleting={deleting}
          onCancel={closeDeleteConfirm}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
