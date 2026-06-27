import React from "react";
import { Outlet } from "react-router-dom";
import "./WelcomePage.css";

export default function WelcomePage() {
  return (
    <div className="welcome-page">
      <div className="welcome-page__mesh" aria-hidden="true" />
      <div className="welcome-page__grid" aria-hidden="true" />
      <div className="welcome-page__orb welcome-page__orb--1" aria-hidden="true" />
      <div className="welcome-page__orb welcome-page__orb--2" aria-hidden="true" />
      <Outlet />
    </div>
  );
}
