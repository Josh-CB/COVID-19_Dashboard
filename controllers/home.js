'use strict'
const fetchData = require('../modules/FetchData.js')
module.exports.home = async(ctx) => {
    let fetchedData = await fetchData.fetchData()
    var data = fetchedData[0]
    var dates = fetchedData[1]
    var lastUpdated = fetchedData[2]
    var counterdata = fetchedData[3]
    let caseData = fetchedData[4]
    await ctx.render('./homepage', {
        dUKdata: data.GBR,
        dCHNdata: data.CHN,
        dITAdata: data.ITA,
        dUSAdata: data.USA,
        dESPdata: data.ESP,
        dKORdata: data.KOR,
        dDEUdata: data.DEU,
        dJPNdata: data.JPN,
        dSWEdata: data.SWE,
        cUKdata: caseData.GBR,
        cCHNdata: caseData.CHN,
        cITAdata: caseData.ITA,
        cUSAdata: caseData.USA,
        cESPdata: caseData.ESP,
        cKORdata: caseData.KOR,
        cDEUdata: caseData.DEU,
        cJPNdata: caseData.JPN,
        cSWEdata: caseData.SWE,
        dates: dates,
        lastUpdate: lastUpdated,
        counterdata: counterdata
    })
}