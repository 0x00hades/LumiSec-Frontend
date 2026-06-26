/**
 * Browser validation for Phishing module using Playwright.
 * Requires: frontend on :3000, backend on :4000, valid admin user.
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND = process.env.FRONTEND_URL || "http://localhost:3000";
const EMAIL = process.env.LIVE_ADMIN_EMAIL || "live-admin@lumisec.io";
const PASSWORD = process.env.LIVE_ADMIN_PASSWORD || "Password123";

const results = [];

function record(route, action, status, error = "") {
  results.push({ route, action, status, error });
}

async function waitForPageReady(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
  await page.locator(".network-skeleton").first().waitFor({ state: "hidden", timeout: 15000 }).catch(() => {});
  await page.getByText(/^Loading /).first().waitFor({ state: "hidden", timeout: 15000 }).catch(() => {});
}

async function testAction(route, action, fn) {
  try {
    await fn();
    record(route, action, "PASS");
    console.log(`PASS  ${action}`);
  } catch (err) {
    record(route, action, "FAIL", err.message);
    console.log(`FAIL  ${action} — ${err.message}`);
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(20000);

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(err.message));

  try {
    await testAction("/", "Login", async () => {
      await page.goto(`${FRONTEND}/`);
      await page.fill('input[type="email"], input[name="email"]', EMAIL);
      await page.fill('input[type="password"], input[name="password"]', PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForURL((url) => url.pathname !== "/" && !url.pathname.endsWith("/login"), { timeout: 15000 });
      const token = await page.evaluate(() => localStorage.getItem("token"));
      if (!token) throw new Error("Login did not persist auth token");
    });

    const routes = [
      { path: "/Phishing", name: "Dashboard Overview", expect: "Phishing Simulation" },
      { path: "/Phishing/Templates", name: "Templates", expect: "Email Templates" },
      { path: "/Phishing/LandingPages", name: "Landing Pages", expect: "Landing Pages" },
      { path: "/Phishing/Recipients", name: "Recipients", expect: "Recipients" },
      { path: "/Phishing/Campaigns", name: "Campaigns", expect: "Campaigns" },
      { path: "/Phishing/Reports", name: "Reports", expect: "Campaign Reports" },
      { path: "/Phishing/Tracking/Logs", name: "Tracking Logs", expect: "Tracking Logs" },
      { path: "/Phishing/Dashboard/Risks", name: "Risks", expect: "Risk Dashboard" },
      { path: "/Phishing/Dashboard/Departments", name: "Departments", expect: "Department Breakdown" },
      { path: "/Phishing/Dashboard/Trends", name: "Trends", expect: "Susceptibility Trends" },
    ];

    for (const r of routes) {
      await testAction(r.path, `Load ${r.name}`, async () => {
        await page.goto(`${FRONTEND}${r.path}`);
        await waitForPageReady(page);
        const body = await page.textContent("body");
        if (!body?.includes(r.expect)) throw new Error(`Missing heading: ${r.expect}`);
      });
    }

    const actionButtons = [
      {
        route: "/Phishing/Campaigns",
        action: "New Campaign button",
        path: "/Phishing/Campaigns",
        link: /New Campaign/i,
        url: /Campaigns\/create/,
        heading: "Create Campaign",
      },
      {
        route: "/Phishing/Templates",
        action: "Create Template button",
        path: "/Phishing/Templates",
        link: /Create Template/i,
        url: /Templates\/new\/edit/,
        heading: "Create Template",
      },
      {
        route: "/Phishing/LandingPages",
        action: "Create Page button",
        path: "/Phishing/LandingPages",
        link: /Create Page/i,
        url: /LandingPages\/new\/edit/,
        heading: "Create Landing Page",
      },
      {
        route: "/Phishing/Recipients",
        action: "Import CSV button",
        path: "/Phishing/Recipients",
        link: /Import CSV/i,
        url: /Recipients\/import/,
        heading: "Import Recipients",
      },
    ];

    for (const btn of actionButtons) {
      await testAction(btn.route, btn.action, async () => {
        await page.goto(`${FRONTEND}${btn.path}`);
        await waitForPageReady(page);
        const link = page.getByRole("link", { name: btn.link });
        await link.waitFor({ state: "visible", timeout: 15000 });
        await link.click();
        await page.waitForURL(btn.url, { timeout: 15000 });
        await waitForPageReady(page);
        const body = await page.textContent("body");
        if (!body?.includes(btn.heading)) throw new Error(`Expected page heading: ${btn.heading}`);
      });
    }

    const benignConsolePatterns = [
      /Failed to load resource.*favicon/i,
      /Manifest.*404/i,
    ];
    const criticalErrors = consoleErrors.filter(
      (msg) => !benignConsolePatterns.some((pattern) => pattern.test(msg))
    );

    if (criticalErrors.length) {
      record("console", "No JS errors", "FAIL", criticalErrors.slice(0, 3).join(" | "));
      console.log("FAIL  Console errors:", criticalErrors.slice(0, 3));
    } else {
      record("console", "No JS errors", "PASS");
      console.log("PASS  No console errors");
    }
  } finally {
    await browser.close();
  }

  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  const reportPath = path.join(__dirname, "phishing-browser-validation-report.json");
  fs.writeFileSync(reportPath, JSON.stringify({ summary: { passed, failed, total: results.length }, results }, null, 2));
  console.log(`\nBrowser validation: ${passed} PASS / ${failed} FAIL / ${results.length} total`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
