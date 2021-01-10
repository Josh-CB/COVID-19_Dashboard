'use strict'
const fetchUKData = require('../modules/FetchUKData')
module.exports = async (ctx) => {
    const data = fetchUKData.UK()
    await ctx.render('uk-homepage', {
        overviewData: data[0], 
        casesGraphData: data[1], 
        deathsGraphData: data[2],
        testsGraphData: data[3],
        hospitalGraphData: data[4],
        inHospitalGraphData: data[5],
        vaccineData: data[6],
        mvBedsGraphData: data[7]
    })
}