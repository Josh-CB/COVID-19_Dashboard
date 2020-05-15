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
    await ctx.render('./country', {
        id: ctx.params.id, 
        name: Convert.convert(id),
        caseData: GraphCountryData.cases(readData[id]),
        deathData: GraphCountryData.deaths(readData[id])
    })
}