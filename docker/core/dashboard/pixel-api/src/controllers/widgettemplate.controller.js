import express from 'express';
import { check } from 'express-validator';
import logger from '../config/winston';
import widgettemplateService from '../services/widgettemplate.service';
import util from '../middlewares/util';

const router = express.Router();

// routes
router.get('/:id', getOne);
router.put(
  '/:id',
  [
    check('source')
      .optional({ checkFalsy: true })
      .isIn([
        'real-time',
        'algorithm-pa',
        'model-pas',
        'custom',
        'external-system',
        'air-model',
        'noise-model',
        'traffic-model',
        'traffic-model-upv'
      ])
  ],
  util.sendValidations,
  update
);
router.post(
  '/',
  [
    check('source').isIn([
      'real-time',
      'algorithm-pa',
      'model-pas',
      'custom',
      'external-system',
      'air-model',
      'noise-model',
      'traffic-model',
      'traffic-model-upv'
    ])
  ],
  util.sendValidations,
  create
);
router.delete('/:id', deleteNode);
router.get('/', getAll);

export default router;

// Implementation

async function getOne(req, res) {
  const { params: { id } = { id: null } } = req;

  try {
    const data = await widgettemplateService.getOne(id);
    res.json(wrapperOk(data));
  } catch (error) {
    logger.error(error);
    return res.status(404).json({
      error: {
        code: 51910,
        message: 'An error occurred'
      }
    });
  }
  return null;
}

async function getAll(req, res) {
  try {
    const data = await widgettemplateService.getAll();
    res.json(wrapperOk(data));
  } catch (error) {
    logger.error(error);
    return res.status(404).json({
      error: {
        code: 51911,
        message: 'An error occurred'
      }
    });
  }
  return null;
}

async function create(req, res) {
  const query = makeObj(req.body);

  try {
    const data = await widgettemplateService.create(query);
    res.json(wrapperOk(data));
  } catch (error) {
    logger.error(error);
    return res.status(404).json({
      error: {
        code: 51912,
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
    const data = await widgettemplateService.update(id, query);
    res.json(wrapperOk(data));
  } catch (error) {
    logger.error(error);
    return res.status(404).json({
      error: {
        code: 51913,
        message: 'An error occurred'
      }
    });
  }
  return null;
}

async function deleteNode(req, res) {
  const { params: { id } = { id: null } } = req;

  try {
    const data = await widgettemplateService.deleteOne(id);
    res.json(wrapperOk(data));
  } catch (error) {
    logger.error(error);
    return res.status(404).json({
      error: {
        code: 51914,
        message: 'An error occurred'
      }
    });
  }
  return null;
}

function makeObj(body) {
  // const { body: { address } = { address: undefined } } = req;
  const query = {};

  if (body.source) {
    query.source = body.source;
  }

  if (body.type) {
    query.type = body.type;
  }

  if (body.template) {
    query.template = body.template;
  }

  return query;
}

function wrapperOk(data) {
  return { data, code: 20000 };
}
