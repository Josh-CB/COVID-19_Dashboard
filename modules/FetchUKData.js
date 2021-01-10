var fs = require('fs');
module.exports.UK = function() {
    const ukData = fs.readFileSync('./data/ukOverview.json',(err, data) => {
        if(err) throw err;
        return JSON.parse(JSON.parse(data.toString('utf-8')))
    })
    const parsedData = JSON.parse(ukData.toString('utf-8'))
    const latestOverviewData = [parsedData[0], parsedData[1], parsedData[2]]

    const latestVaccineData = {}

    const casesGraphData = []
    const deathsGraphData = []
    const testsGraphData = []
    const hospAdmissionsGraphData = []
    const inHospitalGraphData = []
    const mvBedsGraphData = []
    //latest vaccine data (published weekly)
    for(var date=0; date<parsedData.length; date++) {
        if(parsedData[date].vaccines.cumPeopleReceivingFirstDose!=null) {
            latestVaccineData.cumPeopleReceivingFirstDose = parsedData[date].vaccines.cumPeopleReceivingFirstDose;
            latestVaccineData.cumPeopleReceivingSecondDose = parsedData[date].vaccines.cumPeopleReceivingSecondDose;
            break
        }
    }
    //graph data
    for(var date = 0; date<parsedData.length; date++) {
        let casesSMAVal, deathsSMAVal, casesSpecSMAVal, admissionsSMAVal, inHospitalSMAVal, mvBedsSMAVal = 0
        if(date > 2 && date < parsedData.length-3) { //for case and death data (reported daily)
            const sumFutureCases = parsedData[date-1].cases.daily + parsedData[date-2].cases.daily + parsedData[date-3].cases.daily
            const sumPastCases = parsedData[date+1].cases.daily + parsedData[date+2].cases.daily + parsedData[date+3].cases.daily
            casesSMAVal = Math.round(((sumFutureCases + parsedData[date].cases.daily + sumPastCases) / 7))
            const sumFutureDeaths = parsedData[date-1].deaths.daily + parsedData[date-2].deaths.daily + parsedData[date-3].deaths.daily
            const sumPastDeaths = parsedData[date+1].deaths.daily + parsedData[date+2].deaths.daily + parsedData[date+3].deaths.daily
            deathsSMAVal = Math.round(((sumFutureDeaths + parsedData[date].deaths.daily + sumPastDeaths) / 7))
            const sumFutureSpecCases = parsedData[date-1].cases.daily + parsedData[date-2].cases.daily + parsedData[date-3].cases.dailySpec
            const sumPastSpecCases = parsedData[date+1].cases.daily + parsedData[date+2].cases.daily + parsedData[date+3].cases.dailySpec
            casesSpecSMAVal = Math.round(((sumFutureSpecCases + parsedData[date].cases.dailySpec + sumPastSpecCases) / 7))     
            if (parsedData[date-1].hospital.newAdmissions && parsedData[date-2].hospital.newAdmissions && parsedData[date-3].hospital.newAdmissions &&
                parsedData[date+1].hospital.newAdmissions && parsedData[date+2].hospital.newAdmissions && parsedData[date+3].hospital.newAdmissions) {    // for hospital admission data (check for +3 days and -3 days)        
                const sumFutureHospitalAdmissions = parsedData[date-1].hospital.newAdmissions + parsedData[date-2].hospital.newAdmissions + parsedData[date-3].hospital.newAdmissions
                const sumPastHospitalAdmissions = parsedData[date+1].hospital.newAdmissions + parsedData[date+2].hospital.newAdmissions + parsedData[date+3].hospital.newAdmissions
                admissionsSMAVal = Math.round(((sumFutureHospitalAdmissions + parsedData[date].hospital.newAdmissions + sumPastHospitalAdmissions) / 7))
            } else {
                admissionsSMAVal = "null"
            }
            if (parsedData[date-1].hospital.totalInHospital && parsedData[date-2].hospital.totalInHospital && parsedData[date-3].hospital.totalInHospital &&
                parsedData[date+1].hospital.totalInHospital && parsedData[date+2].hospital.totalInHospital && parsedData[date+3].hospital.totalInHospital) { // for total in hospital (check for +3 days and -3 days) 
                const sumFutureTotalInHospital = parsedData[date-1].hospital.totalInHospital + parsedData[date-2].hospital.totalInHospital + parsedData[date-3].hospital.totalInHospital
                const sumPastTotalInHospital = parsedData[date+1].hospital.totalInHospital + parsedData[date+2].hospital.totalInHospital + parsedData[date+3].hospital.totalInHospital
                inHospitalSMAVal = Math.round(((sumFutureTotalInHospital + parsedData[date].hospital.totalInHospital + sumPastTotalInHospital) / 7))
            } else {
                inHospitalSMAVal = "null"
            }
            if (parsedData[date-1].hospital.covidOccupiedMVBeds && parsedData[date-2].hospital.covidOccupiedMVBeds && parsedData[date-3].hospital.covidOccupiedMVBeds &&
                parsedData[date+1].hospital.covidOccupiedMVBeds && parsedData[date+2].hospital.covidOccupiedMVBeds && parsedData[date+3].hospital.covidOccupiedMVBeds) { // for patients in mv beds (check for +3 days and -3 days) 
                const sumFutureTotalInMvBeds = parsedData[date-1].hospital.covidOccupiedMVBeds + parsedData[date-2].hospital.covidOccupiedMVBeds + parsedData[date-3].hospital.covidOccupiedMVBeds
                const sumPastTotalInMvBeds = parsedData[date+1].hospital.covidOccupiedMVBeds + parsedData[date+2].hospital.covidOccupiedMVBeds + parsedData[date+3].hospital.covidOccupiedMVBeds
                mvBedsSMAVal = Math.round(((sumFutureTotalInMvBeds + parsedData[date].hospital.covidOccupiedMVBeds + sumPastTotalInMvBeds) / 7))
            } else {
                mvBedsSMAVal = "null"
            }
        } else {
            casesSMAVal = "null"
            deathsSMAVal = "null"
            casesSpecSMAVal = "null"      
        }   
        
        if(parsedData[date].cases.cumulative<=0) continue //track all metrics from day of first case
        casesGraphData.push({date: parsedData[date].date, 
            dailyCases: parsedData[date].cases.daily,
            dailySpecCases: parsedData[date].cases.dailySpec||"null",
            smaSpecVal: casesSpecSMAVal,
            cumulativeSpecCases: parsedData[date].cases.cumulativeSpec||"null",
            cumulativeCases: parsedData[date].cases.cumulative,
            smaVal: casesSMAVal
        })
        if(parsedData[date].tests.newPillarOneTestsByPublishDate!=undefined) {
            testsGraphData.push({date: parsedData[date].date,
                pillarOne: parsedData[date].tests.newPillarOneTestsByPublishDate,
                pillarTwo: parsedData[date].tests.newPillarTwoTestsByPublishDate,
                pillarThree: parsedData[date].tests.newPillarThreeTestsByPublishDate||"null",
                pillarFour: parsedData[date].tests.newPillarFourTestsByPublishDate||"null",
            })
        }
        if(parsedData[date].deaths.cumulative==undefined) {
            deathsGraphData.push({date: parsedData[date].date, 
                dailyDeaths: parsedData[date].deaths.daily,
                cumulativeDeaths: 0,
                smaVal: deathsSMAVal
            })
        } else {
            deathsGraphData.push({date: parsedData[date].date, 
                dailyDeaths: parsedData[date].deaths.daily,
                cumulativeDeaths: parsedData[date].deaths.cumulative,
                smaVal: deathsSMAVal
            })
        }
        if(parsedData[date].hospital.newAdmissions!=undefined) {
            hospAdmissionsGraphData.push({date: parsedData[date].date,
                newAdmissions: parsedData[date].hospital.newAdmissions,
                cumAdmissions: parsedData[date].hospital.cumAdmissions||"null",
                admissionsSmaVal: admissionsSMAVal
            })
        }
        if(parsedData[date].hospital.totalInHospital!=undefined) {
            inHospitalGraphData.push({date: parsedData[date].date,
                totalInHospital: parsedData[date].hospital.totalInHospital||"null",
                totalInHospSmaVal: inHospitalSMAVal||"null"
            })
        } 
        if(parsedData[date].hospital.covidOccupiedMVBeds!=undefined) {
            mvBedsGraphData.push({date: parsedData[date].date,
                totalInMvBeds: parsedData[date].hospital.covidOccupiedMVBeds||"null",
                totalInMvBedsSmaVal: mvBedsSMAVal||"null"
            })
        } 
}
    revCasesGraphData = Object.assign([], casesGraphData).reverse();
    revDeathsGraphData = Object.assign([], deathsGraphData).reverse();
    return([latestOverviewData, revCasesGraphData, revDeathsGraphData, testsGraphData, hospAdmissionsGraphData, inHospitalGraphData, latestVaccineData, mvBedsGraphData])
}

module.exports.country = function(country) {
    const countries = {
        "england": "England",
        "scotland": "Scotland",
        "wales": "Wales",
        "northern-ireland": "NorthernIreland"
    }
    const filename = `./data/${countries[country]}Data.json`
    const data = fs.readFileSync(filename,(err, data) => {
        if(err) throw err;
        return JSON.parse(JSON.parse(data.toString('utf-8')))
    })
    const parsedData = JSON.parse(data.toString('utf-8'))
    const latestOverviewData = [parsedData[0], parsedData[1], parsedData[2]]
    return latestOverviewData
}