'''This python script retrieves new data from the ECDC, saves it to a file
   and then open the file, reads data and creates a new file of required data for the
   web app. It's scuffed but works.
'''
import requests
import json
import datetime

def getDateAWeekAgo(date):
    '''
    1) take date as string
    2) convert date string to datetime object
    3) find date 7 days ago
    4) convert back to string format
    '''
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
    f = open("data/raw_data.json", "w")
    f.write(data.text)
    f.close()
    print("retrieved and saved.")
except Exception as e:
    print("Exception: ", e)

f = open("data/raw_data.json", "r")
raw_data = f.read()
data = json.loads(raw_data)["records"]
f.close()
toWrite_raw = {}

countriesToInclude = ["GBR", "CHN", "ITA", "USA", "ESP"]
for record in data:
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

f = open("data/data.json", "w")
f.write(toWrite)
f.close()

f = open("data/lastUpdate.txt", "w")
lastUpdated = datetime.datetime.now().strftime("%d/%m/%Y %H:%M") + " UTC"
f.write(lastUpdated)
f.close()