import React, { Component } from 'react';
import {
	Text,
	View,
	Platform,
	Dimensions,
	TouchableOpacity,
	Keyboard,
	ActivityIndicator,
	Picker,
	Modal,
	Image
} from 'react-native';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import MapView, { Marker } from 'react-native-maps';
import { bindActionCreators } from 'redux';
import { getMarkerImage } from '../utils/categoryUtil.js';
import { connect } from 'react-redux';
import {
	setLocationOnCustomSearch,
	getCurrLocation
} from '../actions/locationAction';
import { getAllIncidents } from '../actions/incidentsAction';
import { Actions } from 'react-native-router-flux';
import PropTypes from 'prop-types';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { styles, searchBarStyle } from '../assets/styles/map_styles.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import Config from 'react-native-config';
import { GetIncidentFirebase } from '../utility/firebaseUtil';

/**
 * Map screen showing google maps with search location and add incident feature
 * @extends Component
 */
class MapScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			curr_region: {
				latitude: this.props.curr_location.latitude,
				longitude: this.props.curr_location.longitude,
				latitudeDelta: 0.0052,
				longitudeDelta: 0.0052
			},
			marker: {
				latitude: this.props.curr_location.latitude,
				longitude: this.props.curr_location.longitude
			},
			domain: 'all',
			markers: null,
			visibleModal: false
		};
	}

	componentWillMount() {
		this.props.getAllIncidents();
		//Used to check if location services are enabled and
		//if not than asks to enables them by redirecting to location settings.
		if (Platform.OS === 'android') {
			LocationServicesDialogBox.checkLocationServicesIsEnabled({
				message:
					'<h2>Use Location ?</h2> \
                    This app wants to change your device settings:<br/><br/> \
                    Use GPS for location<br/><br/>',
				ok: 'YES',
				cancel: 'NO',
				providerListener: true
			}).then(success => {
				this.props.getCurrLocation().then(() => {
					this.setState({
						curr_region: {
							...this.state.curr_region,
							latitude: this.props.curr_location.latitude,
							longitude: this.props.curr_location.longitude
						},
						marker: {
							latitude: this.props.curr_location.latitude,
							longitude: this.props.curr_location.longitude
						}
					});
				});
			});
		}
	}

	componentWillUnmount() {
		if (Platform.OS === 'android') {
			LocationServicesDialogBox.stopListener();
		}
	}

	handleRelocation(coordinates, type) {
		const mapRef = this.map;

		if (type === 'search') {
			this.props.setLocationOnCustomSearch(
				coordinates['lat'],
				coordinates['lng'],
				coordinates['name']
			);
			this.setState({
				marker: {
					latitude: this.props.location.latitude,
					longitude: this.props.location.longitude
				}
			});
			Keyboard.dismiss();
			mapRef.animateToRegion({
				...this.state.curr_region,
				latitude: this.props.location.latitude,
				longitude: this.props.location.longitude
			});
		} else if (type === 'curr_location') {
			var self = this;
			mapRef.animateToRegion(self.state.curr_region);
			setTimeout(function() {
				self.setState({
					marker: {
						latitude: self.props.curr_location.latitude,
						longitude: self.props.curr_location.longitude
					}
				});
				self.textInput.clear();
			}, 5);
			self.textInput.clear();
		}
	}

	alertItemName = item => {
		this.setState({ domain: item.id });
		this.setState({ visibleModal: false });
	};
	//Modal to be displayed for filter menu.
	_renderModalContent = () => (
		<View>
			<TouchableOpacity
				onPress={() => this.setState({ visibleModal: false })}
			>
				<Icon name="close" size={20} style={styles.modalIcon} />
			</TouchableOpacity>
			<Text style={styles.modalHeadText}>
				Select category from below :{' '}
			</Text>
			<View style={styles.modalContainer}>
				{this.state.names.map((item, index) => (
					<TouchableOpacity
						key={item.id}
						style={styles.modalField}
						onPress={() => this.alertItemName(item)}
					>
						<Image
							style={styles.modalImage}
							source={getMarkerImage(item.id)}
						/>
						<Text style={styles.modalText}>{item.name}</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);

	render() {
		//logic for filter
		var state = this.state;
		if (this.props.incident.all_incidents !== null) {
			var markers = this.props.incident.all_incidents.filter(function(
				item
			) {
				if (state.domain === 'all') {
					return true;
				} else {
					return item.value.category === state.domain;
				}
			});
		}
		return (
			<View style={styles.container}>
				<MapView
					ref={ref => {
						this.map = ref;
					}}
					showsMyLocationButton={true}
					style={styles.map}
					region={this.state.curr_region}
				>
					<MapView.Marker coordinate={this.state.marker} />
					{this.props.incident.all_incidents !== null
						? markers.map(marker => {
								return (
									<MapView.Marker
										key={marker.key}
										coordinate={{
											latitude:
												marker.value.location
													.coordinates.latitude,
											longitude:
												marker.value.location
													.coordinates.longitude
										}}
										title={marker.value.title}
										description={marker.value.details}
										image={getMarkerImage(
											marker.value.category
										)}
									/>
								);
						  })
						: null}
				</MapView>
				<GooglePlacesAutocomplete
					minLength={2}
					listViewDisplayed="auto"
					autoFocus={false}
					returnKeyType={'search'}
					fetchDetails={true}
					query={{
						key: Config.GOOGLE_MAPS_KEY,
						language: 'en'
					}}
					textInputProps={{
						clearButtonMode: 'never',
						ref: input => {
							this.textInput = input;
						}
					}}
					onPress={(data, details = null) => {
						var coordinates = {
							lat: details.geometry.location.lat,
							lng: details.geometry.location.lng,
							name: details.name
						};
						this.handleRelocation(coordinates, 'search');
					}}
					styles={searchBarStyle}
					renderRightButton={() => (
						<TouchableOpacity
							style={styles.clearButton}
							onPress={() => {
								this.textInput.clear();
							}}
						>
							<Icon
								name="remove"
								size={15}
								style={styles.fabButton}
							/>
						</TouchableOpacity>
					)}
				/>
				<TouchableOpacity
					style={styles.filterButton}
					onPress={() => this.setState({ visibleModal: true })}
				>
					<Icon name="filter" size={30} style={styles.fabButton} />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.repositionButton}
					onPress={() => {
						this.handleRelocation(null, 'curr_location');
					}}
				>
					<Icon
						name="map-marker"
						size={30}
						style={styles.fabButton}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.addIncidentButton}
					onPress={() => Actions.addIncident()}
				>
					<Icon name="plus" size={30} style={styles.fabButton} />
				</TouchableOpacity>
				<Modal
					visible={this.state.visibleModal}
					onRequestClose={() => {
						alert('Modal has been closed.');
					}}
				>
					{this._renderModalContent()}
				</Modal>
				{this.props.incident.loading ? (
					<ActivityIndicator size={'large'} />
				) : null}
			</View>
		);
	}
}

//Prop types for prop checking.
MapScreen.propTypes = {
	setLocationOnCustomSearch: PropTypes.func.isRequired,
	getCurrLocation: PropTypes.func.isRequired,
	location: PropTypes.object,
	curr_location: PropTypes.object,
	getAllIncidents: PropTypes.func.isRequired
};

/**
 * Mapping dispatchable actions to props so that actions can be used
 * through props in children components.
 * @param dispatch Dispatches an action to trigger a state change.
 * @return Turns action creator objects into an objects with the same keys.
 */
function matchDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			setLocationOnCustomSearch: setLocationOnCustomSearch,
			getCurrLocation: getCurrLocation,
			getAllIncidents: getAllIncidents
		},
		dispatch
	);
}

/**
 * Mapping state to props so that state variables can be used
 * through props in children components.
 * @param state Current state in the store.
 * @return Returns states as props.
 */
const mapStateToProps = state => ({
	location: state.location.coordinates,
	curr_location: state.location.curr_coordinates,
	incident: state.incident
});

export default connect(mapStateToProps, matchDispatchToProps)(MapScreen);
