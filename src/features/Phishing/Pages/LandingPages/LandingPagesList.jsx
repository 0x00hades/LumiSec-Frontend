import React from "react";
import { Link } from "react-router-dom";
import PhishingAlert from "../../Components/Shared/PhishingAlert";
import PhishingLoading from "../../Components/Shared/PhishingLoading";
import RoleGate from "../../Components/Shared/RoleGate";
import { canEditTemplates } from "../../utils/roles";
import useLandingPages from "../../hooks/useLandingPages";
import "../../Components/Shared/PhishingShared.css";

export default function LandingPagesList() {
  const { pages, loading, error, isMock, reload, deleteLandingPage } = useLandingPages();

  const handleDelete = async (id) => {
    if (!window.confirm("Delete landing page?")) return;
    await deleteLandingPage(id);
    reload();
  };

  if (loading) return <PhishingLoading message="Loading landing pages..." />;

  return (
    <div className="phishing-soc-page">
      <div className="row justify-content-between align-items-center mb-3">
        <div className="col col-lg-10">
          <h5 className="text-white">Landing Pages</h5>
        </div>
        <RoleGate allow={canEditTemplates}>
            <Link to="/Phishing/LandingPages/new/edit" className="btn me-3 col add-btn text-white border-0">Create Page</Link>
        </RoleGate>
      </div>
      <PhishingAlert type="danger" message={error} isMock={isMock} onRetry={reload} />

      <div className="w-100 discover-tabel overflow-hidden">
        <table className="w-100 discover-tabel overflow-hidden">
          <thead>
            <tr>
              <th>Name</th>
              <th>URL</th>
              <th>Category</th>
              <th>Actions</th>
              </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr key={p.id}>
                <td className="text-white p-2">{p.name}</td>
                <td className="text-secondary">{p.url}</td>
                <td className="text-secondary">{p.category}</td>
                <td>
                  <div className="d-flex flex-column flex-md-row">
                    <Link to={`/Phishing/LandingPages/${p.id}/edit`} className="btn btn-sm import-btn my-2 text-white me-1">Edit</Link>
                    <RoleGate allow={canEditTemplates}>
                      <button type="button" className="btn btn-sm import-btn my-2  text-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                    </RoleGate>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
