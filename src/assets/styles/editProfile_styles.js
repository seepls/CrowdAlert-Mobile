import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

//Styling used in main login page containing all login options.
export const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	field_Pass: {
		marginHorizontal: width / 20,
		width: width * 0.9,
		marginTop: height / 50,
		height: 40
	},
	updateButton: {
		alignItems: 'center',
		backgroundColor: '#000',
		padding: width / 30,
		width: width / 3,
		marginHorizontal: width / 3,
		marginTop: height / 50,
		marginBottom: height / 20,
		borderRadius: 10
	},
	updateText: {
		color: 'white'
	}
});
