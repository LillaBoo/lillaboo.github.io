$(document).ready(function(){

	
	function initialize() {

		
		var input = $('#autocomplete')[0];

		var autocomplete = new google.maps.places.Autocomplete(input, {types: ['geocode']});

		google.maps.event.addListener(autocomplete, 'place_changed', function() {
			var place = autocomplete.getPlace(); 
			var components_by_type = {};
			for (var i = 0; i < place.address_components.length; i++) {
				var c = place.address_components[i];
				components_by_type[c.types[0]] = c;
			}
			$('#addCountry').attr('disabled', false);
			$('#addCity').attr('disabled', false);
			$('#addStreet').attr('disabled', false);
			$('#addCountry').val(components_by_type['country'].long_name);
			$('#addCity').val(components_by_type['locality'].long_name);
			$('#addStreet').val(components_by_type['route'].long_name);
		});

		

	};


	google.maps.event.addDomListener(window, 'load', initialize);




	$('#addAddressForm').validate({

		rules: {
			addCountry: {
				required: true
			},
			addCity: {
				required: true
			},
			addStreet: {
				required: true
			}
		},
		messages: {
			addCountry: {
				required: "Please enter your country"
			},
			addCity: {
				required: "Please enter your city"
			},
			addStreet: {
				required: "Please enter your street"
			}
		},
		submitHandler: function(form) {

			var token = localStorage.getItem('access_token');
			var country = $('#addCountry').val();
			var city = $('#addCity').val();
			var street = $('#addStreet').val();

			var newAddress = {
				country: country,
				city: city,
				street: street
			};

			var address = JSON.stringify(newAddress);

			$.ajax({
				url: "https://freehands1337.herokuapp.com/freehands/newaddress",
				type: "POST",
				dataType: "json",
				data: address,
				contentType: "application/json; charset=utf-8",
				headers: {
					'Authorization':'Basic ' + btoa(token)
				},
				success: function(){
					location.href = "myAddresses.html"
				},
				error: function(){
					alert("Ckeck your address");
				}
			});
		}
	});


});