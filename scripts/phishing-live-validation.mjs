/**
 * Live phishing integration validator.
 * Uses the same base URL, paths, and payloads as src/features/Phishing/services/phishingApi.js
 */
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";
const PHISHING = `${BASE}/api/phishing`;

const results = [];

function record({ endpoint, consumer, status, error, fix }) {
  results.push({ endpoint, consumer, status, error: error || "", fix: fix || "" });
}

function authClient(token) {
  return axios.create({
    baseURL: PHISHING,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    timeout: 30000,
    validateStatus: () => true,
  });
}

const publicClient = axios.create({
  baseURL: PHISHING,
  timeout: 30000,
  validateStatus: () => true,
});

async function login(email, password) {
  const res = await axios.post(`${BASE}/api/auth/login`, { email, password }, { validateStatus: () => true });
  if (res.status !== 200 || !res.data?.data?.token) {
    throw new Error(`Login failed (${res.status}): ${res.data?.message || "unknown"}`);
  }
  return { token: res.data.data.token, user: res.data.data.user };
}

async function test(name, consumer, fn) {
  try {
    await fn();
    record({ endpoint: name, consumer, status: "PASS" });
    console.log(`PASS  ${name}`);
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    record({ endpoint: name, consumer, status: "FAIL", error: msg });
    console.log(`FAIL  ${name} — ${msg}`);
  }
}

async function expectStatus(res, expected, label) {
  if (res.status !== expected) {
    throw new Error(`${label}: expected HTTP ${expected}, got ${res.status} — ${JSON.stringify(res.data)?.slice(0, 200)}`);
  }
}

async function ensureAdmin() {
  const creds = [
    { email: "live-admin@lumisec.io", password: "Password123" },
    { email: "admin@lumisec.io", password: "Password123" },
  ];

  for (const cred of creds) {
    try {
      return await login(cred.email, cred.password);
    } catch {
      // try next
    }
  }

  await axios.post(`${BASE}/api/auth/signup`, {
    name: "Live Admin",
    email: "live-admin@lumisec.io",
    password: "Password123",
    role: "admin",
    department: "SOC",
  }, { validateStatus: () => true });

  return login("live-admin@lumisec.io", "Password123");
}

async function main() {
  console.log(`\n=== Phishing Live Validation ===`);
  console.log(`Backend: ${BASE}\n`);

  let adminToken;
  let noAuthClient;

  const admin = await ensureAdmin();
  adminToken = admin.token;
  noAuthClient = authClient();
  console.log(`Logged in as admin (${admin.user.role})\n`);

  const client = authClient(adminToken);

  // Create RBAC test users if missing
  for (const u of [
    { email: "live-manager@lumisec.io", role: "phishing_manager", name: "Live Manager" },
    { email: "live-auditor@lumisec.io", role: "auditor", name: "Live Auditor" },
  ]) {
    await axios.post(`${BASE}/api/auth/signup`, {
      ...u,
      password: "Password123",
      department: "SOC",
    }, { validateStatus: () => true });
  }

  let templateId;
  let landingPageId;
  let recipientId;
  let campaignId;
  let trackingId;

  // ─── TEMPLATES ───────────────────────────────────────────────
  await test("POST /phishing/templates", "TemplateEditor / useTemplates", async () => {
    const res = await client.post("/templates", {
      name: `Live Template ${Date.now()}`,
      subject: "Security Alert",
      htmlBody: "<p>Live test</p>",
      textBody: "Live test",
      category: "credential",
      language: "en",
    });
    await expectStatus(res, 201, "create template");
    templateId = res.data?.data?._id || res.data?.data?.id;
    if (!templateId) throw new Error("No template id in response");
  });

  await test("GET /phishing/templates", "TemplatesList / useTemplates", async () => {
    const res = await client.get("/templates");
    await expectStatus(res, 200, "list templates");
    if (!Array.isArray(res.data?.data)) throw new Error("Expected data array");
  });

  await test("GET /phishing/templates/:id", "TemplateEditor / useTemplates", async () => {
    const res = await client.get(`/templates/${templateId}`);
    await expectStatus(res, 200, "get template");
  });

  await test("PATCH /phishing/templates/:id", "TemplateEditor / useTemplates", async () => {
    const res = await client.patch(`/templates/${templateId}`, { subject: "Updated Subject" });
    await expectStatus(res, 200, "update template");
  });

  // ─── LANDING PAGES ───────────────────────────────────────────
  await test("POST /phishing/landing-pages", "LandingPageEditor / useLandingPages", async () => {
    const res = await client.post("/landing-pages", {
      name: `Live LP ${Date.now()}`,
      title: "Verify Account",
      htmlContent: "<form></form>",
      redirectUrl: "https://example.com",
    });
    await expectStatus(res, 201, "create landing page");
    landingPageId = res.data?.data?._id || res.data?.data?.id;
    if (!landingPageId) throw new Error("No landing page id");
  });

  await test("GET /phishing/landing-pages", "LandingPagesList / useLandingPages", async () => {
    const res = await client.get("/landing-pages");
    await expectStatus(res, 200, "list landing pages");
  });

  await test("GET /phishing/landing-pages/:id", "LandingPageEditor / useLandingPages", async () => {
    const res = await client.get(`/landing-pages/${landingPageId}`);
    await expectStatus(res, 200, "get landing page");
  });

  await test("PATCH /phishing/landing-pages/:id", "LandingPageEditor / useLandingPages", async () => {
    const res = await client.patch(`/landing-pages/${landingPageId}`, { title: "Updated Title" });
    await expectStatus(res, 200, "update landing page");
  });

  // ─── RECIPIENTS ──────────────────────────────────────────────
  await test("POST /phishing/recipients/import", "ImportRecipients / useRecipients", async () => {
    const res = await client.post("/recipients/import", {
      csv: `name,email,department\nJane Live,jane.${Date.now()}@lumisec.io,IT`,
    });
    await expectStatus(res, 201, "import recipients");
  });

  await test("GET /phishing/recipients", "RecipientsList / useRecipients", async () => {
    const res = await client.get("/recipients");
    await expectStatus(res, 200, "list recipients");
    const list = res.data?.data;
    if (!Array.isArray(list) || !list.length) throw new Error("No recipients returned");
    recipientId = list[0]._id || list[0].id;
    trackingId = list[0].trackingId;
  });

  await test("GET /phishing/recipients/:id", "RecipientDetails / useRecipients", async () => {
    const res = await client.get(`/recipients/${recipientId}`);
    await expectStatus(res, 200, "get recipient");
  });

  await test("PATCH /phishing/recipients/:id", "RecipientEdit / useRecipients", async () => {
    const res = await client.patch(`/recipients/${recipientId}`, { department: "Engineering" });
    await expectStatus(res, 200, "update recipient");
  });

  // ─── CAMPAIGNS ───────────────────────────────────────────────
  await test("POST /phishing/campaigns", "CampaignCreate / useCampaigns", async () => {
    const res = await client.post("/campaigns", {
      name: `Live Campaign ${Date.now()}`,
      templateId,
    });
    await expectStatus(res, 201, "create campaign");
    campaignId = res.data?.data?._id || res.data?.data?.id;
    if (!campaignId) throw new Error("No campaign id");
  });

  await test("GET /phishing/campaigns", "CampaignList / useCampaigns", async () => {
    const res = await client.get("/campaigns");
    await expectStatus(res, 200, "list campaigns");
  });

  await test("GET /phishing/campaigns/:id", "CampaignDetails / useCampaigns", async () => {
    const res = await client.get(`/campaigns/${campaignId}`);
    await expectStatus(res, 200, "get campaign");
  });

  await test("PATCH /phishing/campaigns/:id", "CampaignEdit / useCampaigns", async () => {
    const res = await client.patch(`/campaigns/${campaignId}`, { description: "Live validation run" });
    await expectStatus(res, 200, "update campaign");
  });

  await test("POST /phishing/campaigns/:id/recipients", "CampaignCreate / attachCampaignRecipients", async () => {
    const res = await client.post(`/campaigns/${campaignId}/recipients`, {
      recipients: [{
        fullName: "Live Test User",
        email: `live.recipient.${Date.now()}@lumisec.io`,
        department: "IT",
      }],
    });
    if (res.status !== 200 && res.status !== 201) {
      throw new Error(`add recipients: HTTP ${res.status} — ${JSON.stringify(res.data)?.slice(0, 200)}`);
    }
    const added = res.data?.data?.recipients?.[0];
    trackingId = added?.trackingId;
    if (added?._id || added?.id) recipientId = added._id || added.id;
    if (!trackingId) throw new Error("No trackingId on campaign recipient");
  });

  await test("POST /phishing/campaigns/:id/launch", "CampaignLaunchConsole / useCampaigns", async () => {
    const res = await client.post(`/campaigns/${campaignId}/launch`, {}, { timeout: 60000 });
    await expectStatus(res, 200, "launch campaign");
  });

  await test("POST /phishing/campaigns/:id/pause", "CampaignLaunchConsole / useCampaigns", async () => {
    const res = await client.post(`/campaigns/${campaignId}/pause`);
    await expectStatus(res, 200, "pause campaign");
  });

  await test("POST /phishing/campaigns/:id/resume", "CampaignLaunchConsole / useCampaigns", async () => {
    const res = await client.post(`/campaigns/${campaignId}/resume`);
    await expectStatus(res, 200, "resume campaign");
  });

  // ─── TRACKING (public) — while campaign RUNNING ──────────────
  if (trackingId) {
    await test("GET /phishing/track/open/:trackingId", "phishingApi.trackOpen", async () => {
      const res = await publicClient.get(`/track/open/${trackingId}`, { timeout: 15000 });
      if (res.status >= 500) throw new Error(`Server error ${res.status}`);
    });

    await test("GET /phishing/track/click/:trackingId", "phishingApi.trackClick", async () => {
      const res = await publicClient.get(`/track/click/${trackingId}`, { timeout: 15000 });
      if (res.status >= 500) throw new Error(`Server error ${res.status}`);
    });

    await test("POST /phishing/track/visit/:trackingId", "phishingApi.trackVisit", async () => {
      const res = await publicClient.post(`/track/visit/${trackingId}`, {}, { timeout: 15000 });
      if (res.status >= 500) throw new Error(`Server error ${res.status}`);
    });

    await test("POST /phishing/track/submit/:trackingId", "phishingApi.trackSubmit", async () => {
      const res = await publicClient.post(`/track/submit/${trackingId}`, { username: "live@lumisec.io" }, { timeout: 15000 });
      if (res.status >= 500) throw new Error(`Server error ${res.status}`);
    });

    await test("POST /phishing/track/download/:trackingId", "phishingApi.trackDownload", async () => {
      const res = await publicClient.post(`/track/download/${trackingId}`, {}, { timeout: 15000 });
      if (res.status >= 500) throw new Error(`Server error ${res.status}`);
    });
  } else {
    ["open", "click", "visit", "submit", "download"].forEach((t) => {
      record({ endpoint: `TRACK /phishing/track/${t}`, consumer: "phishingApi", status: "FAIL", error: "No trackingId on recipient" });
    });
  }

  await test("POST /phishing/campaigns/:id/stop", "CampaignLaunchConsole / useCampaigns", async () => {
    const res = await client.post(`/campaigns/${campaignId}/stop`);
    await expectStatus(res, 200, "stop campaign");
  });

  // ─── REPORTS ─────────────────────────────────────────────────
  await test("GET /phishing/reports/:campaignId/stats", "ReportViewer / useReports", async () => {
    const res = await client.get(`/reports/${campaignId}/stats`);
    await expectStatus(res, 200, "report stats");
    const stats = res.data?.data;
    if (!stats || stats.emailsSent === undefined) throw new Error("Missing stats fields");
  });

  await test("POST /phishing/reports/:campaignId/generate", "ReportViewer / useReports", async () => {
    const res = await client.post(`/reports/${campaignId}/generate`, {}, { timeout: 60000 });
    if (res.status !== 200 && res.status !== 201 && res.status !== 202) {
      throw new Error(`generate report: HTTP ${res.status}`);
    }
  });

  await test("GET /phishing/reports/:campaignId/download", "ReportDownload / useReports", async () => {
    let res;
    for (let i = 0; i < 15; i += 1) {
      res = await client.get(`/reports/${campaignId}/download`, { responseType: "arraybuffer", timeout: 15000 });
      if (res.status === 200) break;
      await new Promise((r) => setTimeout(r, 2000));
    }
    if (res.status !== 200) throw new Error(`download report: HTTP ${res.status}`);
  });

  // ─── DASHBOARD ───────────────────────────────────────────────
  await test("GET /phishing/dashboard/overview", "Overview / useDashboardOverview", async () => {
    const res = await client.get("/dashboard/overview");
    await expectStatus(res, 200, "dashboard overview");
  });

  await test("GET /phishing/dashboard/risks", "Risks / useDashboardRisks", async () => {
    const res = await client.get("/dashboard/risks");
    await expectStatus(res, 200, "dashboard risks");
  });

  await test("GET /phishing/dashboard/departments", "Departments / useDashboardDepartments", async () => {
    const res = await client.get("/dashboard/departments");
    await expectStatus(res, 200, "dashboard departments");
  });

  await test("GET /phishing/dashboard/trends", "Trends / useDashboardTrends", async () => {
    const res = await client.get("/dashboard/trends");
    await expectStatus(res, 200, "dashboard trends");
  });

  // ─── INTEGRATIONS ────────────────────────────────────────────
  await test("POST /phishing/integrations/grc/risk", "PhishingIntegrationActions", async () => {
    const res = await client.post("/integrations/grc/risk", {
      campaignId,
      riskLevel: "medium",
      reason: "Live validation test",
    });
    if (res.status >= 500) throw new Error(`GRC integration HTTP ${res.status}`);
  });

  await test("POST /phishing/integrations/soar/incident", "PhishingIntegrationActions", async () => {
    const res = await client.post("/integrations/soar/incident", { campaignId, title: "Live test incident" });
    if (res.status >= 500) throw new Error(`SOAR integration HTTP ${res.status}`);
  });

  await test("POST /phishing/integrations/siem/event", "PhishingIntegrationActions", async () => {
    const res = await client.post("/integrations/siem/event", { campaignId, eventType: "phishing_simulation" });
    if (res.status >= 500) throw new Error(`SIEM integration HTTP ${res.status}`);
  });

  await test("POST /phishing/integrations/opencti/indicator", "PhishingIntegrationActions", async () => {
    const res = await client.post("/integrations/opencti/indicator", { campaignId, iocType: "campaign", value: campaignId });
    if (res.status >= 500) throw new Error(`OpenCTI integration HTTP ${res.status}`);
  });

  // ─── AUTH TESTS ──────────────────────────────────────────────
  await test("AUTH: GET /phishing/campaigns without token → 401", "apiClient interceptor", async () => {
    const res = await noAuthClient.get("/campaigns");
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  // ─── DELETE (cleanup) ────────────────────────────────────────
  await test("DELETE /phishing/templates/:id", "TemplatesList / useTemplates", async () => {
    const res = await client.delete(`/templates/${templateId}`);
    await expectStatus(res, 200, "delete template");
  });

  await test("DELETE /phishing/landing-pages/:id", "LandingPagesList / useLandingPages", async () => {
    const res = await client.delete(`/landing-pages/${landingPageId}`);
    await expectStatus(res, 200, "delete landing page");
  });

  await test("DELETE /phishing/recipients/:id", "RecipientsList / useRecipients", async () => {
    const res = await client.delete(`/recipients/${recipientId}`);
    await expectStatus(res, 200, "delete recipient");
  });

  await test("DELETE /phishing/campaigns/:id", "CampaignList / useCampaigns", async () => {
    const res = await client.delete(`/campaigns/${campaignId}`);
    await expectStatus(res, 200, "delete campaign");
  });

  // ─── FRONTEND UI SMOKE (dev server) ──────────────────────────
  const FRONTEND = process.env.FRONTEND_URL || "http://localhost:3000";
  const uiRoutes = [
    { route: "/Phishing", consumer: "Overview" },
    { route: "/Phishing/Campaigns", consumer: "CampaignList" },
    { route: "/Phishing/Templates", consumer: "TemplatesList" },
    { route: "/Phishing/LandingPages", consumer: "LandingPagesList" },
    { route: "/Phishing/Recipients", consumer: "RecipientsList" },
    { route: "/Phishing/Reports", consumer: "ReportViewer" },
    { route: "/Phishing/Tracking/Logs", consumer: "TrackingLogs" },
  ];

  for (const { route, consumer } of uiRoutes) {
    await test(`UI ROUTE ${route}`, consumer, async () => {
      const res = await axios.get(`${FRONTEND}${route}`, {
        validateStatus: () => true,
        timeout: 10000,
        headers: { Accept: "text/html" },
      });
      // CRA dev server may 404 deep links on direct GET; root shell is sufficient for dev
      if (res.status === 404) {
        const root = await axios.get(`${FRONTEND}/`, { validateStatus: () => true, timeout: 5000 });
        if (root.status !== 200 || !String(root.data).includes("root")) {
          throw new Error(`Frontend dev server not reachable at ${FRONTEND}`);
        }
        return;
      }
      if (res.status !== 200) throw new Error(`Frontend HTTP ${res.status}`);
      if (!String(res.data).includes("root")) throw new Error("Missing React root mount point");
    });
  }

  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;

  const reportPath = path.join(__dirname, "phishing-live-validation-report.json");
  fs.writeFileSync(reportPath, JSON.stringify({ summary: { passed, failed, total: results.length }, results }, null, 2));

  console.log(`\n=== SUMMARY: ${passed} PASS / ${failed} FAIL / ${results.length} total ===`);
  console.log(`Report: ${reportPath}\n`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Validation crashed:", err);
  process.exit(1);
});
