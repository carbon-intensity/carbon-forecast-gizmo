import React from "react";
import Slice from '../Slice/';
import Footer from '../Footer/';
import style from './Timeline.css';

class Timeline extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			carbon : []
		};
		this.getCarbonForecast();
	};

	getCarbonForecast = (duration) => {
		let endpoint = `/api/`;

		// fetch(endpoint)
		// 	.then( (response) => {
		// 		return response.json()
		// 	})
		// 	.then( (response) => {
		// 		this.setState({carbon : response.data})
		// 	})
		// 	.catch( err => {
		// 		console.warn(err)
		// 	})

		let request = new XMLHttpRequest();
            request.open('GET', endpoint, true);
            request.onreadystatechange = (ev) => {
                if (request.readyState === 4) {
                    if (request.status >= 200 && request.status < 400) {
                        let response = JSON.parse(request.responseText);
                        this.setState({carbon : response.data})
                    } else {
                    	console.warn('XHR error');
                        // Error :(
                    }
                }
            };
			request.send();
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
