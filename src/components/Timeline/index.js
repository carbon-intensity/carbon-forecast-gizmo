import React from "react";
import Slice from '../Slice/index.js';
import style from './Timeline.css';

import wwf from 'svg-url-loader?iesafe&noquotes!./wwf.svg';
import edf from 'svg-url-loader?iesafe&noquotes!./edf.svg';
import nationalgrid from 'svg-url-loader?iesafe&noquotes!./national-grid.svg';

class Timeline extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			carbon : []
		};
		this.getCarbonForecast();
	};

	getCarbonForecast = (duration) => {
		fetch(`/api/`)
			.then( (response) => {
				return response.json()
			})
			.then( (response) => {
				this.setState({carbon : response.data})
			})
			.catch( err => {
				console.warn(err)
			})
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

		let calculatedWidth = (this.state.carbon.length * 7) + "em";

		let styleInner = {
			width: calculatedWidth
		};

		let styleFooter = {
			maxWidth: calculatedWidth
		};

		return (
			<React.Fragment>
				<div className={style.timeline}>
					<div className={style.timeline__inner} style={styleInner}>
						{slices}
					</div>
				</div>
				<p className={style.key}>(<b>VH</b> = Very high carbon, <b>H</b> = High carbon, <b>M</b> = Moderate, <b>L</b> = Low carbon, <b>VL</b> = Very low carbon)</p>
				<footer className={style.ftr} style={styleFooter}>
					<a className={style['logo-link--edf']} href="https://www.edf.org" target="_blank">
						<img src={edf} alt="" />
					</a>
					<a className={style['logo-link--ng']} href="http://www.nationalgrid.com/uk/" target="_blank">
						<img src={nationalgrid} alt="" />
					</a>
					<a className={style['logo-link--wwf']} href="https://www.wwf.org.uk/" target="_blank">
						<img src={wwf} alt="" />
					</a>
				</footer>
			</React.Fragment>
		);
	}
}
export default Timeline;

//https://api.carbonintensity.org.uk/intensity/2018-04-07T19:38:31.654Z/fw48h