// Import all the Images for each category
const road_marker = require('../assets/images/road_marker_100.png');
const health_marker = require('../assets/images/health_marker_100.png');
const fire_marker = require('../assets/images/fire_marker_100.png');
const flood_marker = require('../assets/images/floods_marker_100.png');
const electric_marker = require('../assets/images/electric_marker_100.png');
const all_marker = require('../assets/images/earthquake-30-512.png');

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
		color: '#d35400'
	},
	health: {
		title: 'Health',
		category: 'health',
		image: health_marker,
		color: '#2980b9'
	},
	flood: {
		title: 'Floods',
		category: 'flood',
		image: flood_marker,
		color: '#2980b9'
	},
	blackout: {
		title: 'Electricity Blackout',
		category: 'blackout',
		image: electric_marker,
		color: '#2ecc71'
	}
};

// Get image for the given category
getMarkerImage = category => {
	return categories[category].image;
};

export { categories, getMarkerImage };
