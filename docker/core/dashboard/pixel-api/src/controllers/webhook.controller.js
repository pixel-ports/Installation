import express from 'express';
import logger from '../config/winston';
import notificationLogService from '../services/notificationlog.service';

const router = express.Router();
// routes

router.post('/', create);

export default router;

// Implementation

async function create(req, res) {
  const query = makeObj(req.body);

  try {
    const data = await notificationLogService.create(query);
    res.json(wrapperOk(data));
  } catch (error) {
    logger.error(error);
    return res.status(404).json({
      error: {
        code: 22912,
        message: 'An error occurred'
      }
    });
  }
  return null;
}

function makeObj(body) {
  // const { body: { address } = { address: undefined } } = req;
  const query = {};

  if (body.notification) {
    query.notification = body.notification;
  }

  if (body.metadata) {
    query.metadata = body.metadata;
  }

  return query;
}

function wrapperOk(data) {
  return { data, code: 20000 };
}
