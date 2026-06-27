import React from "react";
import { Outlet } from "react-router-dom";
import "./WelcomePage.css";

export default function WelcomePage() {
  return (
    <div className="welcome-page">
      <Outlet />
    </div>
  );
}
