import express from 'express';
import logger from '../config/winston';
import resourceService from '../services/resource.service';
// import areaService from '../services/area.service';

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
    const data = await resourceService.getOne(id);
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

/* function recoverAreaByResource(id) {
  try {
    const data = areaService.getAllFiltered({ idResource: id });
    return data;
  } catch (error) {
    logger.error(error);
  }
  return null;
} */

async function getAll(req, res) {
  const { query } = req;
  try {
    const data = await resourceService.getAll(query);
    // ----- recover areas per resource
    /* data.forEach(element => {
      console.log('Empiezo area');
      const id = element._id;
      console.log(id);
      const listArea = recoverAreaByResource(id); areaService.getAll({ idResource: id });
      console.log('LIST AREA');
      console.log(listArea);
      console.log('Acabo area');
      element.areas.push(listArea);
    }); */
    res.json(wrapperOk(data));
    // const id = data._id;
    // console.log(data);
    /* const listArea = await areaService.getAll({ id });
    console.log(listArea); */
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
    const data = await resourceService.create(query);
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
    const data = await resourceService.update(id, query);
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
    const data = await resourceService.deleteOne(id);
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

  if (body.areas) {
    query.areas = body.areas;
  }

  if (body.machines) {
    query.machines = body.machines;
  }

  return query;
}

function wrapperOk(data) {
  return { data, code: 20000 };
}
