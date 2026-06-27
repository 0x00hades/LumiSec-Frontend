import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Crosshair,
  Mail,
  MapPin,
  Network,
  Phone,
  Radar,
  ShieldCheck,
  Zap,
} from "lucide-react";
import logo from "../../assets/LumiSecLogoB 1@3x.png";
import logoCybercrew from "../../assets/Screenshot_2025-09-25_184259-removebg-preview 1.png";
import logoMicrosoft from "../../assets/Microsoft.png";
import logoLinkedIn from "../../assets/linkedin-icon-2.svg fill.png";
import logoGoogle from "../../assets/Google.png";
import logoGitHub from "../../assets/Github.png";
import logoCisco from "../../assets/Cisco.png";
import logoAws from "../../assets/AWS.png";
import logoHti from "../../assets/HTI logo.png";
import networkImage from "../../assets/network image.png";
import phishingImage from "../../assets/phishing image.png";
import grcImage from "../../assets/Grc image.png";
import soarImage from "../../assets/soar image.png";
import siemImage from "../../assets/SIEM Integration.png";
import threatImage from "../../assets/Threat Intelligence image.png";
import "./LandingPage.css";
import useScrollReveal from "../../hooks/useScrollReveal";

const tools = [
  {
    title: "Network Security Scanner",
    description: "Discover assets, scan ports, inspect traffic, and surface misconfigurations.",
    points: ["Network discovery", "Port scanning"],
    image: networkImage,
    icon: Network,
  },
  {
    title: "Phishing Simulation",
    description: "Run phishing campaigns, track user behavior, and report training risk.",
    points: ["Campaigns", "Reports"],
    image: phishingImage,
    icon: Mail,
  },
  {
    title: "GRC",
    description: "Manage controls, audits, standards, and remediation tasks in one place.",
    points: ["Audits", "Compliance"],
    image: grcImage,
    icon: ShieldCheck,
  },
  {
    title: "SOAR",
    description: "Triage incidents, connect alerts, and coordinate response playbooks.",
    points: ["Incident queue", "Playbooks"],
    image: soarImage,
    icon: Zap,
  },
  {
    title: "SIEM Integration",
    description: "Connect external SIEM solutions and route alerts into response workflows.",
    points: ["Connectors", "Alert intake"],
    image: siemImage,
    icon: Radar,
  },
  {
    title: "Threat Intelligence",
    description: "Monitor security signals and enrich findings across platform modules.",
    points: ["Monitoring", "Enrichment"],
    image: threatImage,
    icon: Crosshair,
  },
];

const heroMetrics = [
  { value: "6", label: "Security modules" },
  { value: "24/7", label: "Live visibility" },
  { value: "1", label: "Unified workspace" },
];

const heroTitle = "Control Your Cyber Risk From One Live Workspace";
const heroHighlight = "Live Workspace";

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

const plans = [
  {
    name: "Starter",
    price: "$120/month",
    features: ["Network scanner", "Basic phishing reports", "GRC task tracking"],
  },
  {
    name: "Professional",
    price: "$399/month",
    featured: true,
    features: ["All core tools", "SOAR incident workflows", "SIEM integration"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Advanced automation", "Dedicated security workflows", "Compliance reporting"],
  },
];

const NAV_LINKS = [
  { href: "#home", label: "Home", id: "home" },
  { href: "#tools", label: "Tools", id: "tools" },
  { href: "#about", label: "About", id: "about" },
  { href: "#pricing", label: "Pricing", id: "pricing" },
  { href: "#contact", label: "Contact", id: "contact" },
];

export default function LandingPage() {
  const [typedTitle, setTypedTitle] = useState("");
  const [activeSection, setActiveSection] = useState("home");
  const { ref: trustedRef, isVisible: trustedVisible } = useScrollReveal();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setTypedTitle(heroTitle);
      return undefined;
    }

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTypedTitle(heroTitle.slice(0, index));
      if (index >= heroTitle.length) window.clearInterval(timer);
    }, 42);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.id)).filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.15, 0.35] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const highlightStart = heroTitle.indexOf(heroHighlight);
  const normalTitle = typedTitle.slice(0, Math.min(typedTitle.length, highlightStart));
  const highlightedTitle = typedTitle.slice(highlightStart);

  return (
    <main className="landing-page">
      <header className="landing-nav" aria-label="Main navigation">
        <Link className="landing-brand icon-title" to="/">
          <img src={logo} alt="LumiSec" />
          <span>
            LumiSec
            <small>Cyber Defense Platform</small>
          </span>
        </Link>
        <nav className="landing-links" aria-label="Page sections">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`landing-nav-link${activeSection === link.id ? " is-active" : ""}`}
              aria-current={activeSection === link.id ? "true" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="landing-actions">
          <Link className="landing-btn landing-btn-outline" to="/login">
            Login
          </Link>
          <Link className="landing-btn landing-btn-primary" to="/login">
            Get Started
          </Link>
        </div>
      </header>

      <section className="landing-hero" id="home">
        <div className="landing-hero__glow landing-hero__glow--left" aria-hidden="true" />
        <div className="landing-hero__glow landing-hero__glow--right" aria-hidden="true" />

        <div className="landing-hero-content landing-reveal">
          <p className="landing-eyebrow">Security command center</p>
          <h1 className="landing-hero__title typing-title" aria-label={heroTitle}>
            {normalTitle}
            {highlightedTitle && <span className="landing-hero__highlight">{highlightedTitle}</span>}
          </h1>
          <p className="landing-hero__subtitle">
            LumiSec connects phishing simulation, network scanning, GRC, SOAR, and SIEM
            workflows so your team can detect, investigate, and remediate faster.
          </p>
          <div className="landing-hero-actions landing-reveal landing-reveal--delay-1">
            <Link className="landing-btn landing-btn-primary landing-btn-lg" to="/login">
              Open Dashboard
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a className="landing-btn landing-btn-outline landing-btn-lg" href="#tools">
              Explore Platform
            </a>
          </div>
          <div className="hero-metrics landing-reveal landing-reveal--delay-2" aria-label="Platform highlights">
            {heroMetrics.map((metric) => (
              <article className="hero-metric" key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section landing-section--tools" id="tools">
        <div className="landing-section-heading landing-reveal">
          <p className="landing-eyebrow">Platform modules</p>
          <h2 className="landing-section__title">Built for the full security loop</h2>
          <p className="landing-section__lead">
            Each module feeds the next — from discovery and simulation to response and governance.
          </p>
        </div>
        <div className="tools-grid">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <article
                className="tool-card landing-reveal"
                key={tool.title}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="tool-card__media">
                  <img src={tool.image} alt="" className="w-100" aria-hidden="true" loading="lazy" />
                </div>
                <div className="tool-card__body">
                  <div className="tool-card__top">
                    <div className="icon-title icon-title--block tool-card__title-row">
                      <span className="tool-card__icon icon-title__icon" aria-hidden="true">
                        <Icon size={20} />
                      </span>
                      <h3 className="tool-card__title">{tool.title}</h3>
                    </div>
                    <span className="tool-card__number">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="tool-card__desc">{tool.description}</p>
                  <div className="tool-points">
                    {tool.points.map((point) => (
                      <span key={point}>{point}</span>
                    ))}
                  </div>
                  <span className="tool-card__badge">Active module</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="landing-section landing-process" id="about">
        <div className="landing-process__intro landing-reveal">
          <p className="landing-eyebrow">How it works</p>
          <h2 className="landing-section__title">From scan to response</h2>
          <p className="landing-section__lead landing-section__lead--left">
            LumiSec is designed around a single security workflow: collect signals, detect risk,
            investigate incidents, and push remediation into governance.
          </p>
        </div>
        <div className="process-list">
          {[
            { icon: Network, text: "Network scans produce assets, open ports, and misconfigurations." },
            { icon: Radar, text: "SIEM alerts and tool findings flow into SOAR for triage." },
            { icon: Activity, text: "SOAR playbooks guide investigation and response actions." },
            { icon: ShieldCheck, text: "Confirmed risks move into GRC for audit and remediation tracking." },
          ].map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div
                className="process-step landing-reveal"
                key={step.text}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="process-step__icon" aria-hidden="true">
                  <StepIcon size={22} />
                </span>
                <span className="process-step__text">{step.text}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section
        ref={trustedRef}
        className={`landing-section landing-trusted scroll-reveal${trustedVisible ? " is-visible" : ""}`}
        aria-labelledby="landing-trusted-heading"
      >
        <div className="landing-trusted__content">
          <div className="landing-trusted__badge">
            <ShieldCheck size={14} aria-hidden="true" />
            <span>Trusted worldwide</span>
          </div>

          <h2 id="landing-trusted-heading" className="landing-trusted__title">
          Integrated with{" "}
            <span className="landing-trusted__title-accent">
              <span className="landing-trusted__title-underline">global</span> leaders
            </span>
          </h2>

          <p className="landing-trusted__lead">
            LumiSec is relied upon by innovative organizations around the world to strengthen
            their security and protect what matters most.
          </p>

          <div className="landing-trusted__scroll">
            <ul className="landing-trusted__grid">
              {trustedLogos.map((partner) => (
                <li className="landing-trusted__item scroll-reveal__item" key={partner.name}>
                  <article className="landing-trusted__card">
                    <div
                      className={`landing-trusted__logo${partner.emblem ? " landing-trusted__logo--emblem" : ""}`}
                    >
                      <img src={partner.src} alt={partner.alt} loading="lazy" decoding="async" />
                    </div>
                    <span className="landing-trusted__label">{partner.label}</span>
                  </article>
                </li>
              ))}
            </ul>
          </div>

          <div className="landing-trusted__footer" aria-hidden="true">
            <span className="landing-trusted__footer-line" />
            <span className="landing-trusted__footer-icon">
              <ShieldCheck size={18} />
            </span>
            <span className="landing-trusted__footer-line" />
          </div>
        </div>
      </section>

      <section className="landing-section landing-section--pricing" id="pricing">
        <div className="landing-section-heading landing-reveal">
          <p className="landing-eyebrow">Plans</p>
          <h2 className="landing-section__title">Flexible security plans for every team</h2>
          <p className="landing-section__lead">
            Start with core modules and scale into full automation as your security program matures.
          </p>
        </div>
        <div className="plans-grid">
          {plans.map((plan, index) => (
            <article
              className={`plan-card landing-reveal ${plan.featured ? "plan-card--featured" : ""}`}
              key={plan.name}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="plan-card__header">
                <p className="plan-card__name">{plan.name}</p>
                <h3 className="plan-card__price">{plan.price}</h3>
                {plan.featured && <span className="plan-card__tag">Most popular</span>}
              </div>
              <ul className="plan-card__features">
                {plan.features.map((feature) => (
                  <li key={feature} className="icon-title icon-title--block">
                    <CheckCircle2 aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link className="landing-btn landing-btn-primary plan-card__cta" to="/login">
                Enroll Now
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-contact landing-reveal" id="contact">
        <div className="landing-contact__copy">
          <div className="icon-title icon-title--block icon-title--lg landing-contact__heading">
            <BarChart3 aria-hidden="true" />
            <h2 className="landing-section__title">Secure your cloud infrastructure</h2>
          </div>
          <p className="landing-section__lead landing-section__lead--left">
            Manage, monitor, and optimize your security operations with connected tools.
          </p>
        </div>
        <Link className="landing-btn landing-btn-primary landing-btn-lg" to="/login">
          Get Started
        </Link>
      </section>

      <footer className="landing-footer" id="footer">
        <div className="footer-main">
          <div className="footer-brand-block">
            <Link className="footer-logo icon-title" to="/">
              <img src={logo} alt="LumiSec" />
              <span>LumiSec</span>
            </Link>
            <p>
              Your unified partner for phishing simulation, network security, GRC,
              SOAR, and SIEM-ready operations.
            </p>
          </div>

          <div className="footer-column">
            <h3>Navigation</h3>
            <a href="#tools">Security Tools</a>
            <a href="#about">Workflow</a>
            <a href="#pricing">Plans</a>
            <Link to="/login">Login</Link>
          </div>

          <div className="footer-column">
            <h3>Contact</h3>
            <a href="mailto:support@lumisec.com"><Mail aria-hidden="true" /> support@lumisec.com</a>
            <a href="tel:+201000000000"><Phone aria-hidden="true" /> +20 100 000 0000</a>
            <a href="https://www.google.com/maps/search/?api=1&query=Cairo%2C%20Egypt" target="_blank" rel="noreferrer">
              <MapPin aria-hidden="true" /> Cairo, Egypt
            </a>
          </div>

          <div className="footer-column">
            <h3>Follow Us</h3>
            <div className="footer-socials" aria-label="Social links">
              <a href="https://www.linkedin.com" aria-label="LumiSec on LinkedIn">
                <i className="fa-brands fa-linkedin-in" aria-hidden="true" />
              </a>
              <a href="https://github.com" aria-label="LumiSec on GitHub">
                <i className="fa-brands fa-github" aria-hidden="true" />
              </a>
              <a href="https://twitter.com" aria-label="LumiSec on Twitter">
                <i className="fa-brands fa-x-twitter" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-credit">
          <span>© 2026 LumiSec</span>
          <span>Design and development by LumiSec Team</span>
        </div>
      </footer>
    </main>
  );
}
