import React, { useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/LumiSecLogoB 1.png";
import profile from "../../../assets/prrofile.png";
import "./Phishing.css";
import {
  LayoutGrid,
  Mail,
  FileText,
  Globe,
  Users,
  Activity,
  BarChart3,
  Settings,
  Menu,
  Shield,
  ClipboardClock,
  Radio,
} from "lucide-react";
import { getPhishingRole, ROLES, setPhishingRole } from "../utils/roles";

export default function Phishing() {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const role = getPhishingRole();

  return (
    <>
      <header className="topbar">
        <div className="left-section">
          <button className="btn text-white border-0 p-0 d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#mobileSidebar">
            <Menu size={28} />
          </button>
          <button className="btn text-white border-0 p-0 d-none d-lg-block" onClick={() => setCollapsed(!collapsed)}>
            <Menu size={28} />
          </button>
          <div className="d-flex justify-content-between align-items-center">
            <Link to="/Phishing" className="text-decoration-none">
            <figure className="w-75 m-0">
              <img className="w-100" src={logo} alt="logo" />
            </figure>
              {/* <h1 className="logo m-0">LumiSec</h1> */}
            </Link>
            <span className="role-badge mt-3 mb-1 ms-2 py-2 d-none d-md-inline ">{role.replace("_", " ")}</span>
          </div>
        </div>

        <div className="right-section">
          {/* <select
            className="form-select scanType-select border-0 me-2 d-none d-md-block"
            style={{ width: 160 }}
            value={role}
            onChange={(e) => setPhishingRole(e.target.value)}
            title="Dev role switcher"
          >
            <option value={ROLES.MANAGER}>phishing_manager</option>
            <option value={ROLES.OPERATOR}>phishing_operator</option>
            <option value={ROLES.INTEGRATION}>integration_admin</option>
          </select>
          <button type="button" className="btn add-btn text-white border-0" onClick={() => navigate("/Phishing/Campaigns/create")}>
            <i className="fa-solid fa-plus me-2" />
            New Campaign
          </button> */}
          <Link to={""}>
            <i className="fa-regular fa-bell notification-icon fs-5" />
          </Link>
          <figure className="profile-figure mb-0">
            <img src={profile} alt="profile" />
          </figure>
        </div>
      </header>

      <div className="main-layout">
        <aside className="d-none d-lg-block">
          <div className={collapsed ? "sidebar phishing collapsed" : "sidebar phishing"}>
            <SidebarLinks collapsed={collapsed} />
          </div>
        </aside>
        <main className="content">
          <Outlet />
        </main>
      </div>

      <div className="offcanvas offcanvas-start sidebar-offcanvas d-lg-none" tabIndex="-1" id="mobileSidebar">
        <div className="offcanvas-body">
          <SidebarLinks collapsed={false} />
        </div>
      </div>
    </>
  );
}

function SidebarLinks({ collapsed }) {
  return (
    <nav className="d-flex flex-column gap-2">
      <NavItem to="/Phishing" icon={<LayoutGrid size={22} />} text="Overview" collapsed={collapsed} end />
      <NavItem to="/Phishing/Dashboard/Risks" icon={<Shield size={22} />} text="Risks" collapsed={collapsed} />
      <NavItem to="/Phishing/Dashboard/Departments" icon={<BarChart3 size={22} />} text="Departments" collapsed={collapsed} />
      <NavItem to="/Phishing/Dashboard/Trends" icon={<Activity size={22} />} text="Trends" collapsed={collapsed} />
      <NavItem to="/Phishing/Campaigns" icon={<Mail size={22} />} text="Campaigns" collapsed={collapsed} />
      <NavItem to="/Phishing/Templates" icon={<FileText size={22} />} text="Templates" collapsed={collapsed} />
      <NavItem to="/Phishing/LandingPages" icon={<Globe size={22} />} text="Landing Pages" collapsed={collapsed} />
      <NavItem to="/Phishing/Recipients" icon={<Users size={22} />} text="Recipients" collapsed={collapsed} />
      <NavItem to="/Phishing/Tracking/Timeline" icon={<Radio size={22} />} text="Live Timeline" collapsed={collapsed} />
      <NavItem to="/Phishing/Tracking/Logs" icon={<Activity size={22} />} text="Tracking Logs" collapsed={collapsed} />
      <NavItem to="/Phishing/Reports" icon={<BarChart3 size={22} />} text="Reports" collapsed={collapsed} />
      <NavItem to="/Phishing/Settings" icon={<Settings size={22} />} text="Settings" collapsed={collapsed} />
    </nav>
  );
}

function NavItem({ to, icon, text, collapsed, end }) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}>
      <span className="icon">{icon}</span>
      {!collapsed && <span className="text">{text}</span>}
    </NavLink>
  );
}
