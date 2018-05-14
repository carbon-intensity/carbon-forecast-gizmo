const moment = require('moment-timezone');
const https = require('https');
const _ = require('lodash');


const leadingZero = function (n) {
    return (n < 10) ? ("0" + n) : n;
};


const whatIsTheTimeInTheUK = () => {
	let unixNow = Date.now(); // To ensure that the time in Unix time, which is based on UTC.
	// console.log('unixNow', unixNow);
	let momentNow = moment.tz(unixNow, 'Europe/London');
	// console.log('whatIsTheTimeInTheUK', momentNow);
	return momentNow;
};


const makeTheTimeEven = (date) => {
	// We need the hour to be an even hour (eg 2pm, 8am), so that a forecast slice
	// doesn't bridge days (ie 11pm to 1am)
	let now = date.startOf('hour');
	let hour = now.format('H');

    if (parseInt(hour) % 2 === 0) {
        // is even
		// console.log('makeTheTimeEven (even)', date);
        return date;
    }
    else {
        // is odd
		// console.log('makeTheTimeEven (odd)', moment(date).subtract(1, 'hour'));
        return moment(date).subtract(1, 'hour');
    }
};


const getTimeBounds = (time, duration) => {
	let rtrn = {
		start: moment(time).utc(),
		end: moment(time).utc().add(duration, 'hours'),
		daylightSavings: moment(time).isDST()
	};
	// console.log('getTimeBounds', rtrn);
	return rtrn;
}


const getCountryForecast = (start, end) => {
	return new Promise( (resolve, reject) => {
		const startISO = moment(start).format();
		const endISO = moment(end).format();

		const endpoint = `https://api.carbonintensity.org.uk/intensity/stats/${startISO}/${endISO}/2`;
		console.log(endpoint)

		https
			.get(endpoint, (response) => {
				if ( response.statusCode >= 200 && response.statusCode < 400) {
					response.on('data', (data) => {
						resolve( JSON.parse(data) );
					});
				}
				else {
					reject(response);
				}
			})
			.on('error', (error) => {
				reject(error);
			})
			.end();
	})
};

const getAreaForecast = (start, postcode) => {

	return new Promise( (resolve, reject) => {
		const startISO = moment(start).add(1, 'minute').toISOString();

		// const endpoint = `https://api.carbonintensity.org.uk/intensity/stats/${startISO}/${endISO}/2`;
		const endpoint = {
			host: `api.carbonintensity.org.uk`,
			path: `/regional/intensity/${startISO}/fw24h/postcode/${postcode}`,
			headers : {
				'x-api-key' : process.env.CARBON_API_KEY
			}
		}
		console.log(endpoint)
		https
			.get(endpoint, (response) => {
				if ( response.statusCode >= 200 && response.statusCode < 400) {
					let rawData = '';
  					response.on('data', (chunk) => { rawData += chunk; });
  					response.on('end', () => {
						try {
							const parsedData = JSON.parse(rawData);
							resolve( parsedData );
						} catch (e) {
							console.error(e.message);
						}
  					});
				}
				else {
					reject({
						result: false,
					});
				}
			})
			.on('error', (error) => {
				reject(error);
			})
			.end();
	})
}


const addHumanReadableTime = (array) => {
	return array.map( (object, key) => {
		// console.log('addHumanReadableTime (before)', object)
		object.fromHumanReadable = moment.tz(object.from, 'Europe/London').format('ha');
		object.toHumanReadable = moment.tz(object.to, 'Europe/London').format('ha');
		// console.log('addHumanReadableTime (added)', object)
		return object;
	})
};

const addCarbonIndex = (array) => {
	return array.map( (object, key) => {
		switch (true) {
			case (object.intensity.average > 380) :
	            object.intensity.index = 'very high';
	            break;
	        case (object.intensity.average > 280) :
	            object.intensity.index = 'high';
	            break;
	        case (object.intensity.average > 180) :
	            object.intensity.index = 'moderate';
	            break;
	        case (object.intensity.average > 80) :
	            object.intensity.index = 'low';
	            break;
	        case (object.intensity.average > 0) :
	            object.intensity.index = 'very low';
	            break;
		}
	})
}


const addCarbonIndexAbbreviations = (array) => {
	return array.map( (object, key) => {

		switch(object.intensity.index) {
			case 'very high':
				object.intensity.indexAbbreviation = 'VH';
				break;
			case 'high':
				object.intensity.indexAbbreviation = 'H';
				break;
			case 'moderate':
				object.intensity.indexAbbreviation = 'M';
				break;
			case 'low':
				object.intensity.indexAbbreviation = 'L';
				break;
			case 'very low':
				object.intensity.indexAbbreviation = 'VL';
				break;
			default:
				object.intensity.indexAbbreviation = '?';
			}

		return object;

	});
};


const findTheHighestAndLowestForecast = (apiObject) => {
	let highest = null;
	let lowest = null;

	let array = apiObject.data;

	for (let i = array.length - 1; i >= 0; i--) {
		array[i].highest = false;
		array[i].lowest = false;

		if (highest === null) {
			highest = i;
		}
		else if ( array[i].intensity.average > array[highest].intensity.average ) {
			highest = i;
		}

		if (lowest === null) {
			lowest = i;
		}
		else if ( array[i].intensity.average < array[lowest].intensity.average ) {
			lowest = i;
		}
	}

	array[highest].highest = true;
	array[lowest].lowest = true;

	// let maximum = 380;

	// if (array[highest].intensity.average > 380) {
	// 	maximum = array[highest].intensity.average;
	// }

	// for (let j = array.length - 1; j >= 0; j--) {
	// 	let percentage = (array[j].intensity.average / maximum) * 100;
	// 	array[j].intensity.percentage = Math.floor(percentage);
	// }

	return apiObject;
};


const addWhichDayItIs = (array) => {
	return array.map( (object, key) => {

		// We want to be able to only show whether it's the start
		// of a new day in the timeline; this flag will let us do that.
		let startOfDay = moment.tz(object.from, 'Europe/London').startOf('day');
		let startOfSlice =  moment.tz(object.from, 'Europe/London');
		let sameDay = startOfDay.isSame(startOfSlice, 'hour');

		// We also want the first slice to show the day.
		if (key === 0) {
			sameDay = true;
		}

		object.day = {
			name : startOfSlice.format('dddd'),
			start : sameDay
		}

		return object;
	});
};

const isADurationAskedFor = (path) => {
// 	let lookInTheURL = path.match(/(?:\/api\/)([0-9][0-9])$/);


// 	if (lookInTheURL === null) {
// 		return 24;
// 	}
// 	else if ( lookInTheURL[1] === '24' || lookInTheURL[1] === '36' || lookInTheURL[1] === '48') {
// 			return Number.parseInt(lookInTheURL[1]);
// 	}

	return 24
};

const checkPostcode = (postcode) => {
	return new Promise( (resolve, reject) => {

		const endpoint = `https://api.postcodes.io/postcodes/${postcode}/`;

		https
			.get(endpoint, (response) => {
				if ( response.statusCode >= 200 && response.statusCode < 400) {
					let rawData = '';
  					response.on('data', (chunk) => { rawData += chunk; });
  					response.on('end', () => {
						try {
							const parsedData = JSON.parse(rawData);
							resolve( {
								result: true,
								outcode: parsedData.result.outcode
							} );
						} catch (e) {
							console.error(e.message);
						}
  					});
				}
				else {
					reject({
						result: false,
						message: response.error
					});
				}
			})
			.on('error', (error) => {
				reject(error);
			})
			.end();
	})
}

const mergeInHourBlocks = (arrayOfHalfHourBlocks) => {
	const hourBlocks = 2; // 2 hour blocks
	const loop = hourBlocks * 2;

	let startTime = moment(arrayOfHalfHourBlocks[0].from);
	let endTime = moment(startTime).add(2, 'hours');

	let newArray = [];
	let newObj = {
		intensity: {
			average: 0
		}
	};

	for (let i = 0; i < arrayOfHalfHourBlocks.length; i++) {
		newObj.from = startTime.toISOString();
		newObj.to = endTime.toISOString();
		newObj.intensity.average += arrayOfHalfHourBlocks[i].intensity.forecast;

		if (moment(arrayOfHalfHourBlocks[i].to).isSame(endTime) === true) {
			console.log(i)
			newObj.intensity.average = Math.floor(newObj.intensity.average / loop);
			newArray.push(newObj)

			// Clear to start again
			newObj = { intensity : { average: 0} };
			startTime = endTime;
			endTime = moment(startTime).add(2, 'hours');
		}
	}
	return newArray;
}

exports.handler = (event, context, callback) => {

	// only accept 12, 24, 36, and 48 hour durations. Defaults to 24 hours.
	// TODO: not currently working on Netlify functions; quickfix is to default
	// to 24 hours.
	let duration = isADurationAskedFor(event.path);

    // Get time in UK timezone
    let timeInUK = whatIsTheTimeInTheUK();

	// Get the last even hour (eg if it's 9:15am, then this will return 8:00am)
	let evenTime = makeTheTimeEven(timeInUK);

	// Convert to UTC for requesting from the API,
	// get the start and end time in UTC
	// Returns a object with 'startUTC' and 'endUTC', 'startUK' and 'endUK'
	let timeBounds = getTimeBounds(evenTime, duration);

	if ( event.httpMethod === 'POST' ) {
		console.log('POSTed')
		checkPostcode(event.body)
			.then( (response) => {
				getAreaForecast(timeBounds.start, response.outcode.toLowerCase())
					.then( (response) => {
						const dedupedResponse = _.uniqBy(response.data, 'response.data[0].from')[0];

						const mergedIntoBlocks = mergeInHourBlocks(dedupedResponse.data);

						addCarbonIndex(mergedIntoBlocks)
						addCarbonIndexAbbreviations(mergedIntoBlocks)
	    				addHumanReadableTime(mergedIntoBlocks);
			    		addWhichDayItIs(mergedIntoBlocks);

	    				const responseWithHighestAndLowest = findTheHighestAndLowestForecast({data: mergedIntoBlocks});

					    callback(null, {
					    	statusCode: 200,
					    	headers : {
					    		"Content-Type" : 'application/json; charset=utf-8',
					    		"X-Powered-By" : 'Electricity',
					    		"Access-Control-Allow-Methods": 'POST',
					    		"Access-Control-Allow-Origin" : '*'
					    	},
					    	body: JSON.stringify(responseWithHighestAndLowest)
					    	// body: JSON.stringify( response.data )
					    });
					})
					.catch( (error) => {
						console.error('error1');
						console.error(error)
					})
			})
			.catch( error => {
				console.error('error2');
			})
	}
	else {
		console.log('GETed')
		// Request the data from the API
	    getCountryForecast(timeBounds.start, timeBounds.end)
	    	.then( (response) => {

				// Add in the human readable dates
	    		addHumanReadableTime(response.data);

	    		// For example, 'very high' has 'VH', 'low' has 'L'.
	    		addCarbonIndexAbbreviations(response.data);

				// Add in day flag on each object
	    		addWhichDayItIs(response.data);

	    		// Add 'true' to the highest and lowest
	    		let responseWithHighestAndLowest = findTheHighestAndLowestForecast(response);


			    callback(null, {
			    	statusCode: 200,
			    	headers : {
			    		"Content-Type" : 'application/json; charset=utf-8',
			    		"X-Powered-By" : 'Electricity',
			    		"Access-Control-Allow-Methods": 'GET',
			    		"Access-Control-Allow-Origin" : '*'

			    	},
			    	body: JSON.stringify( responseWithHighestAndLowest )
			    });
	    	})
	    	.catch( error => {
			    callback(null, {
			    	statusCode: 500,
			    	body: JSON.stringify(error)
			    });
	    	})
	}
}