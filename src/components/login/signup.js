import React, { Component } from 'react';
import {
	StyleSheet,
	Image,
	Text,
	View,
	ScrollView,
	TouchableOpacity,
	Alert,
	TextInput,
	Button,
	Keyboard,
	ToastAndroid,
	ActivityIndicator
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { onPressSignUp } from '../../actions/loginAction';
import { styles } from '../../assets/styles/signin_styles';
import PropTypes from 'prop-types';

/**
 * Screen for signup.
 * @extends Component
 */
class Signup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			name: ''
		};
	}

	componentDidUpdate() {
		// Typical usage (don't forget to compare props):
		if (!this.props.login.loading && this.props.login.signInType !== null) {
			ToastAndroid.show('Registration successful', ToastAndroid.SHORT);
			Actions.profile();
		}
	}

	/**
	 * Hides the Keyboard and calls onPressSignUp function in loginAction screen.
	 */
	handleSignUp() {
		Keyboard.dismiss();
		this.props.onPressSignUp(this.state.email, this.state.password);
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.field}>
					<TextInput
						autoCapitalize="none"
						autoCorrect={false}
						ref={input => (this.nameInput = input)}
						onChangeText={name => this.setState({ name })}
						onSubmitEditing={() => this.emailInput.focus()}
						returnKeyType="next"
						style={styles.field_Pass}
						placeholder={'Name'}
					/>
					<TextInput
						autoCapitalize="none"
						autoCorrect={false}
						ref={input => (this.emailInput = input)}
						onChangeText={email => this.setState({ email })}
						onSubmitEditing={() => this.passwordInput.focus()}
						keyboardType="email-address"
						returnKeyType="next"
						style={styles.field_Pass}
						placeholder="Email"
					/>
					<TextInput
						ref={input => (this.passwordInput = input)}
						style={styles.field_Pass}
						onChangeText={password => this.setState({ password })}
						// onSubmitEditing={() => this.passwordConfirmInput.focus()}
						returnKeyType="next"
						secureTextEntry={true}
						placeholder="Password"
					/>
				</View>
				<TouchableOpacity
					style={styles.button_send}
					onPress={() => this.handleSignUp()}
				>
					<Text style={styles.button_text}> Register </Text>
				</TouchableOpacity>
				{this.props.login.loading ? (
					<ActivityIndicator size={'large'} />
				) : null}
			</View>
		);
	}
}
Signup.propTypes = {
	onPressSignUp: PropTypes.func.isRequired,
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
			onPressSignUp: onPressSignUp
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

export default connect(mapStateToProps, matchDispatchToProps)(Signup);
