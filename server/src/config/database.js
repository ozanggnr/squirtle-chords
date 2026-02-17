/**
 * In-Memory Database Config
 * No actual database - just returns success
 */

function initializeDatabase() {
  console.log('✅ Using in-memory storage (no database file)');
  console.log('⚠️  Data will reset on server restart');
}

module.exports = { initializeDatabase };
