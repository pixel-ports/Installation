import express from 'express';
import logger from '../config/winston';
import dashboardService from '../services/dashboard.service';

const router = express.Router();

// routes
router.get('/:id', getOne);
router.put('/:id', update);
router.post('/', create);
router.delete('/:id', deleteNode);
router.get('/', getAll);

export default router;

// Implementation

async function getOne(req, res) {
  const { params: { id } = { id: null } } = req;

  try {
    const data = await dashboardService.getOne(id);
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
    const data = await dashboardService.getAll(query);
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
    const data = await dashboardService.create(query);
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
    const data = await dashboardService.update(id, query);
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
    const data = await dashboardService.deleteOne(id);
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

  if (body.title) {
    query.title = body.title;
  }

  if (body.description) {
    query.description = body.description;
  }

  if (body.definition) {
    query.definition = body.definition;
  }

  return query;
}

function wrapperOk(data) {
  return { data, code: 20000 };
}
