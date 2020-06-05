/* eslint-disable no-unused-vars */
import axios from 'axios';
import config from '../config/config';

const middleware = {};

middleware.authUser = authUser;
middleware.authApi = authApi;
middleware.isAuthorized = isAuthorized;

async function authUser(req, res, next) {
  req.user = { id: 'demo', name: 'demo' };
  next();
  /* if (process.env.NODE_ENV !== 'production') {
    req.user = { name: 'demo' };
    next();
  } else {
    if (!req.headers.token) {
      return res.status(400).json({
        error: {
          message: 'You did not specify any token for this request'
        }
      });
    }
    try {
      const response = await axios({
        method: 'GET',
        headers: {
          'X-Auth-token': req.headers.token,
          'X-Subject-token': req.headers.token
        },
        url: `${config.fiware.IDM_URL}/v1/auth/tokens`
      });

      const { data: { User } = { User: null } } = response;

      req.user = User;

      next();
    } catch (error) {
      return res.status(500).json({
        error: {
          message: 'You did not specify a valid token for this request'
        }
      });
    }
  } */
  return null;
}

async function authApi(req, res, next) {
  if (req.headers.token === config.auth.master) {
    next();
  } else {
    return res.status(500).json({
      error: {
        message: 'You did not specify a valid token for this request'
      }
    });
  }
  return null;
}

async function isAuthorized(req, res, next) {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({
      error: {
        message: 'You are not authorised to perform this action. SignUp/Login to continue'
      }
    });
  }
  return null;
}

export default middleware;
