module.exports.cases = function(countryData) {
    /*Array of objects: [{x: x, y: y},]*/
    let caseGraphData = []
    for(date in countryData) {
        let y = countryData[date]['totalCasesToDate']
        if(y<=0) {
            continue
        }
        caseGraphData.push({t: date, y: y})
    }
    return caseGraphData
}

module.exports.deaths = function(countryData) {
    /*Array of objects: [{x: x, y: y},]*/
    let deathGraphData = []
    for(date in countryData) {
        let y = countryData[date]['totalDeathsToDate']
        if(y<=0) {
            continue
        }
        deathGraphData.push({t: date, y: y})
    }
    return deathGraphData
}