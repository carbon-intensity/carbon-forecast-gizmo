import React from 'react';
import styles from './Slice.css';
import plug from 'svg-url-loader?iesafe&noquotes!./plug.svg';
import unplug from 'svg-url-loader?iesafe&noquotes!./unplug.svg';
class Slice extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};

		if (props.startOfDay === true) {
			this.state.day = <p className={styles.day}>{this.props.day}</p>
			this.state.sliceStyle = `${styles.slice} ${styles['slice--new-day']}`;
		}
		else {
			this.state.sliceStyle = `${styles.slice}`;
		}

		if(props.lowest === true) {
			this.state.lowest = <p className={styles['plug-in']}><img src={plug} alt="" width="24" height="24" />Plug in</p>;
			this.state.sliceStyle += ` ${styles['slice--lowest']}`
		}

		if(props.highest === true) {
			this.state.highest = <p className={styles.unplug}><img src={unplug} alt="" width="24" height="24" />Unplug</p>;
			this.state.sliceStyle += ` ${styles['slice--highest']}`
		}
	}

	render() {

		let houseTitle = `${this.props.carbon}g CO₂ per kWh`;
		let indicatorStyle = `${styles.indicator} ${styles['indicator--' + this.props.index.replace(/ /g, '-')]}`;

		// let backgroundAsAGraph = {
		// 	backgroundImage: `linear-gradient(to top, #eeeeee 0%, #eeeeee ${this.props.percentage}%, #ffffff ${this.props.percentage}%, #ffffff 100%)`
		// };

		return (
			<section className={this.state.sliceStyle}>
				<header className={styles.hdr}>
					<p className={styles.time}><time dateTime={this.props.timeFrom}>{this.props.timeFromHumanReadable}</time> &ndash; <time dateTime={this.props.timeTo}>{this.props.timeToHumanReadable}</time></p>
					{this.state.day}
					{this.state.lowest}
					{this.state.highest}
				</header>
				<section className={indicatorStyle}>
					<svg className={styles.indicator__house} width="149" height="146" viewBox="0 0 149 146" xmlns="http://www.w3.org/2000/svg" >
                        <path d="M26 53.196L3 77h23v66h98V77h22L74.5 3 44 34.566V16H26v37.196z" strokeWidth="7" fill="rgba(255,255,255,1)" fillRule="evenodd" strokeLinejoin="round">
                            <title>{houseTitle}</title>
                        </path>
                    </svg>
					<p className={styles.indicator__text} title={houseTitle}>{this.props.indexAbbreviation}<span className={styles.vh}> - {this.props.index}</span></p>
				</section>
			</section>
		);
	}
}
export default Slice;
