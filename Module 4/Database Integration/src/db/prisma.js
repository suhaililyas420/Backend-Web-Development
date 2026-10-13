const { PrismaClient } = require('@prisma/client');

// One client for this application process.
const prisma = new PrismaClient();

module.exports = prisma;
