import React from "react";
import style from './Footer.css';

import wwf from 'svg-url-loader?iesafe&noquotes!./wwf.svg';
import edf from 'svg-url-loader?iesafe&noquotes!./edf.svg';
import nationalgrid from 'svg-url-loader?iesafe&noquotes!./national-grid.svg';
import neso from 'svg-url-loader?iesafe&noquotes!./neso.svg';

class Footer extends React.Component {
    render() {
        return(
            <footer className={style.ftr} style={this.props.style}>
                <a className={style['logo-link--edf']} href="https://www.edf.org" target="_blank">
                    <img src={edf} alt="Environment Defense Fund logo" role="presentation" />
                    <span className={style.vh}>Environment Defense Fund</span>
                </a>
                <a style={{ height: '100%' }} className={style['logo-link--ng']} href="https://www.neso.energy/" target="_blank">
                    <img src={neso} alt="National Grid logo" role="presentation" />
                    <span className={style.vh}>National Grid</span>
                </a>
                <a className={style['logo-link--wwf']} href="https://www.wwf.org.uk/" target="_blank">
                    <img src={wwf} alt="WWF logo" role="presentation" />
                    <span className={style.vh}>WWF</span>
                </a>
            </footer>
        )
    }
}

export default Footer;
