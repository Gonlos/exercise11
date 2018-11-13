function cleanClone(document) {
  const copy = document._doc ? Object.assign({}, document._doc) : Object.assign({}, document);
  delete copy._id;
  delete copy.__v;
  delete copy.updated_at;
  delete copy.created_at;
  return copy;
}

module.exports = {
  cleanClone
};
