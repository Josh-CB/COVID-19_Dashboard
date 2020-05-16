var fs = require('fs')
var Convert = require('../modules/Convert')
var GraphCountryData = require('../modules/GraphCountryData')
module.exports.country = async (ctx) => {
    readDataBuf = fs.readFileSync('./data/countryGraphData.json', (err, data) => {
        if(err) throw err;
        return data
    })
    
    readData = JSON.parse(readDataBuf.toString('utf-8'))
    let id = ctx.params.id
    let cases = GraphCountryData.cases(readData[id])
    let deaths = GraphCountryData.deaths(readData[id])
    console.log(deaths)
    await ctx.render('./country', {
        id: ctx.params.id, 
        name: Convert.convert(id),
        caseData: cases,
        deathData: deaths
    })
}