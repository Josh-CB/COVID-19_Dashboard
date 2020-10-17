'use strict'
const fetchUKData = require('../modules/FetchUKData')
module.exports = async (ctx) => {
    const data = fetchUKData.UK()
    await ctx.render('uk-homepage', {
        overviewData: data[0], 
        casesGraphData: data[1], 
        deathsGraphData: data[2],
        engData: data[3],
        scoData: data[4],
        walData: data[5],
        niData: data[6],
        testsGraphData: data[7],
        hospitalGraphData: data[8],
        inHospitalGraphData: data[9]
    })
}