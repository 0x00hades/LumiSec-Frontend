import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Cloud,
  Database,
  Lock,
  Mail,
  Network,
  ShieldCheck,
  Wifi,
  Zap,
} from "lucide-react";
import useScrollReveal from "../../hooks/useScrollReveal";
import logoCybercrew from "../../assets/Screenshot_2025-09-25_184259-removebg-preview 1.png";
import logoMicrosoft from "../../assets/Microsoft.png";
import logoLinkedIn from "../../assets/linkedin-icon-2.svg fill.png";
import logoGoogle from "../../assets/Google.png";
import logoGitHub from "../../assets/Github.png";
import logoCisco from "../../assets/Cisco.png";
import logoAws from "../../assets/AWS.png";
import logoHti from "../../assets/HTI logo.png";

const metrics = [
  { value: "6", label: "Security modules" },
  { value: "112", label: "Incidents resolved" },
  { value: "24/7", label: "Live visibility" },
];

const features = [
  {
    icon: Zap,
    title: "SOAR Response",
    to: "/SOAR",
    accent: "cyan",
    description:
      "Triage incidents, coordinate playbooks, and move response actions faster.",
  },
  {
    icon: Network,
    title: "Network Security",
    to: "/Network",
    accent: "blue",
    description:
      "Discover assets, scan ports, inspect packets, and monitor network exposure.",
  },
  {
    icon: BarChart3,
    title: "GRC Tracking",
    to: "/GRC",
    accent: "purple",
    description:
      "Track controls, remediation tasks, findings, and compliance workflows.",
  },
  {
    icon: Mail,
    title: "Phishing Simulation",
    to: "/Phishing",
    accent: "violet",
    description:
      "Run campaigns, measure risk, and improve awareness across your organization.",
  },
];

const integrations = [
  { icon: Database, label: "SIEM" },
  { icon: Cloud, label: "Cloud" },
  { icon: Wifi, label: "Threat feeds" },
  { icon: Lock, label: "Zero trust" },
];

const trustedLogos = [
  { name: "CyberCrew ", label: "CyberCrew ", src: logoCybercrew, alt: "CyberCrew ", emblem: true },
  { name: "Microsoft", label: "Microsoft", src: logoMicrosoft, alt: "Microsoft" },
  { name: "LinkedIn", label: "LinkedIn", src: logoLinkedIn, alt: "LinkedIn" },
  { name: "Google", label: "Google", src: logoGoogle, alt: "Google" },
  { name: "GitHub", label: "GitHub", src: logoGitHub, alt: "GitHub" },
  { name: "Cisco", label: "Cisco", src: logoCisco, alt: "Cisco" },
  { name: "AWS", label: "AWS", src: logoAws, alt: "Amazon Web Services" },
  { name: "HTI", label: "HTI", src: logoHti, alt: "Higher Technological Institute", emblem: true },
];

export default function WelcomeDashboard() {
  const { ref: trustedRef, isVisible: trustedVisible } = useScrollReveal();
  return (
    <div className="welcome-dashboard p-0">
      <header className="welcome-hero welcome-animate py-5">
        <p className="welcome-eyebrow">Cyber defense workspace</p>
        <h1 className="welcome-hero__title">
          Welcome to the
          <span className="welcome-hero__gradient">LumiSec Command Center</span>
        </h1>
        <p className="welcome-hero__lead">
          Operate phishing, network, GRC, SOAR, and SIEM workflows from one unified workspace.
        </p>
        <p className="welcome-hero__copy">
          LumiSec connects detection, investigation, and remediation across the full{" "}
          <strong>cybersecurity lifecycle</strong>.
        </p>
        <div className="welcome-hero__actions">
          <Link className="welcome-btn welcome-btn--primary" to="/SOAR">
            Open SOAR
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link className="welcome-btn welcome-btn--ghost" to="/GRC">
            Open GRC
          </Link>
        </div>
      </header>

      <section className="welcome-metrics welcome-animate welcome-animate--delay-1" aria-label="Platform metrics">
        <div className="welcome-section-head">
          <h2 className="welcome-section-head__title">At a glance</h2>
          <p className="welcome-section-head__desc">Your security posture in real time</p>
        </div>
        <div className="welcome-metrics__grid">
          {metrics.map((metric) => (
            <article className="welcome-card welcome-metric" key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="welcome-modules welcome-animate welcome-animate--delay-2" aria-label="Platform modules">
        <div className="welcome-section-head">
          <h2 className="welcome-section-head__title">Jump into a module</h2>
          <p className="welcome-section-head__desc">Pick up where your team left off</p>
        </div>
        <div className="welcome-modules__grid">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                className={`welcome-card welcome-module welcome-module--${feature.accent}`}
                to={feature.to}
                key={feature.title}
              >
                <div className="icon-title icon-title--block welcome-module__head">
                  <span className="welcome-module__icon icon-title__icon" aria-hidden="true">
                    <Icon size={22} />
                  </span>
                  <h3>{feature.title}</h3>
                </div>
                <p>{feature.description}</p>
                <span className="welcome-module__cta">
                  Open module
                  <ArrowRight size={16} aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>


      <section className="welcome-integrations welcome-animate welcome-animate--delay-3" aria-label="Integrations">
        <div className="welcome-section-head">
          <h2 className="welcome-section-head__title">Integrations</h2>
          <p className="welcome-section-head__desc">Connect your existing security stack</p>
        </div>
        <div className="welcome-integrations__grid">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            return (
              <article className="welcome-card welcome-integration" key={integration.label}>
                <div className="icon-title icon-title--block">
                  <span className="welcome-integration__icon icon-title__icon" aria-hidden="true">
                    <Icon size={20} />
                  </span>
                  <span>{integration.label}</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section
        ref={trustedRef}
        className={`welcome-trusted scroll-reveal${trustedVisible ? " is-visible" : ""}`}
        aria-labelledby="welcome-trusted-heading"
      >
        <div className="welcome-trusted__badge">
          <ShieldCheck size={14} aria-hidden="true" />
          <span>Trusted worldwide</span>
        </div>

        <h2 id="welcome-trusted-heading" className="welcome-trusted__title">
        Integrated with{" "}
          <span className="welcome-trusted__title-accent">
            <span className="welcome-trusted__title-underline">global</span> leaders
          </span>
        </h2>

        <p className="welcome-trusted__lead">
          LumiSec is relied upon by innovative organizations around the world to strengthen
          their security and protect what matters most.
        </p>

        <div className="welcome-trusted__scroll">
          <ul className="welcome-trusted__grid">
            {trustedLogos.map((partner) => (
              <li className="welcome-trusted__item scroll-reveal__item" key={partner.name}>
                <article className="welcome-trusted__card">
                  <div
                    className={`welcome-trusted__logo${partner.emblem ? " welcome-trusted__logo--emblem" : ""}`}
                  >
                    <img src={partner.src} alt={partner.alt} loading="lazy" decoding="async" />
                  </div>
                  <span className="welcome-trusted__label">{partner.label}</span>
                </article>
              </li>
            ))}
          </ul>
        </div>

        <div className="welcome-trusted__footer" aria-hidden="true">
          <span className="welcome-trusted__footer-line" />
          <span className="welcome-trusted__footer-icon">
            <ShieldCheck size={18} />
          </span>
          <span className="welcome-trusted__footer-line" />
        </div>
      </section>


    </div>
  );
}
