import React from "react";
import Slice from '../Slice/';
import Footer from '../Footer/';

import isPostcodeReal from '../../utilities/isPostcodeReal/';

import style from './Timeline.css';

class Timeline extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			carbon : [],
			postcode: false
		};

		const postcodeUnsanitised = window.location.pathname.replace(/\//g, '');

		if (postcodeUnsanitised.length !== 0) {
			isPostcodeReal(postcodeUnsanitised)
				.then( (result) => {
					this.setState({
						postcode: result.outcode
					});
					this.getCarbonForecast();
				})
				.catch ( (error) => {
					console.warn(error);
				});
		}
		else {
			this.getCarbonForecast();
		}
	};

	getCarbonForecast = () => {
		let endpoint = `/api/`;
		let method = 'GET';
		let body = null;

		if (this.state.postcode !== false) {
			method = 'POST';
			body = this.state.postcode;
		}

		console.log('postcode', this.state.postcode)

		let request = new XMLHttpRequest();
            request.open(method, endpoint, true);
            request.onreadystatechange = (ev) => {
                if (request.readyState === 4) {
                    if (request.status >= 200 && request.status < 400) {
                        let response = JSON.parse(request.responseText);
                        this.setState({carbon : response.data})
						console.log(this.state)
                    } else {
                    	console.warn('XHR error');
                        // Error :(
                    }
                }
            };
			request.send(body);
	};

	render() {
		let slices = this.state.carbon.map( (x, y) => {
			return <Slice
						key={y}
						timeFromHumanReadable={x.fromHumanReadable}
						timeToHumanReadable={x.toHumanReadable}
						timeFrom={x.from}
						timeTo={x.to}
						carbon={x.intensity.average}
						percentage={x.intensity.percentage}
						index={x.intensity.index}
						indexAbbreviation={x.intensity.indexAbbreviation}
						highest={x.highest}
						lowest={x.lowest}
						day={x.day.name}
						startOfDay={x.day.start}
					/>
		});

		let calculatedWidth = (this.state.carbon.length * 7);

		let styleInner = {};
		let styleFooter = {};

		if (calculatedWidth > 0) {
			styleInner.width = calculatedWidth + "em"
			styleFooter.maxWidth = calculatedWidth + "rem"
		}

		return (
			<React.Fragment>
				<div className={style.timeline} style={styleFooter}>
					<div className={style.timeline__inner} style={styleInner}>
						{slices}
					</div>
				</div>
				<p className={style.key}>(<b>VH</b> = Very high carbon, <b>H</b> = High carbon, <b>M</b> = Moderate, <b>L</b> = Low carbon, <b>VL</b> = Very low carbon)</p>
				<Footer style={styleFooter} />
			</React.Fragment>
		);
	}
}
export default Timeline;
