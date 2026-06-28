import React, { useEffect } from "react";
import "./AssetInventory.css";
import { useOutletContext } from "react-router-dom";
import assetsInventoryIcon from "../../../assets/SVG (3).png";
import AssetsTabel from "../Components/AssetsTabel/AssetsTabel";
import NetworkAlert from "../Components/Shared/NetworkAlert";
import NetworkLoading from "../Components/Shared/NetworkLoading";
import AssetDetailModal from "../Components/Shared/AssetDetailModal";
import AssetContextModal from "../Components/Shared/AssetContextModal";
import useAssetInventory from "../hooks/useAssetInventory";

export default function AssetInventory() {
  const { setTitle } = useOutletContext();
  const {
    assets,
    loading,
    error,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    reload,
    selectedAsset,
    assetDetails,
    detailsLoading,
    openDetails,
    closeDetails,
    contextIp,
    contextData,
    contextLoading,
    contextError,
    openContext,
    closeContext,
  } = useAssetInventory();

  useEffect(() => {
    setTitle("Asset Inventory");
  }, [setTitle]);

  const categories = ["all", "network", "servers", "iot", "general"];

  return (
    <div className="asset-inventory-page">
      <NetworkAlert error={error} onRetry={reload} />

      <div className="row g-3 align-items-stretch my-3 asset-inventory-toolbar">
  {/* Search */}
  <div className="col-12 col-lg-6">
    <div className="search-container h-100">
      <input
        type="text"
        className="form-control header-search-input assets rounded-3 h-100"
        placeholder="Search IP, MAC, hostname, OS..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  </div>

  {/* Category */}
  <div className="col-12 col-md-6 col-lg-3">
    <select
      className="form-select Allcategories scanType-select border-0 rounded-3 h-100"
      value={categoryFilter}
      onChange={(e) => setCategoryFilter(e.target.value)}
    >
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat === "all"
            ? "All Categories"
            : cat.charAt(0).toUpperCase() + cat.slice(1)}
        </option>
      ))}
    </select>
  </div>

  {/* Refresh */}
  <div className="col-12 col-md-6 col-lg-3">
    <button
      type="button"
      className="btn start-btn border-0 rounded-3 text-white fw-medium d-flex align-items-center justify-content-center w-100 h-100"
      onClick={reload}
    >
      <i className="fa-solid fa-arrow-rotate-right me-2"></i>
      Refresh
    </button>
  </div>
</div>

      <div className="dashboard-card mb-3 asset-inventory-card">
        <div className="row g-2 align-items-center mb-3 asset-inventory-card-header">
          <div className="col-12 d-flex align-items-center flex-wrap gap-2 mb-0">
            <figure className="mb-0 asset-inventory-card-icon">
              <img src={assetsInventoryIcon} className="w-100" alt="inventory" />
            </figure>
            <h6 className="text-white mb-0">Asset Inventory ({assets.length})</h6>
          </div>
        </div>
        <div className="assets-tabel">
          {loading && !assets.length ? (
            <NetworkLoading skeleton rows={6} />
          ) : (
            <AssetsTabel
              assets={assets}
              loading={loading}
              onViewDetails={openDetails}
              onContextLookup={openContext}
            />
          )}
        </div>
      </div>

      {selectedAsset && (
        <AssetDetailModal
          asset={selectedAsset}
          details={assetDetails}
          loading={detailsLoading}
          onClose={closeDetails}
          onContextLookup={openContext}
        />
      )}

      {contextIp && (
        <AssetContextModal
          ip={contextIp}
          context={contextData}
          loading={contextLoading}
          error={contextError}
          onClose={closeContext}
          onRetry={() => openContext(contextIp)}
        />
      )}
    </div>
  );
}
