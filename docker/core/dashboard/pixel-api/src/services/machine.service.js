import Machine from '../models/Machine.model';

const service = {};

service.getOne = getOne;
service.getAll = getAll;
service.create = create;
service.update = update;
service.deleteOne = deleteOne;
service.getAllFiltered = getAllFiltered;

export default service;

// Implementation

async function getOne(id) {
  let data = [];
  try {
    data = await Machine.findOne({ _id: id });
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function getAll(query) {
  let data = [];
  try {
    data = await Machine.find(query);
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

function getAllFiltered(query) {
  let data = [];
  try {
    data = Machine.find(query);
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function create(query) {
  let data = null;
  try {
    data = await new Machine(query).save();
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function update(id, query) {
  let data = null;
  try {
    data = await Machine.findOneAndUpdate({ _id: id }, { $set: query }, { new: true });
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
    data = await Machine.deleteOne({ _id: id });
  } catch (error) {
    throw new Error(error);
  }
  return data;
}
