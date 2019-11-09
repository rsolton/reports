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
| Method and Resource| Description | Required HTTP Header | 
| ----------- | ----------- | ----------- |
| GET /status | Get the server status.  Also used as a health check for the load balancer. | | 
| GET /reports | Get a list of all reports or query for specific reports by **title** and / or **description**. | |
| GET /reports/{id} |  Get a specific report by its unique ID. | |
| POST /reports | Create a new report. | Content-Type: application/json |
| PUT /reports/{id} | Modify an existing report. | Content-Type: application/json |
| DELETE /reports/{id} | Delete an existing report. | |

## Sample Remote cURL Requests
### Get Service Status
curl http://hackeronetest.com/status

### List all reports 
curl http://hackeronetest.com/reports

### List all reports filtered by description (partial match)

**Example 1** (returns one result):
curl http://hackeronetest.com/reports?description=lawyer

**Example 2** (returns two results):
curl http://hackeronetest.com/reports?description=law

### List all reports filtered by title (exact match)
curl 'http://hackeronetest.com/reports?title=My+Dog+Rose'

Note: You can filter by both **description** and **title**.

### Get One Report
curl http://hackeronetest.com/reports/2

### Create a New Report
curl http://hackeronetest.com/reports -X POST -d '{"title": "New Description", "description": "Description of new thingy", "createdBy" : "me"}' -H 'Content-Type: application/json'

### Modify an Existing Report
curl http://hackeronetest.com/reports/2 -X PUT -d '{"title": "Modified Description", "description": "Description of modified thingy", "lastModifiedBy" : "you"}' -H 'Content-Type: application/json'

### Delete an Existing Report
curl http://hackeronetest.com/reports/3 -X DELETE

## Sample Local cURL Requests
### Get Service Status
curl http://localhost:9000/status

### List all reports 
curl http://localhost:9000/reports

### List all reports filtered by description (partial match)
**Example 1** (returns one result):
curl http://localhost:9000/reports?description=lawyer

**Example 2** (returns two results):
curl http://localhost:9000/reports?description=law

### List all reports filtered by title (exact match)
curl 'http://localhost:9000/reports?title=My+Dog+Rose'

Note: You can filter by both **description** and **title**.

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

