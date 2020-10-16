import NotificationLog from '../models/NotificationLog.model';

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
    data = await NotificationLog.findOne({ _id: id });
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function getAll() {
  let data = [];
  try {
    data = await NotificationLog.find();
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function create(query) {
  let data = null;
  try {
    data = await new NotificationLog(query).save();
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function update(id, query) {
  let data = null;
  try {
    data = await NotificationLog.findOneAndUpdate({ _id: id }, { $set: query }, { new: true });
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
    data = await NotificationLog.deleteOne({ _id: id });
  } catch (error) {
    throw new Error(error);
  }
  return data;
}
