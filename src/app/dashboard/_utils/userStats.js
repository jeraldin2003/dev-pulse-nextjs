/**
 * userStats.js
 * Pure function — transforms raw JSONPlaceholder /users array into
 * the shape expected by UsersPanel and OverviewPanel.
 */

/**
 * @param {Array} users - Raw array of user objects from JSONPlaceholder.
 * @returns {{
 *   totalUsers: number,
 *   totalCompanies: number,
 *   bizUsers: Array<{ id: number, name: string, email: string, company: { name: string } }>,
 *   companies: Array<{ name: string, company: string, email: string }>,
 * }}
 */
export function getUserStats(users) {
  if (!Array.isArray(users))
    return { totalUsers: 0, totalCompanies: 0, bizUsers: [], companies: [] };

  const totalUsers = users.length;

  // Shape bizUsers to the exact object UsersPanel expects
  const bizUsers = users
    .filter((u) => typeof u.email === 'string' && u.email.endsWith('.biz'))
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      company: { name: u.company?.name ?? '' },
    }));

  const companies = users.map((u) => ({
    name: u.name,
    company: u.company?.name ?? '',
    email: u.email,
  }));

  const uniqueCompanies = [...new Set(users.map((u) => u.company?.name).filter(Boolean))];

  return {
    totalUsers,
    totalCompanies: uniqueCompanies.length,
    bizUsers,
    companies,
  };
}

// Named export alias used throughout the codebase
export const userStats = (users) => getUserStats(users);
