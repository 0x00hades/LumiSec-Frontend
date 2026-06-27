import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/LumiSecLogoB 1@3x.png";
import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <div className="not-found__grid" aria-hidden="true" />
      <div className="not-found__glow not-found__glow--left" aria-hidden="true" />
      <div className="not-found__glow not-found__glow--right" aria-hidden="true" />

      <main className="not-found__content">
        <img src={logo} alt="LumiSec" className="not-found__logo" />

        <div className="not-found__code-wrap">
          <span className="not-found__code-glow" aria-hidden="true">404</span>
          <h1 className="not-found__code">404</h1>
        </div>

        <h2 className="not-found__title">Page Not Found</h2>
        <p className="not-found__subtitle">
          The page you are looking for does not exist or has been moved.
        </p>

        <button
          type="button"
          className="not-found__button"
          onClick={() => navigate("/")}
        >
          Go Back Home
        </button>
      </main>
    </div>
  );
}
