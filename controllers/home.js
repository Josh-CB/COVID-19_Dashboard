'use strict'
const fetchData = require('../modules/FetchData.js')
module.exports.home = async(ctx) => {
    let fetchedData = await fetchData.fetchData()
    var data = fetchedData[0]
    var dates = fetchedData[1]
    var lastUpdated = fetchedData[2]
    var counterdata = fetchedData[3]
    await ctx.render('./homepage', {
        UKdata: data.GBR,
        CHNdata: data.CHN,
        ITAdata: data.ITA,
        USAdata: data.USA,
        ESPdata: data.ESP,
        KORdata: data.KOR,
        DEUdata: data.DEU,
        JPNdata: data.JPN,
        dates: dates,
        lastUpdate: lastUpdated,
        counterdata: counterdata
    })
}