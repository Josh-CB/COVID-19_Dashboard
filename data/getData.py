'''This python script retrieves new data from the ECDC, saves it to a file
   and then open the file, reads data and creates a new file of required data for the
   web app. It's scuffed but works.
'''
import requests
import json
import datetime
import os 
dir_path = os.path.dirname(os.path.realpath(__file__))

def getDateAWeekAgo(date):
    datetimeDate = datetime.datetime.strptime(date, '%d/%m/%Y')
    datetimeSevenDaysAgo = datetimeDate - datetime.timedelta(days=7)
    minimumDate = datetime.datetime(2019, 12, 31)
    if datetimeSevenDaysAgo < minimumDate:
        datetimeSevenDaysAgo = datetime.datetime(2019, 12, 31)
    stringSevenDaysAgo = datetimeSevenDaysAgo.strftime("%d/%m/%Y")
    return stringSevenDaysAgo

try:
    url = "https://opendata.ecdc.europa.eu/covid19/casedistribution/json/"
    data = requests.get(url)
    f = open("{}/raw_data.json".format(dir_path), "w")
    f.write(data.text)
    f.close()
    print("retrieved and saved.")
except Exception as e:
    print("Exception: ", e)

f = open("{}/raw_data.json".format(dir_path), "r")
raw_data = f.read()
data = json.loads(raw_data)["records"]
f.close()
toWrite_raw = {}

totalWorldDeaths = 0
totalWorldCases = 0
countriesToInclude = ["GBR", "CHN", "ITA", "USA", "ESP", "KOR", "DEU", "JPN"]
for record in data:
    totalWorldDeaths = totalWorldDeaths + int(record["deaths"])
    totalWorldCases = totalWorldCases + int(record["cases"])
    if record["countryterritoryCode"] in countriesToInclude:
        country = record["countryterritoryCode"]
        newDeaths = int(record["deaths"])
        if record["countryterritoryCode"] in toWrite_raw.keys():
            toWrite_raw[record["countryterritoryCode"]][record["dateRep"]] = {"newDeaths": newDeaths}
        else:
            toWrite_raw[record["countryterritoryCode"]] = {record["dateRep"]: {"newDeaths": newDeaths}}

for country in countriesToInclude:
    totalDeaths = 0
    listDates = list(toWrite_raw[country].items())
    listDates.sort(key=lambda x: datetime.datetime.strptime(x[0], '%d/%m/%Y'))
    for pair in listDates:
        date = pair[0]
        dateDict = pair[1]
        totalDeaths = totalDeaths + dateDict["newDeaths"]
        toWrite_raw[country][date]["totalDeathsToDate"] = totalDeaths

for country in toWrite_raw:
    for date in toWrite_raw[country]:
        deathsUpToToday = toWrite_raw[country][date]["totalDeathsToDate"]
        dateWeekAgo = getDateAWeekAgo(date)
        deathsAWeekAgo = toWrite_raw[country][dateWeekAgo]["totalDeathsToDate"]
        weeklyDeaths = deathsUpToToday - deathsAWeekAgo
        toWrite_raw[country][date]["totalDeathsInLastWeek"] = weeklyDeaths

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
