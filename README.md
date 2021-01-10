# COVID-19_Dashboard

A comprehensive data dashboard providing insight on the COVID-19 pandemic. This project conists of:
- A frontpage (`/`) with a graph to compare different countries deaths and cases and a table of each individual country with the latest deaths and cases for each, as well as live-updating counters for worldwide deaths and cases
- Individual country detail pages with case and death data which are also graphed (`/country/{country name}`)
- Even more detailed and extensive statistics for the United Kingdom and its nations, namely testing and healthcare (`/uk`)

This project was deployed on an AWS EC2 instance and cron jobs set up to run the data fetch and processing scripts. The public version is available at [coviddash.digital](https://coviddash.digital). 

For international figures, it utilised data from the European Centre for Disease Prevention and Control (ECDC) up until 14th December, when they switched from daily updates to weekly updates. Now, data from [Our World in Data](https://github.com/owid/covid-19-data/tree/master/public/data)
and [JHU's CSSE](https://github.com/CSSEGISandData/COVID-19) is utilised instead. For the UK detailed data, data is pulled from the [GOV.UK coronavirus dashboard](https://coronavirus.data.gov.uk/).

The counters on the frontpage use [Worldometers' figures](https://www.worldometers.info/coronavirus/). 

This is an ongoing personal project with no financial benefit.
