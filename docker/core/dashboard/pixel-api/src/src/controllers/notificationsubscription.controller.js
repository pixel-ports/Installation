import express from 'express';
import logger from '../config/winston';
import notificationSubscriptionService from '../services/notificationsubscription.service';
import notificationTemplateService from '../services/notificationtemplate.service';

const router = express.Router();
// routes

router.get('/', getOne);
router.put('/', update);
router.delete('/:id', deleteNode);

export default router;

// Implementation

async function getOne(req, res) {
  const { user: { id } = { id: null } } = req;

  try {
    const data = await notificationSubscriptionService.getOne(id);
    const data2 = await notificationTemplateService.getAll();

    res.json(wrapperOk({ all: data2, suscribed: data }));
  } catch (error) {
    res.json(wrapperOk([]));
    // logger.error(error);
    /* return res.status(404).json({
      error: {
        code: 22910,
        message: 'An error occurred'
      }
    }); */
  }
  return null;
}

async function update(req, res) {
  const { user: { id } = { id: null } } = req;
  const query = makeObj(req.body);

  try {
    const data = await notificationSubscriptionService.update(id, query);
    res.json(wrapperOk(data));
  } catch (error) {
    logger.error(error);
    return res.status(404).json({
      error: {
        code: 22913,
        message: 'An error occurred'
      }
    });
  }
  return null;
}

async function deleteNode(req, res) {
  const { params: { id } = { id: null } } = req;

  try {
    const data = await notificationSubscriptionService.deleteOne(id);
    res.json(wrapperOk(data));
  } catch (error) {
    logger.error(error);
    return res.status(404).json({
      error: {
        code: 22914,
        message: 'An error occurred'
      }
    });
  }
  return null;
}

function makeObj(body) {
  // const { body: { address } = { address: undefined } } = req;
  const query = {};

  if (body.notifications) {
    query.notifications = body.notifications;
  }

  return query;
}

function wrapperOk(data) {
  return { data, code: 20000 };
}
