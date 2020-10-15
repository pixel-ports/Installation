import express from 'express';
import logger from '../config/winston';
import idmService from '../services/idm.service';

const router = express.Router();

// routes
router.get('/roles', getRoles);
router.post('/roles', createRole);
router.delete('/roles/:idRole', deleteRole);
router.put('/roles/:idRole', updateRole);

router.get('/roles-user/:id', getRolesUser);
router.post('/roles-user/:idUser/:idRole', setRolesUser);
router.delete('/roles-user/:idUser/:idRole', deleteRolesUser);

router.post('/user', createUser);
router.get('/user', getAllUsers);
router.delete('/user/:id', deleteUser);
router.put('/user/:id', updateUser);

export default router;

// Implementation

async function getRoles(req, res) {
  try {
    const data = await idmService.getRoles();
    res.json(wrapperOk(data));
  } catch (error) {
    logger.error(error);
    return res.status(404).json({
      error: {
        code: 15567,
        message: 'An error occurred'
      }
    });
  }
  return null;
}

async function updateRole(req, res) {
  const query = req.body;
  const { params: { idRole } = { id: null } } = req;

  try {
    const toUpdate = {};

    if (query.name) {
      toUpdate.name = query.name;
    }

    const data = await idmService.updateRole(
      {
        role: { ...toUpdate }
      },
      idRole
    );
    res.json(wrapperOk(data));
  } catch (error) {
    logger.error(error);
    return res.status(404).json({
      error: {
        code: 19112,
        message: 'An error occurred'
      }
    });
  }
  return null;
}

async function getRolesUser(req, res) {
  const { params: { id } = { id: null } } = req;
  try {
    const data = await idmService.getRolesUser(id);
    res.json(wrapperOk(data));
  } catch (error) {
    logger.error(error);
    return res.status(404).json({
      error: {
        code: 15570,
        message: 'An error occurred'
      }
    });
  }
  return null;
}

async function setRolesUser(req, res) {
  const { params: { idUser, idRole } = { id: null } } = req;
  try {
    const data = await idmService.setRolesUser(idUser, idRole);
    res.json(wrapperOk(data));
  } catch (error) {
    logger.error(error);
    return res.status(404).json({
      error: {
        code: 15571,
        message: 'An error occurred'
      }
    });
  }
  return null;
}

async function deleteRolesUser(req, res) {
  const { params: { idUser, idRole } = { id: null } } = req;
  try {
    const data = await idmService.deleteRolesUser(idUser, idRole);
    res.json(wrapperOk(data));
  } catch (error) {
    logger.error(error);
    return res.status(404).json({
      error: {
        code: 15572,
        message: 'An error occurred'
      }
    });
  }
  return null;
}

async function createUser(req, res) {
  const query = req.body;
  try {
    const data = await idmService.createUser({
      user: { ...query }
    });
    res.json(wrapperOk(data));
  } catch (error) {
    logger.error(error);
    return res.status(404).json({
      error: {
        code: 15568,
        message: 'An error occurred'
      }
    });
  }
  return null;
}

async function updateUser(req, res) {
  const query = req.body;
  const { params: { id } = { id: null } } = req;

  try {
    const toUpdate = {};

    if (query.username) {
      toUpdate.username = query.username;
    }
    if (query.description) {
      toUpdate.description = query.description;
    }
    if (query.email) {
      toUpdate.email = query.email;
    }
    if (query.password) {
      toUpdate.password = query.password;
    }

    const data = await idmService.updateUser(
      {
        user: { ...toUpdate }
      },
      id
    );
    res.json(wrapperOk(data));
  } catch (error) {
    logger.error(error);
    return res.status(404).json({
      error: {
        code: 15112,
        message: 'An error occurred'
      }
    });
  }
  return null;
}

async function deleteUser(req, res) {
  const { params: { id } = { id: null } } = req;
  try {
    await idmService.deleteUser(id);
    res.json(wrapperOk(true));
  } catch (error) {
    logger.error(error);
    return res.status(404).json({
      error: {
        code: 15569,
        message: 'An error occurred'
      }
    });
  }
  return null;
}

async function getAllUsers(req, res) {
  try {
    const data = await idmService.getAllUsers();
    res.json(wrapperOk(data));
  } catch (error) {
    logger.error(error);
    return res.status(404).json({
      error: {
        code: 15576,
        message: 'An error occurred'
      }
    });
  }
  return null;
}

async function createRole(req, res) {
  const { body: { name } = { id: null } } = req;
  try {
    const data = await idmService.createRole({
      role: {
        name
      }
    });
    res.json(wrapperOk(data));
  } catch (error) {
    logger.error(error);
    return res.status(404).json({
      error: {
        code: 155681,
        message: 'An error occurred'
      }
    });
  }
  return null;
}

async function deleteRole(req, res) {
  const { params: { idRole } = { id: null } } = req;
  try {
    const data = await idmService.deleteRole(idRole);
    res.json(wrapperOk(data));
  } catch (error) {
    logger.error(error);
    return res.status(404).json({
      error: {
        code: 15598,
        message: 'An error occurred'
      }
    });
  }
  return null;
}

function wrapperOk(data) {
  return { data, code: 20000 };
}
