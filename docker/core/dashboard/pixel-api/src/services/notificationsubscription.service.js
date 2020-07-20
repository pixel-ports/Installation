import NotificationSubscription from '../models/NotificationSubscription.model';

const service = {};

service.getOne = getOne;
service.create = create;
service.update = update;
service.deleteOne = deleteOne;

export default service;

// Implementation

async function getOne(userId) {
  let data = [];
  try {
    data = await NotificationSubscription.findOne({ user: userId }).populate('notifications');
    data = data.notifications || [];

    data.forEach(element => {
      // eslint-disable-next-line no-param-reassign
      element.subscribed = true;
    });
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function create(query) {
  let data = null;
  try {
    data = await new NotificationSubscription(query).save();
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function update(id, query) {
  let data = null;
  try {
    data = await NotificationSubscription.findOneAndUpdate(
      { user: id },
      { $set: query },
      { new: true, upsert: true }
    );
    if (!data) {
      throw new Error('Not exist');
    }
  } catch (error) {
    throw new Error(error);
  }
  return data;
}

async function deleteOne(id) {
  let data = [];
  try {
    data = await NotificationSubscription.deleteOne({ _id: id });
  } catch (error) {
    throw new Error(error);
  }
  return data;
}
