'use strict'
const FetchData = require('../modules/FetchData')
module.exports.cases = () => {
    return FetchData.cases
}
module.exports.deaths = () => {
    return FetchData.deaths
}