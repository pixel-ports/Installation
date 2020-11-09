import express from 'express';
import { check } from 'express-validator';
import logger from '../config/winston';
import widgetService from '../services/widget.service';
import util from '../middlewares/util';

const router = express.Router();

// routes
router.get('/published', getAllPublished);
router.get('/:id', getOne);
router.put(
  '/:id',
  [
    check('title').optional({ checkFalsy: true }),
    check('description').optional({ checkFalsy: true }),
    check('type')
      .optional({ checkFalsy: true })
      .isIn([
        'custom-iframe',
        'echart-bar',
        'echart-pie',
        'echart-radar',
        'gantt-bar-etd',
        'gantt-bar-pas',
        'table-etd',
        'table-sensors',
        'table-traffic',
        'table-external-system',
        'echartBar-sensor',
        'echartLine-sensor',
        'echartLine-traffic',
        'echartPie-sensor',
        'map-sensor',
        'map-dispersion',
        'map-noise',
        'echartLine-traffic-upv',
        'table-traffic-upv',
        'traffic-map-upv'
      ]),
    check('source')
      .optional({ checkFalsy: true })
      .isIn([
        'algorithm-pa',
        'model-pas',
        'custom',
        'real-time',
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
    check('title').optional({ checkFalsy: true }),
    check('description').optional({ checkFalsy: true }),
    check('type').isIn([
      'custom-iframe',
      'echart-bar',
      'echart-pie',
      'echart-radar',
      'gantt-bar-etd',
      'gantt-bar-pas',
      'table-etd',
      'table-sensors',
      'table-traffic',
      'table-external-system',
      'echartBar-sensor',
      'echartLine-sensor',
      'echartLine-traffic',
      'echartPie-sensor',
      'map-sensor',
      'map-dispersion',
      'map-noise',
      'echartLine-traffic-upv',
      'table-traffic-upv',
      'traffic-map-upv'
    ]),
    check('source').isIn([
      'algorithm-pa',
      'model-pas',
      'custom',
      'real-time',
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
    const data = await widgetService.getOne(id);
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
  const { query } = req;

  const { text } = req.query;

  if (text) {
    delete query.text;
    query.$or = [
      { title: new RegExp([text].join(''), 'i') },
      { description: new RegExp([text].join(''), 'i') }
    ];
  }
  try {
    const data = await widgetService.getAll(query);
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

async function getAllPublished(req, res) {
  try {
    const data = await widgetService.getAll({ home: { $ne: null } });
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
    const data = await widgetService.create(query);
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
    const data = await widgetService.update(id, query);
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
    const data = await widgetService.deleteOne(id);
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

  if (body.title) {
    query.title = body.title;
  }

  if (body.description) {
    query.description = body.description;
  }

  if (body.source) {
    query.source = body.source;
  }

  if (body.type) {
    query.type = body.type;
  }

  if (body.definition) {
    query.definition = body.definition;
  }

  if (body.position) {
    query.position = body.position;
  }

  if (body.filter) {
    query.filter = body.filter;
  }

  if (body.home) {
    query.home = body.home;
  } else {
    query.home = null;
  }

  return query;
}

function wrapperOk(data) {
  return { data, code: 20000 };
}
