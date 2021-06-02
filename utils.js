const uuidv4 = require('uuid').v4;
const moment = require('moment')

const uuid = () => {
  return uuidv4().split('-')[0]
}

const currentTime = () => {
  return moment().format('YYYY-MM-DD HH:mm:ss')
}

module.exports = {uuid, currentTime}