const https = require('https');

exports.handler = (event, context, callback) => {

    const postcodeRegex = new RegExp('(?:[Gg][Ii][Rr] 0[Aa]{2})|(?:((?:[A-Za-z][0-9]{1,2})|(?:(?:[A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(?:(?:[AZa-z][0-9][A-Za-z])|(?:[A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))[0-9][A-Za-z]{2})');

    console.log( event );

            callback(null, {
                statusCode: 200,
                headers : {
                    "Content-Type" : 'application/json; charset=utf-8',
                    "X-Powered-By" : 'Electricity',
                    "Access-Control-Allow-Methods": 'GET',
                    "Access-Control-Allow-Origin" : '*'

                },
                body: JSON.stringify( 'a' )
            });
}