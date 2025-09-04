// Nature-inspired vibrant color palette
const ROLE_COLORS = [
  '#FF6B35', // sunset orange
  '#004E89', // deep ocean blue
  '#1A936F', // forest green
  '#88498F', // lavender purple
  '#FFBE0B', // golden yellow
  '#FB8500', // amber orange
  '#219EBC', // sky blue
  '#8ECAE6'  // powder blue
];

/**
 * Simple hash function to convert string to number
 * @param {string} str - String to hash
 * @returns {number} - Hash value
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Get a consistent color for a role based on its ID
 * @param {string} roleId - The role ID
 * @returns {string} - Hex color code
 */
export function getRoleColor(roleId) {
  if (!roleId || typeof roleId !== 'string') {
    return ROLE_COLORS[0];
  }
  
  const hash = simpleHash(roleId);
  const colorIndex = hash % ROLE_COLORS.length;
  return ROLE_COLORS[colorIndex];
}

/**
 * Get color mapping for all roles in a workflow
 * @param {Array} roles - Array of role objects with id property
 * @returns {Object} - Object mapping role IDs to colors
 */
export function getAllRoleColors(roles) {
  if (!Array.isArray(roles)) {
    return {};
  }
  
  const colorMap = {};
  roles.forEach(role => {
    colorMap[role.id] = getRoleColor(role.id);
  });
  
  return colorMap;
}

/**
 * Generate Mermaid CSS class name for a role
 * @param {string} roleId - The role ID
 * @returns {string} - CSS class name safe for Mermaid
 */
export function getRoleClassName(roleId) {
  if (!roleId || typeof roleId !== 'string') {
    return 'role-default';
  }
  
  // Replace non-alphanumeric characters with underscores for CSS class safety
  return `role-${roleId.replace(/[^a-zA-Z0-9]/g, '_')}`;
}