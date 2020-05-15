import requests
import json
from bs4 import BeautifulSoup
import datetime
import os 
dir_path = os.path.dirname(os.path.realpath(__file__))

lastUpdated = datetime.datetime.now().strftime("%d/%m/%Y %H:%M") + " UTC"

URL = 'https://www.worldometers.info/coronavirus/'
page = requests.get(URL)

soup = BeautifulSoup(page.content, 'html.parser')
counters = soup.findAll('div', attrs={'class':'maincounter-number'})
worldometers = {}
worldometers['source'] = 'Worldometers'
worldometers['last-updated'] = lastUpdated
worldometers['url'] = 'https://www.worldometers.info/coronavirus/'
worldometers['cases'] = int(counters[0].find('span').text.replace(',', ''))
worldometers['deaths'] = int(counters[1].find('span').text.replace(',',''))

URL = 'https://docs.google.com/spreadsheets/u/0/d/e/2PACX-1vR30F8lYP3jG7YOq8es0PBpJIE5yvRVZffOyaqC0GgMBN6yt0Q-NI8pxS7hd1F9dYXnowSC6zpZmW9D/pubhtml/sheet?headers=false&gid=0&range=A1:I207'
page = requests.get(URL)
counters = BeautifulSoup(page.content, 'html.parser').findAll('td', attrs={'class':'s7'})
bno = {}
bno['source'] = 'BNO News'
bno['last-updated'] = lastUpdated
bno['url'] = 'https://bnonews.com/index.php/2020/04/the-latest-coronavirus-cases/'
bno['cases'] = int(counters[0].text.replace(',',''))
bno['deaths'] = int(counters[1].text.replace(',',''))


if bno['cases'] > worldometers['cases']:
    data = json.dumps(bno)
    print("Counters updated. Most recent data: BNO News")
else:
    URL = 'https://www.worldometers.info/coronavirus/'
    page = requests.get(URL)
    table = BeautifulSoup(page.content, 'html.parser').find('table', attrs={'id':'main_table_countries_today'})
    rows = table.find_all('tr')
    countryData = {}
    counter=0
    for tr in rows:
        td = tr.find_all('td')
        row = [i.text for i in td]
        print(row)
        if len(row) != 13:
            continue
        if '\n' in row[0] or 'Total' in row[0] or 'World' in row[0]:
            continue
        else:
            country = row[0]
            countryData[counter] = {'country': country, 'cases': row[1], 'new_cases': row[2], 'deaths': row[3], 'new_deaths': row[4]}
            counter = counter + 1
    print(countryData)
    data = json.dumps(worldometers)
    countriesJSON = json.dumps(countryData)
    print("Counters updated. Most recent data: Worldometers")



f = open('{}/counterData.json'.format(dir_path), 'w')
countryDataFile = open('{}/countryData.json'.format(dir_path), 'w')
f.write(data)
f.close()
countryDataFile.write(countriesJSON)
countryDataFile.close()
