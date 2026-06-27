import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AuthProvider } from "./features/auth/context/AuthContext";
import { ToastProvider } from "./components/toast/ToastContext";
import ProtectedRoute, { PublicOnlyRoute } from "./features/auth/components/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import ToolRoute from "./components/rbac/ToolRoute";

// Public pages
import LandingPage from "./features/landing/LandingPage";
import Login from "./features/auth/pages/Login";
import WelcomePage from "./features/welcome/WelcomePage";
import WelcomeDashboard from "./features/welcome/WelcomeDashboard";

// GRC
import GRCDashboard from "./features/GRC/pages/GRCDashboard";
import GRCAudits from "./features/GRC/pages/GRCAudits";
import GRCStandards from "./features/GRC/pages/GRCStandards";
import GRCRemediation from "./features/GRC/pages/GRCRemediation";
import GRCSettings from "./features/GRC/pages/GRCSettings";

// SOAR
import SoarAnalytics from "./features/SOAR/Pages/SoarAnalytics";
import IncidentQueue from "./features/SOAR/Pages/IncidentQueue";
import IncidentManagement from "./features/SOAR/Pages/IncidentManagement";
import SoarPlaybookBuilder from "./features/SOAR/Pages/SoarPlaybookBuilder";

// Network
import Dashboard from "./features/Network/Pages/Dashboard";
import NetworkDiscovery from "./features/Network/Pages/NetworkDiscovery";
import PortScanning from "./features/Network/Pages/PortScanning";
import PacketCapture from "./features/Network/Pages/PacketCapture";
import AssetInventory from "./features/Network/Pages/AssetInventory";
import Misconfigurations from "./features/Network/Pages/Misconfigurations";
import FlowMonitoring from "./features/Network/Pages/FlowMonitoring";

// Phishing
import Overview from "./features/Phishing/Pages/Dashboard/Overview";
import Risks from "./features/Phishing/Pages/Dashboard/Risks";
import Departments from "./features/Phishing/Pages/Dashboard/Departments";
import Trends from "./features/Phishing/Pages/Dashboard/Trends";
import CampaignList from "./features/Phishing/Pages/Campaigns/CampaignList";
import CampaignDetails from "./features/Phishing/Pages/Campaigns/CampaignDetails";
import CampaignCreate from "./features/Phishing/Pages/Campaigns/CampaignCreate";
import CampaignEdit from "./features/Phishing/Pages/Campaigns/CampaignEdit";
import CampaignLaunchConsole from "./features/Phishing/Pages/Campaigns/CampaignLaunchConsole";
import TemplatesList from "./features/Phishing/Pages/Templates/TemplatesList";
import TemplateEditor from "./features/Phishing/Pages/Templates/TemplateEditor";
import LandingPagesList from "./features/Phishing/Pages/LandingPages/LandingPagesList";
import LandingPageEditor from "./features/Phishing/Pages/LandingPages/LandingPageEditor";
import RecipientsList from "./features/Phishing/Pages/Recipients/RecipientsList";
import RecipientDetails from "./features/Phishing/Pages/Recipients/RecipientDetails";
import RecipientEdit from "./features/Phishing/Pages/Recipients/RecipientEdit";
import ImportRecipients from "./features/Phishing/Pages/Recipients/ImportRecipients";
import TrackingLogs from "./features/Phishing/Pages/Tracking/TrackingLogs";
import EventTimeline from "./features/Phishing/Pages/Tracking/EventTimeline";
import ReportViewer from "./features/Phishing/Pages/Reports/ReportViewer";
import ReportDownload from "./features/Phishing/Pages/Reports/ReportDownload";
import PhishingSettings from "./features/Phishing/Pages/PhishingSettings";

// SIEM
import SIEMIntegration from "./features/SIEMIntegration/pages/SIEMIntegration";

const myRouter = createBrowserRouter([
  // Public routes
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <PublicOnlyRoute><Login /></PublicOnlyRoute> },

  // Protected routes wrapped by shared app layout
  {
    element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
    children: [
      // Welcome
      {
        path: "welcome",
        element: <WelcomePage />,
        children: [{ index: true, element: <WelcomeDashboard /> }],
      },

      // GRC
      { path: "GRC", element: <ToolRoute toolId="grc"><GRCDashboard /></ToolRoute> },
      { path: "GRC/Audits", element: <ToolRoute toolId="grc"><GRCAudits /></ToolRoute> },
      { path: "GRC/Standards", element: <ToolRoute toolId="grc"><GRCStandards /></ToolRoute> },
      { path: "GRC/Remediation", element: <ToolRoute toolId="grc"><GRCRemediation /></ToolRoute> },
      { path: "GRC/Settings", element: <ToolRoute toolId="grc"><GRCSettings /></ToolRoute> },

      // SOAR
      { path: "SOAR", element: <ToolRoute toolId="soar"><SoarAnalytics /></ToolRoute> },
      { path: "SOAR/Analytics", element: <ToolRoute toolId="soar"><SoarAnalytics /></ToolRoute> },
      { path: "SOAR/IncidentsQueue", element: <ToolRoute toolId="soar"><IncidentQueue /></ToolRoute> },
      { path: "SOAR/IncidentManagement", element: <ToolRoute toolId="soar"><IncidentManagement /></ToolRoute> },
      { path: "SOAR/playbook", element: <ToolRoute toolId="soar"><SoarPlaybookBuilder /></ToolRoute> },

      // Network
      { path: "Network", element: <ToolRoute toolId="network"><Dashboard /></ToolRoute> },
      { path: "Network/NetworkDiscovery", element: <ToolRoute toolId="network"><NetworkDiscovery /></ToolRoute> },
      { path: "Network/PortScanning", element: <ToolRoute toolId="network"><PortScanning /></ToolRoute> },
      { path: "Network/PacketCapture", element: <ToolRoute toolId="network"><PacketCapture /></ToolRoute> },
      { path: "Network/packetCapture", element: <ToolRoute toolId="network"><PacketCapture /></ToolRoute> },
      { path: "Network/AssetInventory", element: <ToolRoute toolId="network"><AssetInventory /></ToolRoute> },
      { path: "Network/Misconfigurations", element: <ToolRoute toolId="network"><Misconfigurations /></ToolRoute> },
      { path: "Network/FlowMonitoring", element: <ToolRoute toolId="network"><FlowMonitoring /></ToolRoute> },

      // Phishing
      { path: "Phishing", element: <ToolRoute toolId="phishing"><Overview /></ToolRoute> },
      { path: "Phishing/Dashboard/Risks", element: <ToolRoute toolId="phishing"><Risks /></ToolRoute> },
      { path: "Phishing/Dashboard/Departments", element: <ToolRoute toolId="phishing"><Departments /></ToolRoute> },
      { path: "Phishing/Dashboard/Trends", element: <ToolRoute toolId="phishing"><Trends /></ToolRoute> },
      { path: "Phishing/Campaigns", element: <ToolRoute toolId="phishing"><CampaignList /></ToolRoute> },
      { path: "Phishing/Campaigns/create", element: <ToolRoute toolId="phishing"><CampaignCreate /></ToolRoute> },
      { path: "Phishing/Campaigns/:id/launch", element: <ToolRoute toolId="phishing"><CampaignLaunchConsole /></ToolRoute> },
      { path: "Phishing/Campaigns/:id/edit", element: <ToolRoute toolId="phishing"><CampaignEdit /></ToolRoute> },
      { path: "Phishing/Campaigns/:id", element: <ToolRoute toolId="phishing"><CampaignDetails /></ToolRoute> },
      { path: "Phishing/Templates", element: <ToolRoute toolId="phishing"><TemplatesList /></ToolRoute> },
      { path: "Phishing/Templates/:id/edit", element: <ToolRoute toolId="phishing"><TemplateEditor /></ToolRoute> },
      { path: "Phishing/EmailTemplates", element: <ToolRoute toolId="phishing"><TemplatesList /></ToolRoute> },
      { path: "Phishing/LandingPages", element: <ToolRoute toolId="phishing"><LandingPagesList /></ToolRoute> },
      { path: "Phishing/LandingPages/:id/edit", element: <ToolRoute toolId="phishing"><LandingPageEditor /></ToolRoute> },
      { path: "Phishing/Recipients", element: <ToolRoute toolId="phishing"><RecipientsList /></ToolRoute> },
      { path: "Phishing/Recipients/import", element: <ToolRoute toolId="phishing"><ImportRecipients /></ToolRoute> },
      { path: "Phishing/Recipients/:id/edit", element: <ToolRoute toolId="phishing"><RecipientEdit /></ToolRoute> },
      { path: "Phishing/Recipients/:id", element: <ToolRoute toolId="phishing"><RecipientDetails /></ToolRoute> },
      { path: "Phishing/Tracking/Logs", element: <ToolRoute toolId="phishing"><TrackingLogs /></ToolRoute> },
      { path: "Phishing/Tracking/Timeline", element: <ToolRoute toolId="phishing"><EventTimeline /></ToolRoute> },
      { path: "Phishing/Reports", element: <ToolRoute toolId="phishing"><ReportViewer /></ToolRoute> },
      { path: "Phishing/Reports/download/:id", element: <ToolRoute toolId="phishing"><ReportDownload /></ToolRoute> },
      { path: "Phishing/Settings", element: <ToolRoute toolId="phishing"><PhishingSettings /></ToolRoute> },

      // SIEM
      { path: "SIEMIntegration", element: <SIEMIntegration /> },

      // Unknown protected paths
      { path: "*", element: <Navigate to="/welcome" replace /> },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <RouterProvider router={myRouter} />
      </ToastProvider>
    </AuthProvider>
  );
}
