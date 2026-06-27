import React, { useMemo, useState } from "react";
import "./HostTabel.css";
import NetworkLoading from "../Shared/NetworkLoading";
import { resolveDisplayText } from "../../utils/normalizers";

const COLUMNS = [
  { key: "hostname", label: "Hostname", sortable: true },
  { key: "ip", label: "IP Address", sortable: true },
  { key: "mac", label: "MAC Address", sortable: true },
  { key: "osGuess", label: "Operating System", sortable: true },
  { key: "vendor", label: "Vendor", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "riskLevel", label: "Risk Level", sortable: true },
  { key: "openPorts", label: "Open Ports", sortable: true },
  { key: "lastSeen", label: "Last Seen", sortable: true },
  { key: "discoverySource", label: "Discovery Source", sortable: true },
];

function formatLastSeen(value) {
  if (value == null || value === "") return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function resolveOpenPorts(host) {
  const count = Number(host.openPorts);
  if (count > 0) return count;
  if (Array.isArray(host.services) && host.services.length > 0) {
    return host.services.length;
  }
  return null;
}

function resolveDiscoverySource(host) {
  const raw = host.raw ?? {};
  return (
    raw.discoverySource ??
    raw.discovery_source ??
    raw.source ??
    raw.scanSource ??
    raw.discoveredBy ??
    host.category ??
    null
  );
}

function riskBadgeClass(level) {
  if (level === "critical") return "hosts-tabel__badge--critical";
  if (level === "high") return "hosts-tabel__badge--high";
  if (level === "medium") return "hosts-tabel__badge--medium";
  if (level === "low") return "hosts-tabel__badge--low";
  return "hosts-tabel__badge--neutral";
}

function statusBadgeClass(status) {
  const value = String(status ?? "").toLowerCase();
  if (["active", "online", "up", "reachable", "alive"].includes(value)) {
    return "hosts-tabel__badge--active";
  }
  if (["offline", "down", "inactive", "unreachable"].includes(value)) {
    return "hosts-tabel__badge--inactive";
  }
  if (["unknown", "pending", "scanning"].includes(value)) {
    return "hosts-tabel__badge--unknown";
  }
  return "hosts-tabel__badge--neutral";
}

function getSortValue(host, key) {
  switch (key) {
    case "hostname":
      return resolveDisplayText(host.hostname, "").toLowerCase();
    case "ip":
      return resolveDisplayText(host.ip, "").toLowerCase();
    case "mac":
      return resolveDisplayText(host.mac, "").toLowerCase();
    case "osGuess":
      return resolveDisplayText(host.osGuess, "").toLowerCase();
    case "vendor":
      return resolveDisplayText(host.vendor, "").toLowerCase();
    case "status":
      return resolveDisplayText(host.status, "").toLowerCase();
    case "riskLevel":
      return resolveDisplayText(host.riskLevel, "").toLowerCase();
    case "openPorts": {
      const ports = resolveOpenPorts(host);
      return ports == null ? -1 : ports;
    }
    case "lastSeen": {
      const ts = host.lastSeen ? new Date(host.lastSeen).getTime() : 0;
      return Number.isNaN(ts) ? 0 : ts;
    }
    case "discoverySource":
      return resolveDisplayText(resolveDiscoverySource(host), "").toLowerCase();
    default:
      return "";
  }
}

function compareValues(a, b) {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

function TruncatedCell({ value, className = "" }) {
  const text = resolveDisplayText(value);
  return (
    <span className={`hosts-tabel__truncate ${className}`} title={text}>
      {text}
    </span>
  );
}

function SortableHeader({ column, sortKey, sortDir, onSort }) {
  const isActive = sortKey === column.key;
  const ariaSort = isActive ? (sortDir === "asc" ? "ascending" : "descending") : "none";

  return (
    <th scope="col" aria-sort={ariaSort}>
      <button
        type="button"
        className={`hosts-tabel__sort-btn${isActive ? " hosts-tabel__sort-btn--active" : ""}`}
        onClick={() => onSort(column.key)}
      >
        {column.label}
        <i
          className={`fa-solid hosts-tabel__sort-icon ${
            isActive
              ? sortDir === "asc"
                ? "fa-arrow-up"
                : "fa-arrow-down"
              : "fa-arrows-up-down"
          }`}
          aria-hidden="true"
        />
      </button>
    </th>
  );
}

export default function HostsTabel({ hosts = [], loading = false }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir("asc");
  };

  const sortedHosts = useMemo(() => {
    if (!sortKey) return hosts;
    return [...hosts].sort((a, b) => {
      const result = compareValues(getSortValue(a, sortKey), getSortValue(b, sortKey));
      return sortDir === "asc" ? result : -result;
    });
  }, [hosts, sortKey, sortDir]);

  if (loading) return <NetworkLoading skeleton rows={5} />;

  if (!hosts.length) {
    return (
      <div className="hosts-tabel__empty" role="status">
        <i className="fa-solid fa-network-wired hosts-tabel__empty-icon" aria-hidden="true" />
        <p className="hosts-tabel__empty-title">No hosts discovered yet</p>
        <p className="hosts-tabel__empty-text">Run a network scan to populate this table.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive-wrapper hosts-tabel">
      <table className="w-100 discover-tabel">
        <thead>
          <tr>
            {COLUMNS.map((column) => (
              <SortableHeader
                key={column.key}
                column={column}
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedHosts.map((host) => {
            const openPorts = resolveOpenPorts(host);
            const lastSeen = formatLastSeen(host.lastSeen);
            const discoverySource = resolveDiscoverySource(host);

            return (
              <tr key={host.id ?? `${host.ip}-${host.mac}`}>
                <td>
                  <TruncatedCell value={host.hostname} className="hosts-tabel__cell-primary" />
                </td>
                <td>
                  <TruncatedCell value={host.ip} className="hosts-tabel__cell-ip" />
                </td>
                <td>
                  <TruncatedCell value={host.mac} className="hosts-tabel__cell-muted" />
                </td>
                <td>
                  <TruncatedCell value={host.osGuess} />
                </td>
                <td>
                  <TruncatedCell value={host.vendor} className="hosts-tabel__cell-muted" />
                </td>
                <td>
                  <span
                    className={`hosts-tabel__badge ${statusBadgeClass(host.status)}`}
                    title={resolveDisplayText(host.status)}
                  >
                    {resolveDisplayText(host.status)}
                  </span>
                </td>
                <td>
                  <span
                    className={`hosts-tabel__badge ${riskBadgeClass(host.riskLevel)}`}
                    title={resolveDisplayText(host.riskLevel)}
                  >
                    {resolveDisplayText(host.riskLevel)}
                  </span>
                </td>
                <td className="hosts-tabel__cell-numeric">
                  {openPorts == null ? "—" : openPorts}
                </td>
                <td>
                  <span className="hosts-tabel__cell-muted hosts-tabel__truncate" title={lastSeen}>
                    {lastSeen}
                  </span>
                </td>
                <td>
                  <TruncatedCell value={discoverySource} className="hosts-tabel__cell-muted" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
