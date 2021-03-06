
// Set default location to Decathlon Brossard
var startLat = 45.4717;
var startLong = -73.4718;
var map;

// Allows to get the users location
document.getElementById("FindMe").onclick = function userLocation() {
	getUserGeolocation();
};

function getUserGeolocation() {
	// If this succeeds, then it means the browser supports this API.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(getLocationSuccess, getLocationFailed);
	}
}

// Sets the map center to the current user location
function getLocationSuccess(position) {
	map.setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
}

// Pops up the alert window if location access is denied
function getLocationFailed(error) {
	alert(("Location access denied. " + error.message)
}

// Creates and initialises the map
function initMap() {
	// Set the center of the map to Décathlon Brossard or users location
	var location = { lat: startLat, lng: startLong };
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 11,
		center: location
	});

	// Sport Places API End Point					
	var url = 'https://sportplaces-api.herokuapp.com/api/v1/places?origin=-73.4718,45.4717&radius=99&sports=132'

	// Add the markers automatically
	map.data.loadGeoJson(url);

	// Declaring places as an Array
	var places = [];

	// API Call
	$.ajax({
		url: url,
		method: 'GET',
		dataType: 'JSON',
		data: {},
		success: function (data) {
			initInfoWindowsToMarkers(data.features);
		},
		error: function (err) {
			console.log('error:' + err);
		}
	})

	// Initialises the info window to the markers
	function initInfoWindowsToMarkers(places) {
		var placesObjects = places

		// Loop on all sport places retrieved					
		for (i = 0; i < placesObjects.length; i++) {
			createInfoWindow();
		}

		// Creation of the Info Window(s)
		function createInfoWindow() {

			// Initiatize an empty marker
			var infowindow = new google.maps.InfoWindow({ content: 'Loading...' });

			// Click event on a marker to show Info Window
			map.data.addListener('click', function (event) {
				var myHTML = constructHTMLPopUp(event.feature.f);
				infowindow.setContent(myHTML);
				infowindow.setPosition(event.feature.getGeometry().get());
				infowindow.setOptions({ pixelOffset: new google.maps.Size(0, -30) });
				infowindow.open(map);
			});
		}

		function constructHTMLPopUp(sportPlace) {
			
			// Insert information of each Sport Place to each markers Info Window
			var HtmlString = '<div id="content" style="width:150px;">' +
				'<div id="siteNotice">' +
				'</div>' +
				'<h3 id="placeHeading" class="placeHeading">' + sportPlace.name + '</h3>' +
				'<div id="bodyContent">' +
				'<p>' + sportPlace.contact_details.email + ' ' +
				sportPlace.contact_details.phone + ' ' +
				sportPlace.contact_details.website + ' ' +
				sportPlace.contact_details.booking_url + ' ' +
				sportPlace.contact_details.facebook_username + ' ' +
				sportPlace.address_components.address + '' +
				sportPlace.address_components.city + ' ' +
				sportPlace.address_components.province + ' ' +
				sportPlace.address_components.country +
				'</div>' +
				'</div>';
			return HtmlString;
		}
	}
}
