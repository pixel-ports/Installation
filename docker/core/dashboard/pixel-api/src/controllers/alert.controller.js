import express from 'express';
import { check } from 'express-validator';
import logger from '../config/winston';
import alertService from '../services/alert.service';
import alerttemplateService from '../services/alerttemplate.service';

import util from '../middlewares/util';

const YAML = require('yaml');

const router = express.Router();

// routes
router.get('/mapping/:id', getMapping);
router.get('/indexes', getIndexes);
router.get('/:id', getOne);
router.put(
  '/:id',
  [
    check('title').optional({ checkFalsy: true }),
    check('description').optional({ checkFalsy: true }),
    check('source')
      .optional({ checkFalsy: true })
      .isIn(['template1', 'template2', 'template3'])
  ],
  util.sendValidations,
  update
);
router.post('/:keyTemplate', create);
router.delete('/:id', deleteNode);
router.get('/', getAll);

export default router;

// Implementation

async function getOne(req, res) {
  const { params: { id } = { id: null } } = req;
  try {
    const data = await alertService.getOne(id);
    res.json(wrapperOk(YAML.parse(data)));
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
    const data = await alertService.getAll();
    res.json(wrapperOk(data));
  } catch (error) {
    logger.error(error);
    return res.status(404).json({
      error: {
        code: 51911,
        message: 'An error occurred alert'
      }
    });
  }
  return null;
}

async function getMapping(req, res) {
  const { params: { id } = { id: null } } = req;
  try {
    const data = await alertService.getMapping(id);
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

async function getIndexes(req, res) {
  try {
    const data = await alertService.getIndexes();
    res.json(wrapperOk(data));
  } catch (error) {
    logger.error(error);
    return res.status(404).json({
      error: {
        code: 519111,
        message: 'An error occurred'
      }
    });
  }
  return null;
}

async function create(req, res) {
  const { params: { keyTemplate } = { keyTemplate: null } } = req;
  try {
    const query = await makeObj(req.body, keyTemplate);
    const data = await alertService.create(query);
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

  const query = await makeObj(req.body);

  try {
    const data = await alertService.update(id, query);
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
    const data = await alertService.deleteOne(id);
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

async function makeObj(body, keyTemplate) {
  // const { body: { address } = { address: undefined } } = req;
  let query = null;

  try {
    let yaml = null;

    const templates = await alerttemplateService.getAll();
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < templates.length; i++) {
      if (templates[i].source === keyTemplate) {
        yaml = YAML.parse(templates[i].yaml);
      }
    }

    const merged = { ...yaml, ...body };

    merged.http_post_static_payload.from = merged.name;
    // eslint-disable-next-line no-underscore-dangle
    merged.__praeco_full_path = merged.name;

    query = { yaml: YAML.stringify(merged), name: merged.name };
  } catch (error) {
    logger.error(error);
  }

  return query;
}

function wrapperOk(data) {
  return { data, code: 20000 };
}
