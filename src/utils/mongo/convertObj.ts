export const toJSONbject = <T>(doc: T): T => {
  if (!doc || typeof doc !== 'object') return doc;

  const obj = JSON.parse(JSON.stringify(doc));
  obj.id = obj['_id'];
  delete obj['_id'];
  delete obj['__v'];
  delete obj['password'];
  delete obj['verifyCode'];
  return obj;
};

export const toDocument = <T>(obj: T): T => {
  if (!obj || typeof obj !== 'object') return obj;

  const doc = JSON.parse(JSON.stringify(obj));
  doc['_id'] = doc.id;
  delete doc['id'];
  return doc;
};
