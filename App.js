import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import Route from './src/utils/routes';
import { ActivityIndicator } from 'react-native';

import configureStore from './src/utils/store';
let { store, persistor } = configureStore();

/**
 * Navigator using React-Native-Router-Flux
 * @extends Component
 */
export default class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					{loading => {
						if (!loading) {
							return <ActivityIndicator size={'large'} />;
						} else {
							var initial = true;
							if (
								store.getState().login.userFirebase.length == 0
							) {
								return <Route initial={initial} />;
							} else {
								return <Route initial={!initial} />;
							}
						}
					}}
				</PersistGate>
			</Provider>
		);
	}
}
