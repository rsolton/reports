var assert = require('assert');
describe('Reports', function() {
    describe('#getReports', function() {
        it('should return a list of 3 reports', async () => {
            const reportsService = require('../server-service-reports.js');
            reportsService.start();
            const reportServiceInstance = reportsService.getReportServiceInstance();

            const response = await reportServiceInstance.getReports().then(function (reports) {
                assert(Array.isArray(reports));
                assert.equal(reports.length, 3);
            }).finally( () => {
                reportsService.stop();
            });
        });
    });

    describe('#getReport', function() {
        it('should return a single report', async () => {
            const reportsService = require('../server-service-reports.js');
            reportsService.start();
            const reportServiceInstance = reportsService.getReportServiceInstance();
            const response = await reportServiceInstance.getReport(1).then(function (report) {
                assert(typeof report === 'object');
                assert.equal(report.id, 1);
            }).finally( () => {
                reportsService.stop();
            });
        });
    });

    describe('#getReportNotFound', function() {
        it('should reject with a 404 error since the id path parameter referes to a non-existant report', async () => {
            const reportsService = require('../server-service-reports.js');
            reportsService.start();
            const reportServiceInstance = reportsService.getReportServiceInstance();
            const invalidReportId = 999999999;
            const response = await reportServiceInstance.getReport(invalidReportId).then(function (report) {
                assert(false);
            }).catch(function (error) {
                assert(error.code === 404);
            }).finally( () => {
                reportsService.stop();
            });
        });
    });

    describe('#createReport', function() {
        it('should create a new report and return the newly created report', async () => {
            const reportsService = require('../server-service-reports.js');
            reportsService.start();
            const newReport = {
              title: 'New Report',
              description: 'Description of new report',
              createdBy: 'Test Script',
            };

            const reportServiceInstance = reportsService.getReportServiceInstance();

            const response = await reportServiceInstance.createReport(newReport).then(function (report) {
                assert(typeof report === 'object');
                assert.equal(report.title, newReport.title);
            }).finally( () => {
                reportsService.stop();
            });
        });
    });

    describe('#createReportBadInput', function() {
        it('should reject with a 400 error, since the title attribute is not present', async () => {
            const reportsService = require('../server-service-reports.js');
            reportsService.start();
            const newReport = {
                title: 'Description of new report',
                description: 'Description of new report',
                createdBy: 'Test Script',
            };

            const reportServiceInstance = reportsService.getReportServiceInstance();

            const response = await reportServiceInstance.createReport(newReport).then(function (report) {

            }).catch(function (error) {
                assert.equal(error.code, 400);
                reportsService.stop();
            }).finally( () => {
                reportsService.stop();
            });
        });
    });

    describe('#modifyReport', function() {
        it('should modify an existing report and return the modified representation of that report', async () => {
            const reportsService = require('../server-service-reports.js');
            reportsService.start();
            const modifiedReport = {
                title: 'Modified Report',
                description: 'Description of modified report',
                lastModifiedBy: 'Test Script'
            };

            const reportServiceInstance = reportsService.getReportServiceInstance();

            const reportId = 1;
            const response = await reportServiceInstance.modifyReport(reportId, modifiedReport).then(function (report) {
                assert(typeof report === 'object');
                assert.equal(report.title, modifiedReport.title);
            }).catch(function (error) {
                assert(false);
            }).finally( () => {
                reportsService.stop();
            });
        });
    });

    describe('#modifyReportBadInput', function() {
        it('should reject with a 400 error, since the description attribute is not present', async () => {
            const reportsService = require('../server-service-reports.js');
            reportsService.start();
            const modifiedReport = {
                title: 'Modified Report',
                lastModifiedBy: 'Test Script'
            };

            const reportServiceInstance = reportsService.getReportServiceInstance();

            const reportId = 1;
            const response = await reportServiceInstance.modifyReport(reportId, modifiedReport).then(function (report) {
                assert(false);
            }).catch(function (error) {
                assert.equal(error.code, 400);
                reportsService.stop();
            }).finally( () => {
                reportsService.stop();
            });
        });
    });

    describe('#modifyReportNotFound', function() {
        it('should reject with a 404 error since the id path parameter referes to a non-existant report', async () => {
            const reportsService = require('../server-service-reports.js');
            reportsService.start();
            const modifiedReport = {
                title: 'Modified Report',
                description: 'Description of modified report',
                lastModifiedBy: 'Test Script'
            };

            const reportServiceInstance = reportsService.getReportServiceInstance();

            const reportId = 9999999999;
            const response = await reportServiceInstance.modifyReport(reportId, modifiedReport).then(function (report) {
                assert(false);
            }).catch(function (error) {
                assert.equal(error.code, 404);
                reportsService.stop();
            }).finally( () => {
                reportsService.stop();
            });
        });
    });

    describe('#deleteReport', function() {
        it('should delete an existing report and return the original representation of that report before it was deleted', async () => {
            const reportsService = require('../server-service-reports.js');
            reportsService.start();

            const reportServiceInstance = reportsService.getReportServiceInstance();

            const reportId = 1;
            const response = await reportServiceInstance.deleteReport(reportId).then(function (report) {
                assert(typeof report === 'object');
                assert.equal(report.id, reportId);
            }).catch(function (error) {
                assert(false);
            }).finally( () => {
                reportsService.stop();
            });
        });
    });

    describe('#deleteReportNotFound', function() {
        it('should reject with a 404 error since the id path parameter referes to a non-existant report', async () => {
            const reportsService = require('../server-service-reports.js');
            reportsService.start();

            const reportServiceInstance = reportsService.getReportServiceInstance();

            const reportId = 9999999999;
            const response = await reportServiceInstance.deleteReport(reportId).then(function (report) {
                assert(false);
            }).catch(function (error) {
                assert.equal(error.code, 404);
                reportsService.stop();
            }).finally( () => {
                reportsService.stop();
            });
        });
    });

});