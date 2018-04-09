import React from "react";
import Slice from '../Slice/index.js';
import style from './Timeline.css';

class Timeline extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			carbon : []
		};
		this.getCarbonForecast(this.props.duration);
	};

	getCarbonForecast = (duration) => {
		fetch(`/api/${duration}`)
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

		let inlineStyle = {
			width: (this.state.carbon.length * 150) + "px"
		}

		return (
			<div className={style.timeline} style={inlineStyle}>
				{console.log(this.state.carbon)}
				{slices}
			</div>
		);
	}
}
export default Timeline;

//https://api.carbonintensity.org.uk/intensity/2018-04-07T19:38:31.654Z/fw48h