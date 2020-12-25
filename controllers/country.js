var fs = require('fs')
var Convert = require('../modules/Convert')
var GraphCountryData = require('../modules/GraphCountryData')
var FetchData = require('../modules/FetchData')
module.exports.country = async (ctx) => {
    readDataBuf = fs.readFileSync('./data/countryGraphData.json', (err, data) => {
        if(err) throw err;
        return data
    })
    
    readData = JSON.parse(readDataBuf.toString('utf-8'))
    const id = ctx.params.id.replace(/_/g, ' ')
    const countryTabData = FetchData.countryTableData()
    const cases = GraphCountryData.cases(readData[id])
    const casesCumulative = cases[0]
    const casesDaily = cases[1]
    const deaths = GraphCountryData.deaths(readData[id])
    const deathsCumulative = deaths[0]
    const deathsDaily = deaths[1]
    const countries = Object.keys(countryTabData)
    if(!countries.includes(id)) {
        ctx.body = 'Invalid country name.';
        return
    }
    lastUpdate = fs.readFileSync('./data/lastUpdatedTable.txt', (err, data) => {
        if(err) throw err;
        return data
    })

    await ctx.render('./country', {
        id: ctx.params.id, 
        name: id.replace(/-/g, ' '),
        caseData: casesCumulative,
        caseDailyData: casesDaily,
        deathData: deathsCumulative,
        deathDailyData: deathsDaily,
        countryData: countryTabData[id],
        countries: countries,
        lastUpdate: lastUpdate
    })
}