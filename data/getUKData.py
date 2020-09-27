import requests, json, os
dir_path = os.path.dirname(os.path.realpath(__file__))
endpoint = 'https://api.coronavirus.data.gov.uk/v1/data?'

'''FETCH UK DATA'''

filters = [
    "areaType=overview",
]
structure = {
    "date": "date",
    "cases": {
        "daily": "newCasesByPublishDate",
        "cumulative": "cumCasesByPublishDate"
    },
    "deaths": {
        "daily": "newDeaths28DaysByPublishDate",
        "dailyByDeathDate": "newDeaths28DaysByDeathDate",
        "cumulative": "cumDeaths28DaysByPublishDate",
        "cumByDeathDate": "cumDeaths28DaysByDeathDate"
    },
    "tests": {
        "newPillarOneTestsByPublishDate":"newPillarOneTestsByPublishDate",
        "newPillarTwoTestsByPublishDate":"newPillarTwoTestsByPublishDate",
        "newPillarThreeTestsByPublishDate":"newPillarThreeTestsByPublishDate",
        "newPillarFourTestsByPublishDate":"newPillarFourTestsByPublishDate",
        "plannedCapacityByPublishDate":"plannedCapacityByPublishDate"
    },
}
api_params = {
    "filters": str.join(";", filters),
    "structure": json.dumps(structure, separators=(",", ":")),
}

response = json.loads(requests.get(endpoint, params=api_params, timeout=10).text)
ukFile = open("{}/ukOverview.json".format(dir_path), "w")
ukFile.write(json.dumps(response['data']))
ukFile.close()

'''FETCH ENG DATA'''
def fetchCountryData(country):
    filters = [
        "areaType=nation",
        f"areaName={ country }"
    ]
    structure = {
        "date": "date",
        "cases": {
            "daily": "newCasesByPublishDate",
            "cumulative": "cumCasesByPublishDate"
        },
        "deaths": {
            "daily": "newDeaths28DaysByPublishDate",
            "dailyByDeathDate": "newDeaths28DaysByDeathDate",
            "cumulative": "cumDeaths28DaysByPublishDate",
            "cumByDeathDate": "cumDeaths28DaysByDeathDate"
        },
        "tests": {
            "newPillarOneTestsByPublishDate":"newPillarOneTestsByPublishDate",
            "newPillarTwoTestsByPublishDate":"newPillarTwoTestsByPublishDate",
        },
        "healthcare": {
            "newAdmissions": "newAdmissions",
            "cumAdmissions": "cumAdmissions",
            "cumAdmissionsByAge":"cumAdmissionsByAge"
        }
    }
    api_params = {
        "filters": str.join(";", filters),
        "structure": json.dumps(structure, separators=(",", ":")),
    }
    response = json.loads(requests.get(endpoint, params=api_params, timeout=10).text)
    countryFile = open("%s/%sData.json" % (dir_path, country.replace(' ','')), "w")
    countryFile.write(json.dumps(response['data']))
    countryFile.close()

for country in ["England", "Scotland", "Wales", "Northern Ireland"]:
    print("fetching data for ", country)
    fetchCountryData(country)