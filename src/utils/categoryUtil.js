// Import all the Images for each category
const road_marker = require('../assets/images/map/road.png');
const health_marker = require('../assets/images/map/medical-icon.png');
const fire_marker = require('../assets/images/map/fire.png');
const flood_marker = require('../assets/images/map/floods_marker_100.png');
const electric_marker = require('../assets/images/map/electric_marker_100.png');
const earthquake_marker = require('../assets/images/map/earthquakes.png');
const all_marker = require('../assets/images/map/disaster.png');

// Defing properties for the categories of incidents
const categories = {
	all: {
		title: 'All Incidents',
		category: 'all',
		image: all_marker
	},
	road: {
		title: 'Road Accident',
		category: 'road',
		image: road_marker,
		color: '#2c3e50'
	},
	fire: {
		title: 'Fire',
		category: 'fire',
		image: fire_marker,
		color: '#ed810e'
	},
	health: {
		title: 'Health',
		category: 'health',
		image: health_marker,
		color: '#ff0000'
	},
	flood: {
		title: 'Floods',
		category: 'flood',
		image: flood_marker,
		color: '#6fc8f2'
	},
	blackout: {
		title: 'Electricity Blackout',
		category: 'blackout',
		image: electric_marker,
		color: '#000'
	},
	earthquake: {
		title: 'Earthquake',
		category: 'earthquake',
		image: earthquake_marker,
		color: '#473118'
	}
};

// Get image for the given category
getMarkerImage = category => {
	return categories[category].image;
};

// Get color for the given category
getColor = category => {
	return categories[category].color;
};
export { categories, getMarkerImage, getColor };
