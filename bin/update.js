/**
 * update.js
 *
 * Update the nodejs.org metadata
 *
 * latest-nodejs.org
 *
 * 20/12/17
 *
 * Copyright (C) 2017 Damien Clark (damo.clarky@gmail.com)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const fs = require('fs') ;
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

// r.Rummage().through('https://nodejs.org/en/download/current/').for(njs()).then(data => {
r.Rummage().through('https://nodejs.org/en/download/').for(njs()).then(data => {
	fs.writeFile(argv.o, JSON.stringify(data), 'utf8', err => {
		if (err) throw err ;
	}) ;
}).catch(err => {
	console.error(err) ;
}) ;

