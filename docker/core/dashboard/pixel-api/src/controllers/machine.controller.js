import express from 'express';
import logger from '../config/winston';
import machineService from '../services/machine.service';

const router = express.Router();

// routes
router.get('/filterMachineByResource/:idResource', getMachinesFilterByResource);
router.get('/filterMachineByShiftWork/:shiftID', getMachinesFilterByShiftWork);
router.get('/:id', getOne);
router.put('/:id', update);
router.post('/', create);
router.delete('/:id', deleteNode);
router.get('/', getAll);

export default router;

// Implementation

async function getMachinesFilterByResource(req, res) {
  const { params: { idResource } = { idResource: null } } = req;

  try {
    const data = await machineService.getAll({ idResource });
    res.json(wrapperOk(data));
  } catch (error) {
    logger.error(error);
    return res.status(404).json({
      error: {
        code: 54910,
        message: 'An error occurred'
      }
    });
  }
  return null;
}

async function getMachinesFilterByShiftWork(req, res) {
  const { params: { shiftID } = { shiftID: null } } = req;

  try {
    const data = await machineService.getAll({ shiftID });
    res.json(wrapperOk(data));
  } catch (error) {
    logger.error(error);
    return res.status(404).json({
      error: {
        code: 54910,
        message: 'An error occurred'
      }
    });
  }
  return null;
}

async function getOne(req, res) {
  const { params: { id } = { id: null } } = req;

  try {
    const data = await machineService.getOne(id);
    res.json(wrapperOk(data));
  } catch (error) {
    logger.error(error);
    return res.status(404).json({
      error: {
        code: 54910,
        message: 'An error occurred'
      }
    });
  }
  return null;
}

async function getAll(req, res) {
  const { query } = req;
  try {
    const data = await machineService.getAll(query);
    res.json(wrapperOk(data));
  } catch (error) {
    logger.error(error);
    return res.status(404).json({
      error: {
        code: 54911,
        message: 'An error occurred'
      }
    });
  }
  return null;
}

async function create(req, res) {
  const query = makeObj(req.body);
  try {
    const data = await machineService.create(query);
    res.json(wrapperOk(data));
  } catch (error) {
    logger.error(error);
    return res.status(404).json({
      error: {
        code: 54915,
        message: 'An error occurred'
      }
    });
  }
  return null;
}

async function update(req, res) {
  const { params: { id } = { id: null } } = req;

  const query = makeObj(req.body);

  try {
    const data = await machineService.update(id, query);
    res.json(wrapperOk(data));
  } catch (error) {
    logger.error(error);
    return res.status(404).json({
      error: {
        code: 54913,
        message: 'An error occurred'
      }
    });
  }
  return null;
}

async function deleteNode(req, res) {
  const { params: { id } = { id: null } } = req;

  try {
    const data = await machineService.deleteOne(id);
    res.json(wrapperOk(data));
  } catch (error) {
    logger.error(error);
    return res.status(404).json({
      error: {
        code: 54914,
        message: 'An error occurred'
      }
    });
  }
  return null;
}

function makeObj(body) {
  // const { body: { address } = { address: undefined } } = req;
  const query = {};

  if (body.idMachine) {
    query.idMachine = body.idMachine;
  }

  if (body.idResource) {
    query.idResource = body.idResource;
  }

  if (body.label) {
    query.label = body.label;
  } else {
    query.label = '';
  }

  if (body.type) {
    query.type = body.type;
  }

  if (body.group) {
    query.group = body.group;
  } else {
    query.group = '';
  }

  if (body.owner) {
    query.owner = body.owner;
  } else {
    query.owner = '';
  }

  if (body.shiftID) {
    query.shiftID = body.shiftID;
  } else {
    query.shiftID = '';
  }

  if (body.throughput) {
    query.throughput = body.throughput;
  }

  if (body.consumptions) {
    query.consumptions = body.consumptions;
  }

  return query;
}

function wrapperOk(data) {
  return { data, code: 20000 };
}
