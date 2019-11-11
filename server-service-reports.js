'use strict';

const express = require('express');
const appServiceReports = express();
const mysql = require('mysql');
const status = require('http-status');

const config = require('./config/configuration.json');
const mockData = require('./mock-data.js');
const security = require('./security.js');
const sqlUtils = require('./sql-utils.js');
const appServiceReportsName = 'Reports';
const reportsServiceRoot = {service: appServiceReportsName + ' Service'};
const serviceReportsPort = config.services.reports.local.port;
const APPLICATION_JSON = 'application/json';
let mockResponse = false;
let startedTimestamp;

class ReportsService {
    constructor() {
        this.init();
    }

    /**
     * Accessor for use by an external service orchestrator
     */
    getApp() {
        return (appServiceReports);
    }

    /**
     * Starts the service causing it to begin listening for and accepting connections.
     */
    start() {
        appServiceReports.get('/', (req, res) => res.send(JSON.stringify(reportsServiceRoot)));
        this.reportsServer = appServiceReports.listen(serviceReportsPort, () => console.log(`Service "` + appServiceReportsName + `" listening on port ${serviceReportsPort}`));
        startedTimestamp = new Date();
    }

    /**
     * Stops the service causing it to begin listening for and accepting connections.
     */
    stop() {
        this.reportsServer.close();
    }

    /**
     * Initializes this service.
     */
    init() {
        this.configureExpress();
        this.configureRoutes();
    }

    /**
     * Configure service to use mock data, when passed value is true, or real data, when passed value is false.
     * @param {boolean} value When true, mock data is used.  Otherwise real DB data is used
     */
    setMockResponse(value) {
        mockResponse = value ? true : false;
    }

    /**
     * Configures the Express module, enabling application/x-www-form-urlencoded input as well as application/json input.
     */
    configureExpress() {
        appServiceReports.use(express.urlencoded({extended: false}));
        appServiceReports.use(express.json());
    }

    /**
     * Setups of the various URI routes for each method / resource combination.
     */
    configureRoutes() {
        appServiceReports.get('/status', (req, res) => {
            res.send({
                code: status.OK,
                description: status[status.NOT_OK],
                serviceName: appServiceReportsName,
                upSince: startedTimestamp.toISOString()
            });
        });

        appServiceReports.get('/reports', (req, res) => {
            const response = this.getReports(req.query).then(function (reports) {
                res.status(status.OK).json(reports);
            }).catch(function (error) {
                res.writeHead(error.code, {'Content-Type': APPLICATION_JSON});
                res.end(JSON.stringify(error, undefined, '\t'));
            });
        });

        appServiceReports.get('/reports/:id', (req, res) => {
            const response = this.getReport(parseInt(req.params.id)).then(function (reports) {
                res.status(status.OK).json(reports);
            }).catch(function (error) {
                res.writeHead(error.code, {'Content-Type': APPLICATION_JSON});
                res.end(JSON.stringify(error, undefined, '\t'));
            });
        });

        appServiceReports.post('/reports', (req, res) => {
            this.createReport(req.body,).then(function (response) {
                res.status(status.OK).json(response);
            }).catch(function (error) {
                res.writeHead(error.code, {'Content-Type': APPLICATION_JSON});
                res.end(JSON.stringify(error, undefined, '\t'));
            });
        });

        appServiceReports.put('/reports/:id', (req, res) => {
            this.modifyReport(parseInt(req.params.id), req.body,).then(function (response) {
                res.status(status.OK).json(response);
            }).catch(function (error) {
                res.writeHead(error.code, {'Content-Type': APPLICATION_JSON});
                res.end(JSON.stringify(error, undefined, '\t'));
            });
        });

        appServiceReports.delete('/reports/:id', (req, res) => {
            this.deleteReport(parseInt(req.params.id)).then(function (response) {
                res.status(status.OK).json(response);
            }).catch(function (error) {
                res.writeHead(error.code, {'Content-Type': APPLICATION_JSON});
                res.end(JSON.stringify(error, undefined, '\t'));
            });
        });
    }

    /**
     * Implements report querying for a report list,
     *
     * @param {object} query An object containing any optionally specified query parameters
     * @return {object} promise The asynchronous promise that will be fulfilled up completion of the query
     */
    getReports(query) {
        const promise = new Promise(
            (resolve, reject) => {
                if (mockResponse) {
                    let response = mockData.mockReports;
                    if (query) {
                        if (query.title) {
                            response = mockData.mockReports.filter( (item) => {
                               return(item.title === query.title);
                            });
                        }
                        if (query.description) {
                            response = mockData.mockReports.filter( (item) => {
                                return(item.description.includes(query.description));
                            });
                        }
                    }
                    resolve(response);
                } else {
                    const connection = this.dbConnect();
                    let whereNameValues;
                    if (query) {
                        if (query.title) {
                            whereNameValues = [];
                            whereNameValues.push({name: 'title', value: query.title});
                        }
                        if (query.description) {
                            if (!whereNameValues) {
                                whereNameValues = [];
                            }
                            whereNameValues.push({name: 'description', value: query.description, like: true});
                        }
                    }
                    const sqlStatement = sqlUtils.sqlSimpleQueryBuilder(connection,
                        config.databaseReports.tables.report.name,
                        config.databaseReports.tables.report.columns,
                        whereNameValues);
                    connection.query(sqlStatement, (err, rows, fields) => {
                        if (err) {
                            console.log("Error", err);
                            reject({'code' : status.INTERNAL_SERVER_ERROR, 'message': status[status.INTERNAL_SERVER_ERROR],
                                dbCode: err.code, dbMessage: err.message});
                        } else {
                            resolve(rows);
                        }
                    });
                    connection.end();
                }
            }
        );

        return (promise);
    }

    /**
     * Implements report fetching for a single report.
     *
     * If there is no such report with an id matching the path parameter 'id', the promise will be rejected
     * with an error code of 404.
     *
     * @param {integer} id The id of the report to modify
     * @return {object} promise The asynchronous promise that will be fulfilled up completion of the query
     */
    getReport(id) {
        const promise = new Promise(
            (resolve, reject) => {
                if (mockResponse) {
                    let response;
                    let foundItem = mockData.mockReports.find((item) => {
                        return (item.id === id)
                    });
                    if (foundItem) {
                        response = foundItem;
                    } else {
                        reject({'code': status.NOT_FOUND, 'message': status[status.NOT_FOUND]});
                    }
                    resolve(response);
                } else {
                    const connection = this.dbConnect();
                    const sqlStatement = sqlUtils.sqlSimpleQueryBuilder(connection,
                        config.databaseReports.tables.report.name,
                        config.databaseReports.tables.report.columns,
                        [{name: 'id', value: id}]);
                    connection.query(sqlStatement, (err, rows, fields) => {
                        if (err) {
                            console.log("Error", err);
                            reject({'code' : status.INTERNAL_SERVER_ERROR, 'message': status[status.INTERNAL_SERVER_ERROR],
                                dbCode: err.code, dbMessage: err.message});
                        } else {
                            if (rows.length === 1) {
                                resolve(rows[0]);
                            } else if (rows.length === 0) {
                                reject({'code': status.NOT_FOUND, 'message': status[status.NOT_FOUND]});
                            } else { // more thane one row? - NOT GOOD! (and not really possible since id is a primary key)
                                reject({'code' : status.INTERNAL_SERVER_ERROR, 'message': status[status.INTERNAL_SERVER_ERROR]});
                            }
                            resolve(rows);
                        }
                    });
                    connection.end();
                }
            }
        );

        return (promise);
    }

    /**
     * Implements creating a new report.
     *
     * @param {object} body The request body that is the parsed JSON input
     * @return {object} promise The asynchronous promise that will be fulfilled up completion of the query
     */
    createReport(body) {
        const promise = new Promise(
            (resolve, reject) => {
                const violations = this.validateInput(body, true);
                if (violations.length > 0) {
                    reject({
                        'code': status.BAD_REQUEST,
                        'message': status[status.BAD_REQUEST],
                        description: violations.join(', ')
                    });
                } else {
                    if (mockResponse) {
                        const report = {
                            id: mockData.mockNextId++,
                            title: body.title,
                            description: body.description,
                            createdBy: body.createdBy, // Note: in a real implementation, createdBy would be derived from the active session and not explicity passed in
                            createdAt: new Date(),
                            lastModifiedBy: body.createdBy, // Note: in a real implementation, createdBy would be derived from the active session and not explicity passed in
                            lastModifiedAt: new Date()
                        };
                        mockData.mockReports.push(report);
                        resolve(report);
                    } else {
                        const connection = this.dbConnect();
                        const sqlStatement = sqlUtils.sqlSimpleInsertBuilder(connection,
                            config.databaseReports.tables.report.name,
                            [{name: 'description', value: body.description}, {name: 'title', value: body.title},
                                {name: 'created_by', value: body.createdBy}]);
                        connection.query(sqlStatement, (err, result, fields) => {
                            if (err) {
                                console.log("Error", err);
                                reject({'code' : status.INTERNAL_SERVER_ERROR, 'message': status[status.INTERNAL_SERVER_ERROR],
                                    dbCode: err.code, dbMessage: err.message});
                            } else {
                                if (result.affectedRows === 1) {
                                    let response = {
                                        id: result.insertId
                                    };
                                    resolve(response);
                                } else {
                                    reject({'code' : status.INTERNAL_SERVER_ERROR, 'message': status[status.INTERNAL_SERVER_ERROR]});
                                }

                            }
                        });
                        connection.end();
                    }
                }
            });

        return (promise);
    }

    /**
     * Implements modifying an existing report.
     *
     * If there is no such report with an id matching the path parameter 'id', the promise will be rejected
     * with an error code of 404.
     *
     * @param {integer} id The id of the report to modify
     * @param {object} body The request body that is the parsed JSON input
     * @return {object} promise The asynchronous promise that will be fulfilled up completion of the query
     */
    modifyReport(id, body) {
        const promise = new Promise(
            (resolve, reject) => {
                if (mockResponse) {
                    let response;
                    let foundItem = mockData.mockReports.find((item) => {
                        return (item.id === id)
                    });
                    if (foundItem) {
                        response = foundItem;
                        const violations = this.validateInput(body, false);
                        if (violations.length > 0) {
                            reject({
                                'code': status.BAD_REQUEST,
                                'message': status[status.BAD_REQUEST],
                                description: violations.join(', ')
                            });
                        } else {
                            foundItem.title = body.title;
                            foundItem.description = body.description;
                            foundItem.lastModifiedBy = body.lastModifiedBy; // Note: in a real implementation, lastModifiedBy would be derived from the active session and not explicity passed
                            foundItem.lastModifiedAt = new Date();
                            foundItem.affectedRows = 1;
                            resolve(foundItem);
                        }
                    } else {
                        reject({'code': status.NOT_FOUND, 'message': status[status.NOT_FOUND]});
                    }
                } else {
                    const violations = this.validateInput(body, false);
                    if (violations.length > 0) {
                        reject({
                            'code': status.BAD_REQUEST,
                            'message': status[status.BAD_REQUEST],
                            description: violations.join(', ')
                        });
                    } else {
                        const connection = this.dbConnect();
                        const sqlStatement = sqlUtils.sqlSimpleUpdateBuilder(connection,
                            config.databaseReports.tables.report.name,
                            [{name: 'description', value: body.description}, {name: 'title', value: body.title},
                                {name: 'last_modified_by', value: body.lastModifiedBy}], {name: 'id', value: id});
                        connection.query(sqlStatement, (err, result, fields) => {
                            if (err) {
                                console.log("Error", err);
                                reject({
                                    'code': status.INTERNAL_SERVER_ERROR,
                                    'message': status[status.INTERNAL_SERVER_ERROR],
                                    dbCode: err.code,
                                    dbMessage: err.message
                                });
                            } else {
                                if (result.affectedRows === 1) {
                                    let response = {
                                        id: id,
                                        affectedRows: result.affectedRows
                                    };
                                    resolve(response);
                                } else {
                                    reject({
                                        'code': status.NOT_FOUND,
                                        'message': status[status.NOT_FOUND]
                                    });
                                }

                            }
                        });
                        connection.end();
                    }
                }
            });

        return (promise);
    }

    /**
     * Implements deleting an existing report.
     *
     * If there is no such report with an id matching the path parameter 'id', the promise will be rejected
     * with an error code of 404.
     *
     * @param {integer} id The id of the report to delete
     * @return {object} promise The asynchronous promise that will be fulfilled up completion of the query
     */
    deleteReport(id) {
        const promise = new Promise(
            (resolve, reject) => {
                if (mockResponse) {
                    let response;
                    let foundIndex = mockData.mockReports.findIndex((item) => {
                        return (item.id === id)
                    });
                    const foundItem = mockData.mockReports[foundIndex];
                    if (foundIndex > -1) {
                        mockData.mockReports.splice(foundIndex, 1);
                        resolve(foundItem);
                    } else {
                        reject({'code': status.NOT_FOUND, 'message': status[status.NOT_FOUND]});
                    }
                } else {
                    const connection = this.dbConnect();
                    const sqlStatement = sqlUtils.sqlSimpleDeleteBuilder(connection,
                        config.databaseReports.tables.report.name,{name: 'id', value: id});
                    connection.query(sqlStatement, (err, result, fields) => {
                        if (err) {
                            console.log("Error", err);
                            reject({'code' : status.INTERNAL_SERVER_ERROR, 'message': status[status.INTERNAL_SERVER_ERROR], dbCode: err.code, dbMessage: err.message});
                        } else {
                            if (result.affectedRows === 1) {
                                let response = {
                                    id: id,
                                    affectedRows: result.affectedRows
                                };
                                resolve(response);
                            } else {
                                reject({'code' : status.NOT_FOUND, 'message': status[status.NOT_FOUND]});
                            }

                        }
                    });
                    connection.end();                }
            });

        return (promise);
    }

    /**
     * Validate input for report creation and report modififcation.
     *
     * If there are any missing required parameters, the
     *
     * @param {object} body The request body that is the parsed JSON input
     * @param {boolean} iscreate True for report creation, false for report modification
     * @return {object} violations The list of violations discovered.  An empty array will be returned when there are no
     * violations
     */
    validateInput(body, isCreate) {
        let violations = [];
        mockData.mockReportsSchema.forEach((item) => {
            if (((isCreate && item.requiredOnCreate) || (!isCreate && item.requiredOnModify)) && !body[item.name]) {
                violations.push(`Required parameter missing: ${item.name}`);
            }
        });
        return (violations);
    }

    dbConnect() {
        const decryptedPassword = security.decrypt(config.databaseReports.password);

        var connection = mysql.createConnection({
            host: config.databaseReports.host,
            user: config.databaseReports.user,
            password: decryptedPassword,
            database: config.databaseReports.database
        });
        connection.connect();
        return(connection);
    }
}

const reportsService = new ReportsService();

module.exports = {
    getApp: reportsService.getApp,
    getReportServiceInstance: function() {return(reportsService) },
    start: reportsService.start,
    stop: reportsService.stop
};