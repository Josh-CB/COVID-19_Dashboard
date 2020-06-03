module.exports.cases = function(countryData) {
    /*Array of objects: [{x: x, y: y},]*/
    let caseGraphData = []
    let dailyCases = []
    for(date in countryData) {
        let y = countryData[date]['totalCasesToDate']
        if(y>0) {
            caseGraphData.push({t: date, y: y})
        }
        y = countryData[date]['newCases']
        if(y>0) {
            dailyCases.push({t: date, y: y})
        }
    }
    return [caseGraphData, dailyCases]
}

module.exports.deaths = function(countryData) {
    /*Array of objects: [{x: x, y: y},]*/
    let deathGraphData = []
    let dailyDeaths = []
    for(date in countryData) {
        let y = countryData[date]['totalDeathsToDate']
        if(y>0) {
            deathGraphData.push({t: date, y: y})
        }
        y = countryData[date]['newDeaths']
        if(y>0) {
            dailyDeaths.push({t: date, y: y})
        }
        
    }
    return [deathGraphData, dailyDeaths]
}