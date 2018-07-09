import React, { Component } from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	TextInput,
	ToastAndroid,
	ActivityIndicator
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { onForget } from '../../actions/loginAction';
import { Actions } from 'react-native-router-flux';
import { styles } from '../../assets/styles/signin_styles';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Feather';
import { Header, Title, Left, Body } from 'native-base';

/**
 * Renders the forget password screen
 * @extends Component
 */
class Forgot extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: ''
		};
	}

	handleForget() {
		if (this.validateEmail(this.state.email)) {
			this.props.onForget(this.state.email);
		}
	}

	validateEmail(inputEmail) {
		if (inputEmail === '') {
			ToastAndroid.show(
				'You can leave the email field blank!',
				ToastAndroid.SHORT
			);
			return false;
		} else {
			var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			if (!inputEmail.match(mailformat)) {
				ToastAndroid.show(
					'Please check your email format',
					ToastAndroid.SHORT
				);
				return false;
			} else {
				return true;
			}
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<Header transparent androidStatusBarColor="#1c76cb">
					<Left>
						<TouchableOpacity onPress={() => Actions.pop()}>
							<Icon name="chevron-left" size={40} />
						</TouchableOpacity>
					</Left>
					<Body>
						<Title />
					</Body>
				</Header>
				<View style={styles.box}>
					<Text style={styles.heading}>Forget Password</Text>
					<TextInput
						placeholder="Email"
						style={styles.input_field}
						autoCapitalize="none"
						onChangeText={email => this.setState({ email })}
					/>
					<TouchableOpacity
						style={styles.button_send}
						onPress={() => this.handleForget()}
					>
						<Text style={styles.button_text}> Send email </Text>
					</TouchableOpacity>
				</View>
				{this.props.login.loading ? (
					<ActivityIndicator size={'large'} color="white" />
				) : null}
			</View>
		);
	}
}

/**
 * Checks that the functions specified as isRequired are present and warns if the
 * props used on this page does not meet the specified type.
 */
Forgot.propTypes = {
	onForget: PropTypes.func.isRequired,
	login: PropTypes.object
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
			onForget: onForget
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
	login: state.login
});

export default connect(mapStateToProps, matchDispatchToProps)(Forgot);
