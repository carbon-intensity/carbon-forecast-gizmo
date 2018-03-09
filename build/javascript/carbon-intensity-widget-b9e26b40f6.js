'use strict';

(function (document, window, undefined) {

    var leadingZero = function leadingZero(n) {
        return n < 10 ? "0" + n : n;
    };

    var createBanding = function createBanding(amount) {
        if (amount > 380) {
            return {
                colour: '#EE3350',
                number: 8,
                letter: 'VH'
            };
        } else if (amount > 280) {
            return {
                colour: '#F89834',
                number: 6,
                letter: 'H'
            };
        } else if (amount > 180) {
            return {
                colour: '#FFE600',
                number: 4,
                letter: 'M'
            };
        } else if (amount > 80) {
            return {
                colour: '#74C050',
                number: 2,
                letter: 'L'
            };
        } else if (amount > 0) {
            return {
                colour: '#74C050',
                number: 0,
                letter: 'VL'
            };
        }
    };

    var todayOrTomorrow = function todayOrTomorrow(time) {
        var tomorrow = moment().endOf('day');
        if (moment(time).isSameOrBefore(tomorrow)) {
            return 'today';
        } else {
            return 'tomorrow';
        }
    };

    var createPlaceholders = function createPlaceholders(target, amount) {
        var placeholderWrapper = document.createElement('section');
        placeholderWrapper.className = 'wrapper';
        placeholderWrapper.style.width = 7 * amount * 16 + 'px';
        document.querySelector('.logos').style.maxWidth = 7 * amount * 16 + 'px';

        var placeholders = '';

        for (var a = 0; a < amount; a++) {
            placeholders += '<div class="hour">\n                    <p class="timestamp"><time></time></p>\n                    <svg class="inactive icon--house" width="149" height="146" viewBox="0 0 149 146" xmlns="http://www.w3.org/2000/svg">\n                        <path d="M26 53.196L3 77h23v66h98V77h22L74.5 3 44 34.566V16H26v37.196z" stroke="#676767" stroke-width="7" fill="rgba(255,255,255,1)" fill-rule="evenodd" stroke-linejoin="round">\n                            <title>House</title>\n                        </path>\n                        <text x="59" y="105" font-family="\'Open Sans\', sans-serif" font-size="40" fill="#000"></text>\n                    </svg>\n                </div>';
        }
        placeholderWrapper.innerHTML += placeholders;
        target.appendChild(placeholderWrapper);
    };

    var populatePlaceholders = function populatePlaceholders(target, data) {
        var svg = target.querySelectorAll('svg');
        var time = target.querySelectorAll('time');
        var highest = 'uninitiated';
        var lowest = 'uninitiated';

        var plugTemplate = function plugTemplate(colour, message) {
            var boxWidth = 49;
            var boxHeight = 59;
            var template = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

            template.setAttributeNS(null, 'viewBox', '0 0 ' + boxWidth + ' ' + boxHeight);
            template.setAttributeNS(null, 'width', boxWidth);
            template.setAttributeNS(null, 'height', boxHeight);
            template.setAttributeNS(null, 'class', 'icon--plug');
            template.innerHTML = '<g fill="none" fill-rule="evenodd">\n                                        <path d="M24.5 59V41.5M14 22V0M36 22V0" stroke="' + colour + '" stroke-width="9" fill="' + colour + '"/>\n                                        <path d="M.005 16c-.003.166-.005.333-.005.5C0 30.583 10.97 42 24.5 42S49 30.583 49 16.5c0-.167-.002-.334-.005-.5H.005z" fill="' + colour + '" />\n                                        </g>\n                                    </svg>';

            return [template, document.createTextNode(message)];
        };

        for (var b = 0; b < data.length; b++) {
            time[b].appendChild(document.createTextNode(moment(data[b].from).tz('Europe/London').format('ha') + ' - ' + moment(data[b].to).tz('Europe/London').format('ha')));
        }

        var tomorrowCounter = false;
        for (var _b = 0; _b < data.length; _b++) {
            // console.log(
            //     data[b].from,
            //     moment(data[b].from).tz('Europe/London').format('YYYYMMDD hh:mm'),
            //     moment(data[b].from).tz('UTC').format('YYYYMMDD hh:mm'),
            //     todayOrTomorrow(data[b].from)
            // );

            if (_b >= 1) {
                var thisHour = moment(data[_b].from).tz('Europe/London').format('YYYYMMDD');
                var previousHour = moment(data[_b - 1].from).tz('Europe/London').format('YYYYMMDD');
                if (thisHour !== previousHour) {
                    try {
                        svg[_b].parentElement.style.borderLeft = '2px dotted #999';
                        var day = document.createElement('b');
                        var dayText = document.createTextNode(moment(data[_b].from).tz('Europe/London').format('dddd'));
                        day.appendChild(dayText);
                        time[_b].appendChild(day);
                    } catch (e) {
                        console.warn(e);
                    }
                }
            }
        }

        for (var c = 0; c < data.length; c++) {
            try {
                var banding = createBanding(data[c].intensity.average);

                if (highest === 'uninitiated') {
                    highest = c;
                } else if (data[c].intensity.average > data[highest].intensity.average) {
                    highest = c;
                }

                if (lowest === 'uninitiated') {
                    lowest = c;
                } else if (data[c].intensity.average < data[lowest].intensity.average) {
                    lowest = c;
                }

                svg[c].querySelector('path').style.stroke = banding.colour;
                svg[c].querySelector('title').innerHTML = data[c].intensity.average + 'g CO₂ per kWh';
                svg[c].querySelector('text').appendChild(document.createTextNode(banding.letter));
                svg[c].querySelector('text').style.fill = '#676767';
                svg[c].style.top = 9 - banding.number + 'em';
            } catch (error) {
                if (error) {
                    console.warn(error);
                    time[c].appendChild(document.createTextNode(' (Forecast not yet available)'));
                    svg[c].querySelector('text').appendChild(document.createTextNode('?'));
                    svg[c].querySelector('text').style.fill = '#ccc';
                    throw error;
                }
            }

            time[c].style.color = '#333';
        }

        time[highest].parentElement.appendChild(plugTemplate('#EE3350', 'Unplug')[0]);
        time[highest].parentElement.appendChild(plugTemplate('#EE3350', 'Unplug')[1]);
        time[lowest].parentElement.appendChild(plugTemplate('#74C050', 'Plug in')[0]);
        time[lowest].parentElement.appendChild(plugTemplate('#74C050', 'Plug in')[1]);
        time[lowest].parentElement.parentElement.style.backgroundColor = '#d6e8ce';
        time[highest].parentElement.parentElement.style.backgroundColor = '#ffd3da';
    };

    var carbonForecasts = document.getElementsByClassName('carbon-forecast');

    var _loop = function _loop(i) {
        var start = void 0;
        var end = void 0;
        var timeFormat = 'YYYY-MM-DD\THH\:mm';
        var duration = void 0;
        var timeBlock = 2;

        if (carbonForecasts[i].getAttribute('data-duration')) {
            duration = carbonForecasts[i].getAttribute('data-duration');
        } else {
            duration = 24;
        }

        if (duration < 4) {
            duration = 4;
        } else if (duration > 48) {
            duration = 48;
        }

        if (carbonForecasts[i].getAttribute('data-from')) {
            start = moment(carbonForecasts[i].getAttribute('data-from')).startOf('hour').tz('UTC').format(timeFormat);
        } else {
            var timeInUTC = moment().startOf('hour').tz('UTC');
            var timeLocal = moment().startOf('hour').tz('Europe/London');
            var localHour = timeLocal.format('HH');
            var UTCHour = timeInUTC.format('HH');
            var roundedHour = void 0;

            if (parseInt(localHour) % 2 === 0) {
                // is even
                roundedHour = parseInt(UTCHour);
            } else {
                // is odd
                roundedHour = parseInt(UTCHour) - 1;
            }

            start = timeInUTC.format('YYYY-MM-DD\T') + leadingZero(roundedHour) + ':00';
        }
        end = moment(start).add(duration, 'hours').tz('UTC').format(timeFormat);
        createPlaceholders(carbonForecasts[i], duration / timeBlock);

        var request = new XMLHttpRequest();
        request.open('GET', 'https://k1nehbcl85.execute-api.eu-west-2.amazonaws.com/v1/intensity/stats/' + start + '/' + end + '/' + timeBlock, true);
        request.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status >= 200 && this.status < 400) {
                    var response = JSON.parse(this.responseText);
                    populatePlaceholders(carbonForecasts[i], response.data);
                } else {
                    // Error :(
                }
            }
        };
        request.send();
        request = null;
    };

    for (var i = 0; i < carbonForecasts.length; i++) {
        _loop(i);
    }
})(document, window);
//# sourceMappingURL=carbon-intensity-widget.js.map
