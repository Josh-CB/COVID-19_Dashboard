import csv
import os
import requests
import codecs
import json
import datetime
from contextlib import closing

dir_path = os.path.dirname(os.path.realpath(__file__))

currentTableDataFile = open("{}/countryTableData.json".format(dir_path), "r")
currentTableData = json.loads(currentTableDataFile.read())
currentTableDataFile.close()

def fixNull(val):
    if val=='':
        return 0
    else:
        return int(float(val))

print(str(datetime.datetime.now()) + " Fetching table data...")

tableData = {}
previousRow = [0, 0, 0, 0]
countryGraph = {}

with closing(requests.get('https://covid.ourworldindata.org/data/owid-covid-data.csv', stream=True)) as owidResponse:
    '''
    Fetch table data from Our World in Data. This data is used on the homepage in a table of headline figures for every country.
    '''
    reader = csv.reader(codecs.iterdecode(owidResponse.iter_lines(), 'utf-8'), delimiter=',')
    line = 0
    headers = []
    for row in reader:
        
        if line == 0:
            headers = row
            line += 1
            continue
        country = row[2]
        
        # construct data for graphs on country detail pages
        if country not in countryGraph.keys():
            countryGraph[country] = {}
        else:
            countryGraph[country][datetime.datetime.strptime(row[3], '%Y-%m-%d').strftime('%d/%m/%Y')] = {'totalCasesToDate': fixNull(row[4]), 'newCases': fixNull(row[5]), 'totalDeathsToDate': fixNull(row[7]), 'newDeaths': fixNull(row[8])}
        
        tableData[country] = {'cases': fixNull(row[4]), 'new_cases': fixNull(row[5]), 'deaths': fixNull(row[7]), 'new_deaths': fixNull(row[8])}
        # OWID sometimes release incomplete data with some countries not updated and no new data included. This checks for that issue and sets values to previous day if it occurs.
        if (fixNull(row[4])==0) and (fixNull(row[5])==0) and (fixNull(row[7])==0) and (fixNull(row[8])==0):
            tableData[country] = {'cases': fixNull(previousRow[0]), 'new_cases': fixNull(previousRow[1]), 'deaths': fixNull(previousRow[2]), 'new_deaths': fixNull(previousRow[3])}
        else:
            tableData[country] = {'cases': fixNull(row[4]), 'new_cases': fixNull(row[5]), 'deaths': fixNull(row[7]), 'new_deaths': fixNull(row[8])}
        previousRow = [row[4], row[5], row[7], row[8]]
        line += 1

tableDataJSON = json.dumps(tableData)
tableFile = open("{}/countryTableData.json".format(dir_path), "w")
tableFile.write(tableDataJSON)
tableFile.close()

countryGraphJSON = json.dumps(countryGraph)
f = open("{}/countryGraphData.json".format(dir_path), "w")
f.write(countryGraphJSON)
f.close()

if currentTableData != tableData:
    print("new update!")
    f = open("{}/lastUpdatedTable.txt".format(dir_path), "w")
    f.write(datetime.datetime.now().strftime("%d/%m/%Y %H:%M") + " UTC")
    f.close()
else:
    print("no update.")

print(str(datetime.datetime.now()) + " Finished updating table data")