var fs = require('fs');
module.exports.fetchData = function() {
    readData = fs.readFileSync('./data/data.json', (err, data) => {
        if(err) throw err;
        return data
    })
    
    lastUpdate = fs.readFileSync('./data/lastUpdate.txt', (err, data) => {
        if(err) throw err;
        return data
    })

    worldData = fs.readFileSync('./data/worlddata.json', (err, data) => {
        if(err) throw err;
        return data
    })

    counterData = fs.readFileSync('./data/counterData.json', (err, data) => {
        if(err) throw err;
        return data
    })

    let deathData = {} 
    let caseData = {}

    readDataJSON = JSON.parse(readData)

    dates = {}
    for(const country in readDataJSON){
        deathData[country] = []
        caseData[country] =[]
        dates[country] = []
        for(const date in readDataJSON[country]){
            if(readDataJSON[country][date]["totalDeathsToDate"] < 100){
                continue
            }
            else {
                dates[country].push(date)
                deathData[country].push({x: readDataJSON[country][date]["totalDeathsToDate"], y: readDataJSON[country][date]["totalDeathsInLastWeek"]})
            }
        }
        for(const date in readDataJSON[country]){
            if(readDataJSON[country][date]["totalCasesToDate"] < 100){
                continue
            }
            else {
                caseData[country].push({x: readDataJSON[country][date]["totalCasesToDate"], y: readDataJSON[country][date]["totalCasesInLastWeek"]})
            }
        }
    }

    counterDataJSON = JSON.parse(counterData)
    counterDataJSON['cases'] = counterDataJSON['cases'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    counterDataJSON['deaths'] = counterDataJSON['deaths'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")


    return [deathData, dates, lastUpdate, counterDataJSON, caseData]
}

module.exports.cases = () => {
    counterData = fs.readFileSync('./data/counterData.json', (err, data) => {
        if(err) throw err;
        return data
    })
    counterDataJSON = JSON.parse(counterData)
    counterDataJSON['cases'] = counterDataJSON['cases'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return counterDataJSON['cases']
}

module.exports.deaths = () => {
    counterData = fs.readFileSync('./data/counterData.json', (err, data) => {
        if(err) throw err;
        return data
    })
    counterDataJSON = JSON.parse(counterData)
    counterDataJSON['deaths'] = counterDataJSON['deaths'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return counterDataJSON['deaths']
}