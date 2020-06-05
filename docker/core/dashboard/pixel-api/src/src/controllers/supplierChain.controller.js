import express from 'express';
import logger from '../config/winston';
import supplierChainService from '../services/supplierChain.service';

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
    const data = await supplierChainService.getOne(id);
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
    const data = await supplierChainService.getAll(query);
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
    const data = await supplierChainService.create(query);
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
    const data = await supplierChainService.update(id, query);
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
    const data = await supplierChainService.deleteOne(id);
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

  if (body.name) {
    query.name = body.name;
  }

  if (body.description) {
    query.description = body.description;
  } else {
    query.description = '';
  }

  if (body.exportToIH_pending) {
    query.exportToIH_pending = body.exportToIH_pending;
  } else {
    query.exportToIH_pending = false;
  }

  // if (body.label) {
  //   query.label = body.label;
  // } else {
  //   query.label = '';
  // }

  // if (body.comment) {
  //   query.comment = body.comment;
  // } else {
  //   query.comment = '';
  // }

  // if (body.compatibility) {
  //   query.compatibility = body.compatibility;
  // } else {
  //   query.compatibility = false;
  // }

  if (body.details) {
    query.details = body.details;
  }

  if (body.steps_list) {
    query.steps_list = body.steps_list;
  }

  return query;
}

function wrapperOk(data) {
  return { data, code: 20000 };
}
