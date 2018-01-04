# latest-nodejs.org

API for fetching the latest Node.js binaries from the official nodejs.org website.

(Node.js is a trademark of Joyent, Inc. and is used with its permission. This software is not endorsed by or affiliated with Joyent)

## Overview

Download the latest version listed on the nodejs.org website for your chosen platform using this simple API, as illustrated by the examples below:

### Curl

```bash
[user@host]$ curl -JOL 'http://latest-nodejs.org/download/lts/linux/binary/64-bit'
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    81  100    81    0     0     81      0  0:00:01 --:--:--  0:00:01 13500
100 10.8M  100 10.8M    0     0  2225k      0  0:00:05  0:00:05 --:--:-- 2757k
curl: Saved to filename 'node-v8.9.3-linux-x64.tar.xz'
```

### Wget

```bash
wget --trust-server-names 'http://latest-nodejs.org/download/current/linux/binary/ARMv8'
--2017-12-24 14:48:44--  http://latest-nodejs.org/download/current/linux/binary/64-bit
Resolving latest-nodejs.org (latest-nodejs.org)...
Connecting to latest-nodejs.org (latest-nodejs.org)... connected.
HTTP request sent, awaiting response... 302 Found
Location: https://nodejs.org/dist/v9.3.0/node-v9.3.0-linux-arm64.tar.xz [following]
--2017-12-24 14:55:26--  https://nodejs.org/dist/v9.3.0/node-v9.3.0-linux-arm64.tar.xz
Resolving nodejs.org (nodejs.org)... 104.20.22.46, 104.20.23.46, 2400:cb00:2048:1::6814:162e, ...
Connecting to nodejs.org (nodejs.org)|104.20.22.46|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 10704696 (10M) [application/x-xz]
Saving to: ‘node-v9.3.0-linux-arm64.tar.xz’

node-v9.3.0-linux-a 100%[===================>]  10.21M  3.11MB/s    in 4.1s

2017-12-24 14:55:32 (2.50 MB/s) - ‘node-v9.3.0-linux-arm64.tar.xz’ saved [10704696/10704696]
```

Further information is available at [latest-nodejs.org](http://latest-nodejs.org).

## Installation

Use the following instructions to install your own version of this service.

### Install this package

```bash
cd /var/www
git clone https://github.com/damoclark/latest-nodejs.org.git
cd latest-nodejs.org
npm install
```

### Configure the update script

Add the update script to crontab

```bash
sudo crontab -e
```

Then add the following:

```
0 * * * * PATH=$PATH:/usr/local/node/bin node /var/www/latest-nodejs.org/bin/update.js -o /var/www/latest-nodejs.org/data/urls.json >/var/www/latest-nodejs.org/data/urls.log 2>&1
```

### Configure start-up of the app using systemd

```bash
cd /var/www/latest-nodejs.org
sudo cp contrib/latest-nodejs.org.service /etc/systemd/system/ # Edit the file to change the PORT & IP parameter
sudo systemctl daemon-reload
sudo systemctl start latest-nodejs.org
sudo systemctl enable latest-nodejs.org
```

## Usage

Usage instructions are available at [latest-nodejs.org](http://latest-nodejs.org).


## Licence

Copyright (c) 2018 Damien Clark

Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

