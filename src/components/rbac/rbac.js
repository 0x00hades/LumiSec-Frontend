import { tools } from '../tools/tools.config';

/**
 * Returns the list of tools the given role is allowed to access.
 * @param {string} role
 * @returns {import('../tools/tools.config').Tool[]}
 */
export function getAllowedTools(role) {
  if (!role) return [];
  return tools.filter(tool => tool.roles.includes(role));
}

/**
 * Returns true when the role has access to the given tool id.
 * @param {string} toolId
 * @param {string} role
 */
export function isToolAllowed(toolId, role) {
  if (!role) return false;
  const tool = tools.find(t => t.id === toolId);
  if (!tool) return false;
  return tool.roles.includes(role);
}

/**
 * Finds a tool definition by its id.
 * @param {string} toolId
 */
export function getToolById(toolId) {
  return tools.find(t => t.id === toolId) ?? null;
}

/**
 * Finds a tool whose path is a prefix of the given pathname.
 * Used to derive the active tool from the current URL.
 * @param {string} pathname
 */
export function getToolByPath(pathname) {
  // Longest-match wins so /Network/NetworkDiscovery picks "network" not a shorter prefix
  return (
    [...tools]
      .sort((a, b) => b.path.length - a.path.length)
      .find(tool => pathname.startsWith(tool.path)) ?? null
  );
}

/**
 * Builds the SidebarB section tree for the given role:
 *   - Main (Dashboard)
 *   - Tools (role-filtered)
 *   - Administration (GLOBAL_ADMIN only)
 * @param {string} role
 */
export function generateSidebarSections(role) {
  const isAdmin = role === 'GLOBAL_ADMIN';
  const allowedTools = getAllowedTools(role);

  const sections = [
    {
      id: 'main',
      label: null,
      items: [
        { id: 'home', name: 'Home', path: '/welcome', icon: 'layout-dashboard' },
      ],
    },
    {
      id: 'tools',
      label: 'Tools',
      items: allowedTools.map(tool => ({
        id: tool.id,
        name: tool.name,
        path: tool.path,
        icon: tool.icon,
      })),
    },
  ];

  if (isAdmin) {
    sections.push({
      id: 'admin',
      label: 'Administration',
      items: [
        { id: 'admin-users',    name: 'Users',    path: '/admin/users',    icon: 'users'    },
        { id: 'admin-roles',    name: 'Roles',    path: '/admin/roles',    icon: 'shield'   },
        { id: 'admin-settings', name: 'Settings', path: '/admin/settings', icon: 'settings' },
      ],
    });
  }

  return sections;
}
