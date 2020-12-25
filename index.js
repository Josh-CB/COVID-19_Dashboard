#!/usr/bin/env node
'use strict'
const Koa = require('koa')
const Router = require('koa-router')
const views = require('koa-views')
const staticDir = require('koa-static')
const bodyParser = require('koa-bodyparser')
const koaBody = require('koa-body')({ multipart: true, uploadDir: '.' })
const handlebars = require('handlebars');
const hbsKoa = require("koa-handlebars");


const app = new Koa()
const router = new Router()

const Home = require('./controllers/home')
const Counters = require('./controllers/counters')
const Country = require('./controllers/country')
const UKSpecific = require('./controllers/ukspecific')
const UKHomepage = require('./controllers/ukhomepage')

const Convert = require('./modules/Convert')

app.keys = ['darkSecret']
app.use(staticDir('public'))
app.use(bodyParser())
app.use(
	views(
		`${__dirname}/views`,
		{ extension: 'hbs' },
		{ map: { handlebars: 'handlebars' } }
	)
)
app.use(hbsKoa({
	handlebars: handlebars,
	extension: 'hbs'
  }));


const defaultPort = 8080
const port = process.env.PORT || defaultPort

router.get('/uk/:country', async ctx => {
	const acceptableCountries = ['wales', 'northern-ireland', 'scotland', 'england']
	if(!acceptableCountries.includes(ctx.params.country)) ctx.throw('That\'s not a valid country in the UK.', 404)
	await UKSpecific(ctx)
})

router.get('/uk', async ctx => {
	await UKHomepage(ctx)
})

router.get('/', async ctx => {
		await Home.home(ctx)
})

router.get('/counters/cases', async ctx => {
	await Counters.cases(ctx)
})

router.get('/counters/deaths', async ctx => {
	await Counters.deaths(ctx)
})

router.get('/country/:id', async ctx => {
	await Country.country(ctx)
})

app.use(router.routes())
module.exports = app.listen(port, async() =>
	console.log(`listening on port ${port}`)
)

handlebars.registerHelper('json', function (content) {
    return JSON.stringify(content);
});

handlebars.registerHelper('convert', function (content) {
	return Convert.convert(content)
});

handlebars.registerHelper('thousandSeparate', function (content) {
	try {
		return content.toLocaleString('en-GB');
	} catch {
		return content
	}
})

handlebars.registerHelper('addition', function (element1, element2) {
	return element1 + element2
})

handlebars.registerHelper('formatDate', function (dateString) {
	console.log(dateString)
	const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
	console.log(new Date(dateString).toLocaleDateString('en-GB', options))
	return new Date(dateString).toLocaleDateString('en-GB', options)
})

handlebars.registerHelper('urlsafe-country', function (country) {//, string2) {
	country = country.replace(/\s/g, '_')
	return country
})