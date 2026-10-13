const prisma = require('../db/prisma');

async function findAll() {
  return prisma.post.findMany({ orderBy: { id: 'asc' } });
}

async function findById(id) {
  return prisma.post.findUnique({ where: { id: Number(id) } });
}

async function create(fields) {
  try {
    return await prisma.post.create({
      data: {
        title: fields.title,
        body: fields.body || '',
        authorId: Number(fields.authorId),
      },
    });
  } catch (error) {
    if (error.code === 'P2003') {
      const err = new Error('Invalid relation: referenced record does not exist');
      err.statusCode = 422;
      throw err;
    }
    if (error.code === 'P2002') {
      const err = new Error('Unique constraint violation: duplicate record');
      err.statusCode = 409;
      throw err;
    }
    throw error;
  }
}

async function update(id, patch) {
  const existing = await findById(id);
  if (!existing) return null;

  try {
    const data = {};
    if (patch.title !== undefined) data.title = patch.title;
    if (patch.body !== undefined) data.body = patch.body;
    if (patch.authorId !== undefined) data.authorId = Number(patch.authorId);

    return await prisma.post.update({
      where: { id: Number(id) },
      data,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return null;
    }
    if (error.code === 'P2003') {
      const err = new Error('Invalid relation: referenced record does not exist');
      err.statusCode = 422;
      throw err;
    }
    if (error.code === 'P2002') {
      const err = new Error('Unique constraint violation: duplicate record');
      err.statusCode = 409;
      throw err;
    }
    throw error;
  }
}

async function remove(id) {
  const existing = await findById(id);
  if (!existing) return false;

  try {
    await prisma.post.delete({ where: { id: Number(id) } });
    return true;
  } catch (error) {
    if (error.code === 'P2025') {
      return false;
    }
    throw error;
  }
}

module.exports = { findAll, findById, create, update, remove };
