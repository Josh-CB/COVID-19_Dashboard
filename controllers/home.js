'use strict'
const fetchData = require('../modules/FetchData.js')
module.exports.home = async(ctx) => {
    let fetchedData = await fetchData.fetchData()
    var data = fetchedData[0]
    var dates = fetchedData[1]
    var lastUpdated = fetchedData[2]
    var counterdata = fetchedData[3]
    let caseData = fetchedData[4]
    let countryDataBuf = fetchedData[5]
    let countryData = JSON.parse(countryDataBuf.toString('utf-8'))
    await ctx.render('./homepage', {
        dUKdata: data['United Kingdom'],
        dITAdata: data['Italy'],
        dUSAdata: data['US'],
        dESPdata: data['Spain'],
        dKORdata: data['Korea, South'],
        dDEUdata: data['Germany'],
        dJPNdata: data['Japan'],
        dSWEdata: data['Sweden'],
        dCHEdata: data['Switzerland'],
        dFRAdata: data['France'],
        dNLDdata: data['Netherlands'],
        dRUSdata: data['Russia'],
        dBRAdata: data['Brazil'],
        dINDdata: data['India'],
        cUKdata: caseData['United Kingdom'],
        cITAdata: caseData['Italy'],
        cUSAdata: caseData['US'],
        cESPdata: caseData['Spain'],
        cKORdata: caseData['Korea, South'],
        cDEUdata: caseData['Germany'],
        cJPNdata: caseData['Japan'],
        cSWEdata: caseData['Sweden'],
        cCHEdata: caseData['Switzerland'],
        cFRAdata: caseData['France'],
        cNLDdata: caseData['Netherlands'],
        cRUSdata: caseData['Russia'],
        cBRAdata: caseData['Brazil'],
        cINDdata: caseData['India'],
        dates: dates,
        lastUpdate: lastUpdated,
        counterdata: counterdata,
        countryData: countryData
    })
}