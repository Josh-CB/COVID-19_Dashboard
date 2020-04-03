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
counters = BeautifulSoup(page.content, 'html.parser').findAll('td', attrs={'class':'s6'})
bno = {}
bno['source'] = 'BNO News'
bno['last-updated'] = lastUpdated
bno['url'] = 'https://bnonews.com/index.php/2020/04/the-latest-coronavirus-cases/'
bno['cases'] = int(counters[0].text.replace(',',''))
bno['deaths'] = int(counters[1].text.replace(',',''))

f = open('{}/counterData.json'.format(dir_path), 'w')
if bno['cases'] > worldometers['cases']:
    data = json.dumps(bno)
    print("Counters updated. Most recent data: BNO News")
else:
    data = json.dumps(worldometers)
    print("Counters updated. Most recent data: Worldometers")
f.write(data)
f.close()
