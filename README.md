# Reports Service

## Running Locally
This application runs in node, version 12.9.0 or greater.

Install node and then run npm install:
```aidl
npm install
```

Once node has been installed and the dependent node modules have been installed with npm, start the server:

```
cd hackerone 
node server &
```

## Running Remotely
This application is hosted in Google Cloud and may be accessed via the domain name **hackeronetest.com**.

For example:

curl http://hackeronetest.com/reports

## API Resources
* GET /reports
* GET /reports/{id}
* POST /reports
* PUT /reports/{id}
* DELETE /reports/{id}

## Sample Remote cURL requests
### Get Service Status
curl http://hackeronetest.com/status

### List all reports 
curl http://hackeronetest.com/reports

### Get One Report
curl http://hackeronetest.com/reports/2

### Create a New Report
curl http://hackeronetest.com/reports -X POST -d '{"title": "New Description", "description": "Description of new thingy", "createdBy" : "me"}' -H 'Content-Type: application/json'

### Modify an Existing Report
curl http://hackeronetest.com/reports/2 -X PUT -d '{"title": "Modified Description", "description": "Description of modified thingy", "lastModifiedBy" : "you"}' -H 'Content-Type: application/json'

### Delete an Existing Report
curl http://hackeronetest.com/reports/3 -X DELETE

## Sample Local cURL requests
### Get Service Status
curl http://localhost:9000/status

### List all reports 
curl http://localhost:9000/reports

### Get One Report
curl http://localhost:9000/reports/2

### Create a New Report
curl http://localhost:9000/reports -X POST -d '{"title": "New Description", "description": "Description of new thingy", "createdBy" : "me"}' -H 'Content-Type: application/json'

### Modify an Existing Report
curl http://localhost:9000/reports/2 -X PUT -d '{"title": "Modified Description", "description": "Description of modified thingy", "lastModifiedBy" : "you"}' -H 'Content-Type: application/json'

### Delete an Existing Report
curl http://localhost:9000/reports/3 -X DELETE

## Testing
To run all tests:
```aidl
npm test
```
or
```aidl
node_modules/mocha/bin/mocha
```

