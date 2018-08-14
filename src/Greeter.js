import React, { Component } from 'react';
import config from './config.json';
import styles from './greeter.css';
import './test.scss';
import Google from './google_image.jpg?{"size":[300,600,900,]}';

class Greeter extends Component {
	render() {
        return <div className={styles.root}>
                    <h1>{config.greetText}</h1>
                    <img srcSet={Google.srcSet} src={Google.src}/>
              </div>;
	}
}

export default Greeter;
