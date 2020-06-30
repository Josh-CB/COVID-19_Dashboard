'''This python script retrieves new data from the ECDC, saves it to a file
   and then open the file, reads data and creates a new file of required data for the
   web app. It's scuffed but works.
   Changelog:
   28/6/20: Fixed an issue where memory ran out on AWS instance due to loading of the large JSON file, which only became an issue as time went on. Now uses ijson to read file as a stream rather than all at once.
'''
import requests
import json
import datetime
import os 
import ijson
import urllib.request
dir_path = os.path.dirname(os.path.realpath(__file__))

print(str(datetime.datetime.now()) + " Starting ECDC data fetch...")
def getDateAWeekAgo(date):
    datetimeDate = datetime.datetime.strptime(date, '%d/%m/%Y')
    datetimeSevenDaysAgo = datetimeDate - datetime.timedelta(days=7)
    minimumDate = datetime.datetime(2019, 12, 31)
    if datetimeSevenDaysAgo < minimumDate:
        datetimeSevenDaysAgo = datetime.datetime(2019, 12, 31)
    stringSevenDaysAgo = datetimeSevenDaysAgo.strftime("%d/%m/%Y")
    return stringSevenDaysAgo

toWrite_raw = {}
totalWorldDeaths = 0
totalWorldCases = 0
countriesToInclude = ["GBR", "CHN", "ITA", "USA", "ESP", "KOR", "DEU", "JPN", "SWE", "CHE", "FRA", "IRL", "NLD", "CAN", "RUS", "BRA", "IND"]
allCountriesRaw = {}

url = urllib.request.urlopen("https://opendata.ecdc.europa.eu/covid19/casedistribution/json/")
data = ijson.items(url, 'records.item')
for record in data:
    totalWorldDeaths = totalWorldDeaths + int(record["deaths"])
    totalWorldCases = totalWorldCases + int(record["cases"])
    if record["countryterritoryCode"] in countriesToInclude:
        country = record["countryterritoryCode"]
        newDeaths = int(record["deaths"])
        newCases = int(record["cases"])
        if record["countryterritoryCode"] in toWrite_raw.keys():
            toWrite_raw[record["countryterritoryCode"]][record["dateRep"]] = {"newDeaths": newDeaths, "newCases": newCases}
        else:
            toWrite_raw[record["countryterritoryCode"]] = {record["dateRep"]: {"newDeaths": newDeaths, "newCases": newCases}}
    country = record['countriesAndTerritories']
    newDeaths = int(record['deaths'])
    newCases = int(record['cases'])
    if record['countriesAndTerritories'] in allCountriesRaw.keys():
        allCountriesRaw[record['countriesAndTerritories']][record['dateRep']] = {"newDeaths": newDeaths, "newCases": newCases}
    else:
        allCountriesRaw[record['countriesAndTerritories']] = {record["dateRep"]: {"newDeaths": newDeaths, "newCases": newCases}}


def dateLoop(listDates, totalCases, totalDeaths):
    for pair in listDates:
        date = pair[0]
        dateDict = pair[1]
        totalDeaths = totalDeaths + dateDict["newDeaths"]
        totalCases = totalCases + dateDict["newCases"]
        allCountriesRaw[country][date]["totalDeathsToDate"] = totalDeaths
        allCountriesRaw[country][date]["totalCasesToDate"] = totalCases
        if date == datetime.date.today().strftime("%d/%m/%Y") or date==(datetime.date.today()-datetime.timedelta(days=1)).strftime("%d/%m/%Y"):
            newCases = dateDict["newCases"]
            newDeaths = dateDict["newDeaths"]
            return{'country': country, 'cases': f"{totalCases:,d}", 'new_cases': f"{newCases:,d}", 'deaths': f"{totalDeaths:,d}", 'new_deaths': f"{newDeaths:,d}"}

counter = 0
tableData = {}
for country in allCountriesRaw:
    totalDeaths = 0
    totalCases = 0
    listDates = list(allCountriesRaw[country].items())
    listDates.sort(key=lambda x: datetime.datetime.strptime(x[0], '%d/%m/%Y'))
    tableData[counter] = dateLoop(listDates, totalCases, totalDeaths)
    counter = counter + 1
    continue
    
allCountriesJSON = json.dumps(allCountriesRaw)
f = open("{}/countryGraphData.json".format(dir_path), "w")
f.write(allCountriesJSON)
f.close()

tableDataJSON = json.dumps(tableData)
tableFile = open("{}/countryTableData.json".format(dir_path), "w")
tableFile.write(tableDataJSON)
tableFile.close()




for country in countriesToInclude:
    totalDeaths = 0
    totalCases = 0
    listDates = list(toWrite_raw[country].items())
    listDates.sort(key=lambda x: datetime.datetime.strptime(x[0], '%d/%m/%Y'))
    for pair in listDates:
        date = pair[0]
        dateDict = pair[1]
        totalDeaths = totalDeaths + dateDict["newDeaths"]
        totalCases = totalCases + dateDict["newCases"]
        toWrite_raw[country][date]["totalDeathsToDate"] = totalDeaths
        toWrite_raw[country][date]["totalCasesToDate"] = totalCases

for country in toWrite_raw:
    for date in toWrite_raw[country]:
        deathsUpToToday = toWrite_raw[country][date]["totalDeathsToDate"]
        casesUpToToday = toWrite_raw[country][date]["totalCasesToDate"]
        dateWeekAgo = getDateAWeekAgo(date)
        
        try:
            deathsAWeekAgo = toWrite_raw[country][dateWeekAgo]["totalDeathsToDate"]
            casesAWeekAgo = toWrite_raw[country][dateWeekAgo]["totalCasesToDate"]
            weeklyDeaths = deathsUpToToday - deathsAWeekAgo
            weeklyCases = casesUpToToday - casesAWeekAgo
        except:
            continue
        toWrite_raw[country][date]["totalDeathsInLastWeek"] = weeklyDeaths
        toWrite_raw[country][date]["totalCasesInLastWeek"] = weeklyCases

toWrite = json.dumps(toWrite_raw)

f = open("{}/data.json".format(dir_path), "w")
f.write(toWrite)
f.close()

f = open("{}/lastUpdate.txt".format(dir_path), "w")
lastUpdated = datetime.datetime.now().strftime("%d/%m/%Y %H:%M") + " UTC"
f.write(lastUpdated)
f.close()

worlddata = {
    "totalCases": totalWorldCases,
    "totalDeaths": totalWorldDeaths
}
worlddata = json.dumps(worlddata)
f=open("{}/worlddata.json".format(dir_path), "w")
f.write(worlddata)
f.close()

print(str(datetime.datetime.now()) + " Finished updated graph and country data")
