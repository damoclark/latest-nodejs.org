/*
 * update.js
 *
 * Update the nodejs.org metadata
 *
 * latest-nodejs.org
 *
 * 20/12/17
 *
 * Copyright (c) 2018 Damien Clark
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 *
 */

const fs = require('fs') ;
const util = require('util') ;

const writeFile = util.promisify(fs.writeFile) ;
const stat = util.promisify(fs.stat) ;

var argv = require('yargs')
.usage('Usage: $0 [options]')
.example('$0 -o data/urls.json', 'save parsed urls to given json file')
.alias('o', 'output')
.nargs('o', 1)
.describe('o', 'File to save output to')
.demandOption(['o'])
.help('h')
.alias('h', 'help')
.epilog('copyright 2018 Damien Clark')
.argv ;

const r = require('rummage') ;

const njs = require('rm-nodejs-download') ;

const jsdom = require('jsdom/lib/old-api') ;

const agent = require('superagent') ;

// Make use of await
(async () => {
// Get modification timestamp of current data (to compare with current versions on website)
let st ;
let d ;
try {
	st = await stat(argv.o) ;
	d = new Date(st.mtime) ;
}
catch (err) { // Assume file not created yet, so set time to Unix epoch
	d = new Date(0) ;
}

// Configure rummage
const parser = new r.parser.jsdom(jsdom) ;
r.useParser(parser) ;
const superagent = new r.agent.superagent(agent) ;
r.useAgent(superagent) ;

// Check if either page has been updated since last time
if(await refresh(d)) {
	try {
		// eslint-disable-next-line no-undef
		let data = await Promise.all([
			r.Rummage().through('https://nodejs.org/en/download/').for(njs()).go(),
			r.Rummage().through('https://nodejs.org/en/download/current/').for(njs()).go()
		]) ;
		await writeFile(argv.o, JSON.stringify({lts: data[0], current: data[1]}), 'utf8') ;

		console.log(`Successfully written ${argv.o}`) ;
	}
	catch(err) {
		console.error(err) ;
	}
}
else {
	console.log('No changes since last update') ;
}
})() ;

/**
 * Send head requests to server for both pages and return true if either has changed since mtime
 * @param {Date} mtime The time when the data last changed, to compare with current time
 * @return {Promise<boolean>}
 */
async function refresh(mtime) {
	let result1 = true ;
	let result2 = true ;
	try {
		await agent.head('https://nodejs.org/en/download/').set('If-Modified-Since', mtime.toUTCString()) ;
	}
	catch(res) {
		if(res.status == 304)
			result1 = false ; // No update necessary
	}

	try {
		await agent.head('https://nodejs.org/en/download/current/').set('If-Modified-Since', mtime.toUTCString()) ;
	}
	catch(res) {
		if(res.status == 304)
			result2 = false ; // No update necessary
	}
	return (result1 || result2) ; // Return true if at least one requires an update
}
