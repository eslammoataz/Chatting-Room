const moment = require('moment-timezone');

module.exports = function formatMessage(user, text) {
  // Set the timezone to 'Africa/Cairo' for Egypt
  const timezone = 'Africa/Cairo';

  return {
    user,
    text,
    time: moment().tz(timezone).format('h:mm a'),
  };
};
