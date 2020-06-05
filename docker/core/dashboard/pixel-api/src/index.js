import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import logger from './config/winston';
import config from './config/config';
import util from './middlewares/util';
import auth from './middlewares/auth';
import widgetController from './controllers/widget.controller';
import widgettemplate from './controllers/widgettemplate.controller';
import notificationsubscription from './controllers/notificationsubscription.controller';
import notificationtemplate from './controllers/notificationtemplate.controller';
import notificationlog from './controllers/notificationlog.controller';
import dashboard from './controllers/dashboard.controller';
import resource from './controllers/resource.controller';
import area from './controllers/area.controller';
import machine from './controllers/machine.controller';
import rule from './controllers/rule.controller';
import cargoCategory from './controllers/cargoCategory.controller';
import shiftWork from './controllers/shiftWork.controller';
import priority from './controllers/priority.controller';
import assignment from './controllers/assignment.controller';
import validity from './controllers/validity.controller';
import connectToDb from './config/mongodb';

connectToDb();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(util.languageParser);
app.use(cors());

// Routes
app.use('/widget', auth.authUser, auth.isAuthorized, widgetController);
app.use('/widgettemplate', auth.authUser, auth.isAuthorized, widgettemplate);
app.use('/notification/subscription', auth.authUser, auth.isAuthorized, notificationsubscription);
app.use('/notification/log', auth.authUser, auth.isAuthorized, notificationlog);
app.use('/notification', auth.authUser, auth.isAuthorized, notificationtemplate);
app.use('/dashboard', auth.authUser, auth.isAuthorized, dashboard);
app.use('/resource', auth.authUser, auth.isAuthorized, resource);
app.use('/area', auth.authUser, auth.isAuthorized, area);
app.use('/machine', auth.authUser, auth.isAuthorized, machine);
app.use('/rule', auth.authUser, auth.isAuthorized, rule);
app.use('/cargoCategory', auth.authUser, auth.isAuthorized, cargoCategory);
app.use('/shiftWork', auth.authUser, auth.isAuthorized, shiftWork);
app.use('/priority', auth.authUser, auth.isAuthorized, priority);
app.use('/assignment', auth.authUser, auth.isAuthorized, assignment);
app.use('/validity', auth.authUser, auth.isAuthorized, validity);
app.listen(config.PORT, () => logger.info(`Listen on ${config.PORT} port`));
