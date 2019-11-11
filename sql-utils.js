module.exports = {
    sqlSimpleQueryBuilder: sqlSimpleQueryBuilder,
    sqlSimpleInsertBuilder: sqlSimpleInsertBuilder,
    sqlSimpleUpdateBuilder: sqlSimpleUpdateBuilder,
    sqlSimpleDeleteBuilder: sqlSimpleDeleteBuilder
};

function sqlSimpleQueryBuilder(connection, tableName, columns, whereColumns) {
    let sqlStatement = 'SELECT ';

    let first = true;
    columns.forEach((item) => {
        if (first) {
            first = false;
        } else {
            sqlStatement += ',';
        }
        sqlStatement+= `${item.name} AS ${item.as}`;
    });
    sqlStatement += ` FROM ${tableName}`;

    if (whereColumns) {
        sqlStatement += ' WHERE ';
        let first = true;
        whereColumns.forEach(( whereColumn) => {
            if (first) {
                first = false;
            } else {
                sqlStatement += ' AND ';
            }
            let operator;
            let value;
            if (whereColumn.like) {
                value = `%${whereColumn.value}%`;
                operator = 'LIKE';
            } else {
                value = whereColumn.value;
                operator = '=';
            }
            value = connection.escape(value);
            sqlStatement += `${whereColumn.name} ${operator} ${value}`;

        });
    }
    sqlStatement += ';';
    return(sqlStatement);
}

function sqlSimpleInsertBuilder(connection, tableName, nameValues) {
    let sqlStatement = `INSERT INTO ${tableName} (`;

    let first = true;
    nameValues.forEach((item) => {
        if (first) {
            first = false;
        } else {
            sqlStatement += ',';
        }
        sqlStatement+= item.name;
    });
    sqlStatement += ') VALUES (';

    first = true;
    nameValues.forEach((item) => {
        if (first) {
            first = false;
        } else {
            sqlStatement += ',';
        }
        sqlStatement+= connection.escape(item.value);
    });

    sqlStatement += ');';

    return(sqlStatement);
}

function sqlSimpleUpdateBuilder(connection, tableName, nameValues, whereColumn) {
    // tableName = connection.escape(tableName);
    let sqlStatement = `UPDATE ${tableName} SET `;

    let first = true;
    nameValues.forEach((item) => {
        if (first) {
            first = false;
        } else {
            sqlStatement += ',';
        }
        sqlStatement+= (item.name + ' = ' + connection.escape(item.value));
    });

    sqlStatement += ` WHERE ${whereColumn.name}=${whereColumn.value}`;

    return(sqlStatement);
}

function sqlSimpleDeleteBuilder(connection, tableName, whereColumn) {
    let sqlStatement = `DELETE FROM ${tableName} WHERE ${whereColumn.name}=${whereColumn.value};`;

    return(sqlStatement);
}