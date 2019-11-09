'use strict';

main();

/**
 * Starts all services.
 */
function main() {
    const services = [];
    services.push(require('./server-service-reports.js'));

    services.forEach(service => {
        service.start();
    });
}