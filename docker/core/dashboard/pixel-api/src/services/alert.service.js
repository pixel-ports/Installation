import config from '../config/config';

const axios = require('axios');

const api = axios.create({
  baseURL: config.alerts.ELASTALERT_URL,
  timeout: 5000
});
const service = {};

service.getOne = getOne;
service.getMapping = getMapping;
service.getIndexes = getIndexes;
service.getAll = getAll;
service.create = create;
// service.update = update;
service.deleteOne = deleteOne;

export default service;

// Implementation

async function getMapping(name) {
  let data = {};
  try {
    data = await api.get(`/api/mapping/${name}`);
    data = data.data;
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function getIndexes() {
  let data = [];
  try {
    data = await api.get('/api/indices');
    data = data.data;
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function getOne(name) {
  let data = [];
  try {
    data = await api.get(`/api/rules/${name}`);
    data = data.data;
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function getAll() {
  const data = [];
  try {
    const response = await api.get('/api/rules?all');

    for (let i = 0; i < response.data.length; i++) {
      const element = response.data[i];
      if (element !== 'BaseRule.config') data.push({ position: i, name: element, _id: element });
    }
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function create(query) {
  let data = null;
  try {
    data = await api({
      method: 'post',
      url: `/api/rules/${query.name}`,
      data: {
        yaml: query.yaml
      },
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    });
    data = data.data;
  } catch (error) {
    throw new Error(error);
  }
  return data;
}
/*
async function update(id, query) {
  let data = null;
  try {
    data = await Widget.findOneAndUpdate({ _id: id }, { $set: query }, { new: true });
    if (!data) {
      throw new Error('Not exist');
    }
  } catch (error) {
    throw new Error(error);
  }
  return data;
}
*/
async function deleteOne(name) {
  let data = [];
  try {
    data = await api({
      method: 'delete',
      url: `/api/rules/${name}`
    });
    data = data.data;
  } catch (error) {
    throw new Error(error);
  }
  return data;
}
