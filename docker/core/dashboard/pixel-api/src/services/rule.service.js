import Rule from '../models/Rule.model';

const service = {};

service.getOne = getOne;
service.getAll = getAll;
service.create = create;
service.update = update;
service.deleteOne = deleteOne;

export default service;

// Implementation

async function getOne(id) {
  let data = [];
  try {
    data = await Rule.findOne({ _id: id });
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function getAll(query) {
  let data = [];
  try {
    data = await Rule.find(query);
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function create(query) {
  let data = null;
  try {
    data = await new Rule(query).save();
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function update(id, query) {
  let data = null;
  try {
    data = await Rule.findOneAndUpdate({ _id: id }, { $set: query }, { new: true });
    if (!data) {
      throw new Error('Not exist');
    }
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function deleteOne(id) {
  let data = [];
  try {
    data = await Rule.deleteOne({ _id: id });
  } catch (error) {
    throw new Error(error);
  }
  return data;
}
