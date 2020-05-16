import requests
import json
from bs4 import BeautifulSoup
import datetime
import os 
dir_path = os.path.dirname(os.path.realpath(__file__))

lastUpdated = datetime.datetime.now().strftime("%d/%m/%Y %H:%M") + " UTC"

URL = 'https://www.worldometers.info/coronavirus/'
page = requests.get(URL, timeout=5)

soup = BeautifulSoup(page.content, 'html.parser')
counters = soup.findAll('div', attrs={'class':'maincounter-number'})
worldometers = {}
worldometers['source'] = 'Worldometers'
worldometers['last-updated'] = lastUpdated
worldometers['url'] = 'https://www.worldometers.info/coronavirus/'
worldometers['cases'] = int(counters[0].find('span').text.replace(',', ''))
worldometers['deaths'] = int(counters[1].find('span').text.replace(',',''))

URL = 'https://www.worldometers.info/coronavirus/'
page = requests.get(URL, timeout=5)
table = BeautifulSoup(page.content, 'html.parser').find('table', attrs={'id':'main_table_countries_today'})
rows = table.find_all('tr')
countryData = {}
counter=0
for tr in rows:
    td = tr.find_all('td')
    row = [i.text for i in td]
    if len(row) != 15:
        continue
    if '\n' in row[1] or 'Total' in row[1] or 'World' in row[1]:
        continue
    else:
        country = row[1]
        countryData[counter] = {'country': country, 'cases': row[2], 'new_cases': row[3], 'deaths': row[4], 'new_deaths': row[5]}
        counter = counter + 1
data = json.dumps(worldometers)
countriesJSON = json.dumps(countryData)
print(datetime.datetime.now(), "Counters updated. Most recent data: Worldometers")



f = open('{}/counterData.json'.format(dir_path), 'w')
countryDataFile = open('{}/countryData.json'.format(dir_path), 'w')
f.write(data)
f.close()
countryDataFile.write(countriesJSON)
countryDataFile.close()
