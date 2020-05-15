'use strict'
const FetchData = require('../modules/FetchData')
module.exports.cases = async (ctx) => {
    await ctx.render('counter', {count: await FetchData.cases()})
}
module.exports.deaths = async (ctx) => {
    await ctx.render('counter', {count: await FetchData.deaths()})
}