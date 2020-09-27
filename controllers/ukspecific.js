'use strict'
const fetchUKData = require('../modules/FetchUKData')
module.exports = async (ctx) => {
    const countries = {
        "england": "England",
        "scotland": "Scotland",
        "wales": "Wales",
        "northern-ireland": "Northern Ireland"
    }
    const name = countries[ctx.params.country]
    const data = fetchUKData.country(ctx.params.country)
    await ctx.render('uk-specific', {name: name, overviewData: data
    })
}