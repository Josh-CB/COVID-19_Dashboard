var fs = require('fs')
var Convert = require('../modules/Convert')
var GraphCountryData = require('../modules/GraphCountryData')
var FetchData = require('../modules/FetchData')
module.exports.country = async (ctx) => {
    readDataBuf = fs.readFileSync('./data/countryGraphData.json', (err, data) => {
        if(err) throw err;
        return data
    })
    const countryTabData = FetchData.countryTableData()
    readData = JSON.parse(readDataBuf.toString('utf-8'))
    const id = ctx.params.id.replace(/-/g, ' ')
    const cases = GraphCountryData.cases(readData[id])
    const casesCumulative = cases[0]
    const casesDaily = cases[1]
    const deaths = GraphCountryData.deaths(readData[id])
    const deathsCumulative = deaths[0]
    const deathsDaily = deaths[1]

    await ctx.render('./country', {
        id: ctx.params.id, 
        name: id.replace(/-/g, ' '),
        caseData: casesCumulative,
        caseDailyData: casesDaily,
        deathData: deathsCumulative,
        deathDailyData: deathsDaily,
        countryData: countryTabData
    })
}