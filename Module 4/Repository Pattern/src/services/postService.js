const postRepository = require('../repositories/postRepository');

function listPosts() {
  return postRepository.findAll();
}

function getPost(id) {
  return postRepository.findById(id);
}

function createPost(fields) {
  if (!fields || !fields.title) {
    const error = new Error('Title is required');
    error.statusCode = 422;
    throw error;
  }

  return postRepository.create({
    title: fields.title,
    body: fields.body || '',
    authorId: fields.authorId,
  });
}

function updatePost(id, patch) {
  const post = postRepository.findById(id);
  if (!post) {
    return null;
  }

  const updateFields = {};
  if (patch.title !== undefined) {
    updateFields.title = patch.title;
  }
  if (patch.body !== undefined) {
    updateFields.body = patch.body;
  }

  return postRepository.update(id, updateFields);
}

function removePost(id) {
  return postRepository.remove(id);
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  updatePost,
  removePost,
};
