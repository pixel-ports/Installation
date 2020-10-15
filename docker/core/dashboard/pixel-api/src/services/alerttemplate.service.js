import AlertTemplate from '../models/AlertTemplate.model';

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
    data = await AlertTemplate.findOne({ _id: id });
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function getAll() {
  let data = [];
  try {
    data = await AlertTemplate.find();
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function create(query) {
  let data = null;
  try {
    data = await new AlertTemplate(query).save();
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function update(id, query) {
  let data = null;
  try {
    data = await AlertTemplate.findOneAndUpdate({ _id: id }, { $set: query }, { new: true });
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function deleteOne(id) {
  let data = [];
  try {
    data = await AlertTemplate.deleteOne({ _id: id });
  } catch (error) {
    throw new Error(error);
  }
  return data;
}
