import React, { Component } from 'react';
import config from './config.json';
import styles from './greeter.css';
import './test.scss';

class Greeter extends Component {
	render() {
        return <div className={styles.root}>
                    <h1>{config.greetText}</h1>
              </div>;
	}
}

export default Greeter;
