(function(document, window, undefined) {

    let leadingZero = function (n) {
        return (n < 10) ? ("0" + n) : n;
    };

    let createBanding = function(amount) {
         if ( amount > 400) {
            return {
                colour: '#EE3350',
                number: 8,
                letter: 'VH'
            };
        }
        else if ( amount > 300) {
            return {
                colour: '#F89834',
                number: 6,
                letter: 'H'
            };
        }
        else if ( amount > 200) {
            return {
                colour: '#FFE600   ',
                number: 4,
                letter: 'M'
            };
        }
        else if ( amount > 100) {
            return {
                colour: '#74C050',
                number: 2,
                letter: 'L'
            };
        }
        else if ( amount > 0) {
            return {
                colour: '#74C050',
                number: 0,
                letter: 'VL'
            };
        };
    };

    let todayOrTomorrow = (time) => {
        let tomorrow = moment().endOf('day');;
        if (moment(time).isSameOrBefore(tomorrow)) {
            return 'today';
        }
        else {
            return 'tomorrow';
        }
    };

    let createPlaceholders = function(target, amount) {
        let placeholderWrapper = document.createElement('section');
            placeholderWrapper.className = 'wrapper';
            placeholderWrapper.style.width = ( (7 * amount) * 16 ) + 'px';
            document.querySelector('.logos').style.maxWidth = ( (7 * amount) * 16 ) + 'px';

            let placeholders = ''
            for (let a = 0; a < amount; a++) {
                placeholders +=
                    `<div class="hour">
                        <p class="timestamp"><time></time></p>
                        <svg class="inactive icon--house" width="149" height="146" viewBox="0 0 149 146" xmlns="http://www.w3.org/2000/svg">
                            <title>House</title>
                            <path d="M26 53.196L3 77h23v66h98V77h22L74.5 3 44 34.566V16H26v37.196z" stroke="#676767" stroke-width="7" fill="#fff" fill-rule="evenodd" stroke-linejoin="round" />
                            <text x="59" y="105" font-family="'Open Sans', sans-serif" font-size="40" fill="#000"></text>
                        </svg>
                    </div>`;
            }
            placeholderWrapper.innerHTML += placeholders;

        target.appendChild(placeholderWrapper);
    };

    let populatePlaceholders = function(target, data) {
        let svg = target.querySelectorAll('svg');
        let time = target.querySelectorAll('time');
        let highest = 'uninitiated';
        let lowest = 'uninitiated';

        let plugTemplate = function(colour, message) {
            let boxWidth = 49;
            let boxHeight = 59;
            let template = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

                template.setAttributeNS (null, 'viewBox', '0 0 ' + boxWidth + ' ' + boxHeight);
                template.setAttributeNS (null, 'width', boxWidth);
                template.setAttributeNS (null, 'height', boxHeight);
                template.setAttributeNS(null, 'class', 'icon--plug');
                template.innerHTML = `<g fill="none" fill-rule="evenodd">
                                        <path d="M24.5 59V41.5M14 22V0M36 22V0" stroke="${colour}" stroke-width="9" fill="${colour}"/>
                                        <path d="M.005 16c-.003.166-.005.333-.005.5C0 30.583 10.97 42 24.5 42S49 30.583 49 16.5c0-.167-.002-.334-.005-.5H.005z" fill="${colour}" />
                                        </g>
                                    </svg>`;

            return [ template,  document.createTextNode(message) ];
        };

        let tomorrowCounter = false;
        for (let b = 0; b < data.length; b++) {
            // console.log(data[b].from, moment(data[b].from).tz('Europe/London').format('ha'), todayOrTomorrow(data[b].from));
            let day = "";

            if (tomorrowCounter === false) {
                if (todayOrTomorrow(data[b].from) === 'tomorrow') {
                    tomorrowCounter = true;
                    try {
                        svg[b].parentElement.style.borderLeft = '2px dotted #999';
                    }
                    catch(e) {
                        console.warn(e);
                    }
                    day = document.createElement('b');
                    let dayText = document.createTextNode( moment(data[b].from).tz('Europe/London').format('dddd') );
                    day.appendChild( dayText );
                }
            }

            time[b].appendChild(
                document.createTextNode(
                    moment(data[b].from).tz('Europe/London').format('ha')
                    + ' - '
                    + moment(data[b].to).tz('Europe/London').format('ha')
                )
            );

            if (day !== "") {
                time[b].appendChild(day);
            }
        }

        for (let c = 0; c < data.length; c++) {
            try {
                let banding = createBanding(data[c].intensity.average);

                if (highest === 'uninitiated') {
                    highest = c;
                }
                else if ( data[c].intensity.average > data[highest].intensity.average) {
                    highest = c;
                };

                if (lowest === 'uninitiated') {
                    lowest = c;
                }
                else if ( data[c].intensity.average < data[lowest].intensity.average) {
                    lowest = c;
                };

                svg[c].querySelector('path').style.stroke = banding.colour;
                svg[c].querySelector('title').innerHTML = data[c].intensity.average + 'g CO₂ per kWh';
                svg[c].querySelector('text').appendChild(document.createTextNode(banding.letter));
                svg[c].querySelector('text').style.fill = '#676767';
                svg[c].style.top = (9 - banding.number) + 'em';
            }
            catch (error) {
                if (error) {
                    console.warn(error)
                    time[c].appendChild( document.createTextNode(' (Forecast not yet available)') );
                    svg[c].querySelector('text').appendChild(document.createTextNode('?'))
                    svg[c].querySelector('text').style.fill = '#ccc';
                    throw error;
                }
            }

            time[c].style.color = '#333';
        }

        time[highest].parentElement.appendChild( plugTemplate('#EE3350', 'Unplug')[0] );
        time[highest].parentElement.appendChild( plugTemplate('#EE3350', 'Unplug')[1] );
        time[lowest].parentElement.appendChild( plugTemplate('#74C050', 'Plug in')[0] );
        time[lowest].parentElement.appendChild( plugTemplate('#74C050', 'Plug in')[1] );
        time[lowest].parentElement.parentElement.style.backgroundColor = '#d6e8ce';
        time[highest].parentElement.parentElement.style.backgroundColor = '#ffd3da';
    };

    let carbonForecasts = document.getElementsByClassName('carbon-forecast');

    for (let i = 0; i < carbonForecasts.length; i++) {
        let start;
        let end;
        let timeFormat = 'YYYY-MM-DD\THH\:mm';
        let duration = 24;
        let timeBlock = 2;

        // if (carbonForecasts[i].getAttribute('data-duration')) {
        //     duration = carbonForecasts[i].getAttribute('data-duration');
        // }
        // else {
            // duration = 24;
        // }

        if (carbonForecasts[i].getAttribute('data-from')) {
            start = moment(carbonForecasts[i].getAttribute('data-from') ).startOf('hour').tz('UTC').format(timeFormat);
        }
        else {
            let timeInUTC = moment().startOf('hour').tz('UTC');
            let timeLocal = moment().startOf('hour').tz('Europe/London');
            let localHour = timeLocal.format('HH');
            let UTCHour = timeInUTC.format('HH');
            let roundedHour;

            if (parseInt(localHour) % 2 === 0) {
                // is even
                roundedHour = parseInt(UTCHour);
            }
            else {
                // is odd
                roundedHour = parseInt(UTCHour) - 1;
            }

            start = timeInUTC.format('YYYY-MM-DD\T') + leadingZero(roundedHour) + ':00';
        }
        end = moment(start).add(duration, 'hours').tz('UTC').format(timeFormat);
        createPlaceholders(carbonForecasts[i], duration / timeBlock);

        let request = new XMLHttpRequest();
            request.open('GET', 'https://k1nehbcl85.execute-api.eu-west-2.amazonaws.com/v1/intensity/stats/' + start + '/' + end + '/' + timeBlock, true);
            request.onreadystatechange = function() {
                if (this.readyState === 4) {
                    if (this.status >= 200 && this.status < 400) {
                        let response = JSON.parse(this.responseText);
                        populatePlaceholders(carbonForecasts[i], response.data);
                    } else {
                        // Error :(
                    }
                }
            };
            request.send();
            request = null;
    }
})(document, window);