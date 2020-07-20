import express from 'express';
import logger from '../config/winston';
import areaService from '../services/area.service';
// import resourceService from '../services/resource.service';

const router = express.Router();

// routes
router.get('/filterByResource/:idResource', getAreasFilterByResource);
router.get('/:id', getOne);
router.put('/:id', update);
router.post('/', create);
router.delete('/:id', deleteNode);
router.get('/', getAll);

export default router;

// Implementation

async function getAreasFilterByResource(req, res) {
  const { params: { idResource } = { idResource: null } } = req;

  try {
    const data = await areaService.getAll({ idResource });
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
    const data = await areaService.getOne(id);
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
    const data = await areaService.getAll(query);
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
    const data = await areaService.create(query);
    res.json(wrapperOk(data));
    //--------------------------
    // const id = data.idResource;
    // Recover the specific resource
    // const specificResource = await (await resourceService.getOne(id)).populate('areas');
    // console.log(specificResource);
    // Recover all the areas for this specific resource
    // const listAreas = await areaService.getAll({ id });
    // push sobre el objeto areas
    // specificResource.areas = listAreas;
    // console.log(specificResource);
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
    const data = await areaService.update(id, query);
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
    const data = await areaService.deleteOne(id);
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

  if (body.idArea) {
    query.idArea = body.idArea;
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
  } else {
    query.type = '';
  }

  if (body.owner) {
    query.owner = body.owner;
  } else {
    query.owner = '';
  }

  if (body.terminal) {
    query.terminal = body.terminal;
  } else {
    query.terminal = '';
  }

  return query;
}

function wrapperOk(data) {
  return { data, code: 20000 };
}
