const postStore = require('../data/postStore');

/*
 * Repository boundary:
 *
 * This repository currently uses a Map as its storage implementation
 * to prove that the service does not depend on the underlying storage.
 *
 * When the storage backend is replaced with Prisma:
 * - The storage implementation inside this repository will change.
 * - ID generation will be handled by the database.
 * - The service layer will remain unchanged.
 * - Controllers will remain unchanged.
 * - Routes will remain unchanged.
 * - The repository interface will remain the same.
 */

const posts = new Map(
  postStore.posts.map((post) => [post.id, { ...post }])
);

let nextId = Math.max(...posts.keys(), 0) + 1;

function findAll() {
  return Array.from(posts.values()).map((post) => ({
    ...post,
  }));
}

function findById(id) {
  const numericId = Number(id);
  const post = posts.get(numericId);
  return post ? { ...post } : null;
}

function create(fields) {
  const record = {
    id: nextId++,
    ...fields,
  };
  posts.set(record.id, record);
  return { ...record };
}

function update(id, patch) {
  const numericId = Number(id);
  const post = posts.get(numericId);
  if (!post) {
    return null;
  }
  Object.assign(post, patch);
  return { ...post };
}

function remove(id) {
  const numericId = Number(id);
  if (!posts.has(numericId)) {
    return false;
  }
  posts.delete(numericId);
  return true;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
