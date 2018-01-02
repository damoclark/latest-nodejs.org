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

var argv = require('yargs')
.usage('Usage: $0 [options]')
.example('$0 -o data/urls.json', 'save parsed urls to given json file')
.alias('o', 'output')
.nargs('o', 1)
.describe('o', 'File to save output to')
.demandOption(['o'])
.help('h')
.alias('h', 'help')
.epilog('copyright 2017 Damien Clark')
.argv ;

const r = require('rummage') ;

const njs = require('rm-nodejs-download') ;

const jsdom = require('jsdom/lib/old-api') ;

const superagent = require('superagent') ;

const parser = new r.parser.jsdom(jsdom) ;
const agent = new r.agent.superagent(superagent) ;

r.useParser(parser) ;
r.useAgent(agent) ;

// eslint-disable-next-line no-undef
Promise.all([
	r.Rummage().through('https://nodejs.org/en/download/').for(njs()).go(),
	r.Rummage().through('https://nodejs.org/en/download/current/').for(njs()).go()
]).then(data => {
	return writeFile(argv.o, JSON.stringify({lts: data[0], current: data[1]}), 'utf8') ;
}).then(() => {
	console.log('Successfully written argv.o') ;
}).catch(err => {
	console.error(err) ;
}) ;

