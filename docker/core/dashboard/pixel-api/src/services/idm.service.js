import config from '../config/config';

const axios = require('axios');

let session;
apiAuth();
const api = axios.create({
  baseURL: config.fiware.IDM_URL,
  timeout: 5000
});

const service = {};

service.getRoles = getRoles;
service.getRolesUser = getRolesUser;
service.setRolesUser = setRolesUser;
service.deleteRolesUser = deleteRolesUser;
service.createUser = createUser;
service.deleteUser = deleteUser;
service.getAllUsers = getAllUsers;
service.createRole = createRole;
service.deleteRole = deleteRole;
service.updateUser = updateUser;
service.updateRole = updateRole;

export default service;

// Implementation

async function getRoles() {
  let data = {};
  try {
    data = await api.get(`/v1/applications/${config.fiware.KEYROCK_CLIENT_ID}/roles`);
    data = data.data;
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function getRolesUser(idUser) {
  let data = {};
  try {
    data = await api.get(
      `/v1/applications/${config.fiware.KEYROCK_CLIENT_ID}/users/${idUser}/roles`
    );
    data = data.data;
  } catch (error) {
    data = { role_user_assignments: [] };
  }
  return data;
}

async function setRolesUser(idUser, idRole) {
  let data = {};
  try {
    data = await api({
      method: 'post',
      url: `/v1/applications/${config.fiware.KEYROCK_CLIENT_ID}/users/${idUser}/roles/${idRole}`
    });
    data = data.data;
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function deleteRolesUser(idUser, idRole) {
  let data = {};
  try {
    data = await api({
      method: 'delete',
      url: `/v1/applications/${config.fiware.KEYROCK_CLIENT_ID}/users/${idUser}/roles/${idRole}`
    });
    data = data.data;
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function createUser(query) {
  let data = {};
  try {
    data = await api({
      method: 'post',
      url: `/v1/users`,
      data: query
    });
    data = data.data;
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function updateUser(query, id) {
  let data = {};
  try {
    data = await api({
      method: 'patch',
      url: `/v1/users/${id}`,
      data: query
    });
    data = data.data;
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function deleteUser(id) {
  let data = {};
  try {
    data = await api({
      method: 'delete',
      url: `/v1/users/${id}`
    });
    data = data.data;
  } catch (error) {
    throw new Error(error);
  }
  return data;
}
async function getAllUsers() {
  let data = {};
  try {
    data = await api.get(`/v1/users`);
    data = data.data;
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function createRole(query) {
  let data = {};
  try {
    data = await api({
      method: 'post',
      url: `/v1/applications/${config.fiware.KEYROCK_CLIENT_ID}/roles`,
      data: query
    });
    data = data.data;
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function deleteRole(idRole) {
  let data = {};
  try {
    data = await api({
      method: 'delete',
      url: `/v1/applications/${config.fiware.KEYROCK_CLIENT_ID}/roles/${idRole}`
    });
    data = data.data;
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function updateRole(query, id) {
  let data = {};
  query.role.application_id = config.fiware.KEYROCK_CLIENT_ID;
  try {
    data = await api({
      method: 'patch',
      url: `/v1/applications/${config.fiware.KEYROCK_CLIENT_ID}/roles/${id}`,
      data: query
    });
    data = data.data;
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

// - - - - -- - Api config

async function apiAuth() {
  let data = {};
  try {
    data = await axios.post(`${config.fiware.IDM_URL}/v1/auth/tokens`, {
      name: config.fiware.ADMIN_EMAIL,
      password: config.fiware.ADMIN_SECRET
    });
    session = data.data;
    session.value = data.headers['x-subject-token'];
  } catch (error) {
    throw new Error(error);
  }
}

api.interceptors.request.use(
  configRequest => {
    const originalRequest = configRequest;
    if (!session || new Date(session.token.expires_at) <= new Date()) {
      return apiAuth().then(() => {
        originalRequest.headers['X-Auth-token'] = session.value;
        originalRequest.headers['Content-Type'] = 'application/json';
        return Promise.resolve(originalRequest);
      });
    }
    originalRequest.headers['X-Auth-token'] = session.value;
    originalRequest.headers['Content-Type'] = 'application/json';
    return originalRequest;
  },
  err => {
    return Promise.reject(err);
  }
);
