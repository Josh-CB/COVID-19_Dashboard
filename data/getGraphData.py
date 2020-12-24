'''
Script retrieves cases and deaths data from JHU's CSSE COVID-19 data repository (https://github.com/CSSEGISandData/COVID-19/) and saves relevant data to files for graphs and table.
Changelong:
--24/12/20: File created. Original file used ECDC data, which is now only updated weekly. This is a much more efficient, tidier script that uses a more reliable data source.
'''
import csv
import os
import requests
import codecs
import datetime
import json
from contextlib import closing

dir_path = os.path.dirname(os.path.realpath(__file__))

print(str(datetime.datetime.now()) + " Starting JHU CSSE data fetch...")

def getDateAWeekAgo(date):
    '''
    Takes a date as a string in the form dd/mm/YYYY and returns
    the date as a string 7 days ago.
    '''
    datetimeDate = datetime.datetime.strptime(date, '%d/%m/%Y')
    datetimeSevenDaysAgo = datetimeDate - datetime.timedelta(days=7)
    minimumDate = datetime.datetime(2020, 1, 22)
    if datetimeSevenDaysAgo < minimumDate:
        datetimeSevenDaysAgo = datetime.datetime(2020, 1, 22)
    stringSevenDaysAgo = datetimeSevenDaysAgo.strftime("%d/%m/%Y")
    return stringSevenDaysAgo

# countries to include in graphs
countriesToInclude = ["United Kingdom", "Italy", "US", "Spain", "Korea, South", "Germany", "Japan", "Sweden", "Switzerland", "France", "Ireland", "Netherlands", "Russia", "Brazil", "India"]

graphData = {}
with closing(requests.get('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv', stream=True)) as deathsResponse:
    '''
    Fetch deaths data from JHU's CSSE COVID-19 data repository (https://github.com/CSSEGISandData/COVID-19/). Lines in CSV file are retrieved iteratively to conserve memory.
    '''
    reader = csv.reader(codecs.iterdecode(deathsResponse.iter_lines(), 'utf-8'), delimiter=',')
    line = 0
    headers = []
    for row in reader:
        if line == 0:
            headers = row
        country = row[1]
        if country in countriesToInclude and row[0]=="":
            cols = len(row)
            graphData[country] = {}
            for col in range(0, cols):
                if col < 4: # province, country, lat, long, 1/22/20, 1/23/20...
                    continue
                date = datetime.datetime.strptime(headers[col], '%m/%d/%y').strftime('%d/%m/%Y') # convert US date to UK
                graphData[country][date] = {"totalDeathsToDate": int(row[col])}
                if date=="22/01/2020": # first date data is available for
                    graphData[country][date]['newDeaths'] = int(row[col])
                else:
                    dateYesterday = (datetime.datetime.strptime(date, '%d/%m/%Y') - datetime.timedelta(days=1)).strftime('%d/%m/%Y')
                    graphData[country][date]["newDeaths"] = int(row[col]) - int(graphData[country][dateYesterday]["totalDeathsToDate"])
        line += 1
    print(str(datetime.datetime.now()) + " Deaths fetch and processing complete.")

with closing(requests.get('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv', stream=True)) as casesResponse:
    '''
    Fetch cases data from JHU's CSSE COVID-19 data repository (https://github.com/CSSEGISandData/COVID-19/). Lines in CSV file are retrieved iteratively to conserve memory.
    '''
    reader = csv.reader(codecs.iterdecode(casesResponse.iter_lines(), 'utf-8'), delimiter=',')
    line = 0
    headers = []
    for row in reader:
        if line == 0:
            headers = row
        country = row[1]
        if country in countriesToInclude and row[0]=="":
            cols = len(row)
            for col in range(0, cols):
                if col < 4: # province, country, lat, long, 1/22/20, 1/23/20...
                    continue
                date = datetime.datetime.strptime(headers[col], '%m/%d/%y').strftime('%d/%m/%Y') # convert US date to UK
                graphData[country][date]["totalCasesToDate"] = int(row[col])
                if date=="22/01/2020":
                    graphData[country][date]['newCases'] = int(row[col])
                else:
                    dateYesterday = (datetime.datetime.strptime(date, '%d/%m/%Y') - datetime.timedelta(days=1)).strftime('%d/%m/%Y')
                    graphData[country][date]["newCases"] = int(row[col]) - int(graphData[country][dateYesterday]["totalCasesToDate"])
        line += 1
    print(str(datetime.datetime.now()) + " Cases fetch and processing complete.")

'''
Loop over countries and dates, setting and calculating new deaths/cases, deaths/cases in last week, and total deaths/cases up to that date.

'''
for country in graphData:
    for date in graphData[country]:
        if date=="22/01/2020": # first date available, set all values to beginning ones
            graphData[country][date]['newDeaths'] = int(graphData[country]["22/01/2020"]["totalDeathsToDate"])
            graphData[country][date]['totalDeathsToDate'] = int(graphData[country]["22/01/2020"]["totalDeathsToDate"])
            graphData[country][date]['totalDeathsInLastWeek'] = int(graphData[country]["22/01/2020"]["totalDeathsToDate"])
            graphData[country][date]['newCases'] = int(graphData[country]["22/01/2020"]["totalCasesToDate"])
            graphData[country][date]['totalCasesToDate'] = int(graphData[country]["22/01/2020"]["totalCasesToDate"])
            graphData[country][date]['totalCasesInLastWeek'] = int(graphData[country]["22/01/2020"]["totalCasesToDate"])
        else:
            dateWeekAgo = getDateAWeekAgo(date)
            deathsAWeekAgo = int(graphData[country][dateWeekAgo]["totalDeathsToDate"])
            dateYesterday = (datetime.datetime.strptime(date, '%d/%m/%Y') - datetime.timedelta(days=1)).strftime('%d/%m/%Y')
            newDeaths = int(graphData[country][date]["totalDeathsToDate"]) - int(graphData[country][dateYesterday]["newDeaths"])
            weeklyDeaths = int(graphData[country][date]["totalDeathsToDate"]) - deathsAWeekAgo
            graphData[country][date]["totalDeathsInLastWeek"] = weeklyDeaths
            casesAWeekAgo = int(graphData[country][dateWeekAgo]["totalCasesToDate"])
            newCases = int(graphData[country][date]["totalCasesToDate"]) - int(graphData[country][dateYesterday]["newCases"])
            weeklyCases = int(graphData[country][date]["totalCasesToDate"]) - casesAWeekAgo
            graphData[country][date]["totalCasesInLastWeek"] = weeklyCases

graphJSON = json.dumps(graphData)
f = open("{}/graphData.json".format(dir_path), "w")
f.write(graphJSON)
f.close()

f = open("{}/lastUpdate.txt".format(dir_path), "w")
lastUpdated = datetime.datetime.now().strftime("%d/%m/%Y %H:%M") + " UTC"
f.write(lastUpdated)
f.close()

print(str(datetime.datetime.now()) + " Finished updating graph data")