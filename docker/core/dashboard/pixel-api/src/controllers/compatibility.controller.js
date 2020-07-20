import express from 'express';
import logger from '../config/winston';
import compatibilityService from '../services/compatibility.service';

const router = express.Router();

// routes
router.get('/filterBySC/:idSC', getCompatibilityFilterBySC);
router.get('/:id', getOne);
router.put('/:id', update);
router.post('/', create);
router.delete('/:id', deleteNode);
router.get('/', getAll);

export default router;

// Implementation

async function getCompatibilityFilterBySC(req, res) {
  const { params: { idSC } = { idSC: null } } = req;

  try {
    const data = await compatibilityService.getAll({ idSC });
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
    const data = await compatibilityService.getOne(id);
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
    const data = await compatibilityService.getAll(query);
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
    const data = await compatibilityService.create(query);
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
    const data = await compatibilityService.update(id, query);
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
    const data = await compatibilityService.deleteOne(id);
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

  if (body.idSC) {
    query.idSC = body.idSC;
  }

  if (body.cargoes_category) {
    query.cargoes_category = body.cargoes_category;
  } else {
    query.cargoes_category = '';
  }

  if (body.directions_Nature) {
    query.directions_Nature = body.directions_Nature;
  } else {
    query.directions_Nature = '';
  }

  if (body.areas_ID) {
    query.areas_ID = body.areas_ID;
  } else {
    query.areas_ID = '';
  }

  if (body.shiftworks_ID) {
    query.shiftworks_ID = body.shiftworks_ID;
  } else {
    query.shiftworks_ID = '';
  }

  return query;
}

function wrapperOk(data) {
  return { data, code: 20000 };
}
