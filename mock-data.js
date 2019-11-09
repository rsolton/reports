const mockReportsSchema = [
    {"name": "id", "type": "integer"},
    {"name": "title", "type": "string", "requiredOnCreate": true, "requiredOnModify": true},
    {"name": "description", "type": "string", "requiredOnCreate": true, "requiredOnModify": true},
    {"name": "createdAt", "type": "datetime"},
    {"name": "createdBy", "type": "string", "requiredOnCreate": true, "requiredOnModify": false},
    {"name": "lastModifiedAt", "type": "timestamp"},
    {"name": "lastModifiedBy", "type": "string", "requiredOnCreate": false, "requiredOnModify": true}
];

let mockReports = [
    {"id": 1, "title": "Ruth Bader Ginsburg", "description": "Report about an American lawyer and jurist who is an Associate Justice of the U.S. Supreme Court.", "createdBy": "Ruth Bader Ginsburg", "createdAt": new Date(), lastModifiedAt: new Date(),  lastModifiedBy: "Ruth Bader Ginsburg"},
    {"id": 2, "title": "My Dog Rose", "description": "Report about my dog Rose who enjoys leash laws.", "createdBy": "John Mayer", "createdAt": new Date(), lastModifiedAt: new Date(),  lastModifiedBy:  "John Mayer"},
    {"id": 3, "title": "Three Blind Mice", "description": "Report about seeing how mice run", "createdBy": "Mickey Mouse", "createdAt": new Date(), lastModifiedAt: new Date(),  lastModifiedBy:  "Mickey Mouse" },
];

let mockNextId = 4;

module.exports = {
    mockReportsSchema: mockReportsSchema,
    mockReports: mockReports,
    mockNextId: mockNextId
};