$(document).ready(function(){
	var token = localStorage.getItem('access_token');
	var giftId = window.location.href.split("?")[1].split("=")[1];
	

	$.ajax({
		url: " https://freehands1337.herokuapp.com/freehands/getallproductswithoutuser",
		type: "GET",
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		headers: {
			'Authorization':'Basic ' + btoa(token)
		}
	}).then(function(data){
		for (var i = 0; i <= data.length - 1; i++) {
			if (data[i].id_str == giftId) {

				if ((data[i].photo1 != null) && (data[i].photo2 == null) && (data[i].photo3 == null)) {
					$('#onePhoto').attr({
						src: data[i].photo1,
						alt: data[i].title
					});
				} else
				if ((data[i].photo2 != null) && (data[i].photo3 == null)) {
					$('.image').css('display', 'none');
					$('#myCarousel').show();
					$('#photo1').attr({
						src: data[i].photo1,
						alt: data[i].title
					});
					$('#photo2').attr({
						src: data[i].photo2,
						alt: data[i].title
					});
				} else
				if (data[i].photo3 != null) {
					$('.image').css('display', 'none');
					$('#myCarousel').show();
					$('#photo1').attr({
						src: data[i].photo1,
						alt: data[i].title
					});
					$('#photo2').attr({
						src: data[i].photo2,
						alt: data[i].title
					});
					$('.carousel-indicators').append('<li data-target="#myCarousel" data-slide-to="2"></li>');
					$('.carousel-inner').append('<div class="item">' +
									'<img id="photo3" src="" alt=""></div>');
					$('#photo3').attr({
						src: data[i].photo3,
						alt: data[i].title
					});
				}
				
				$('#titleInfo').text(data[i].title);
				$('#addressInfo').text(data[i].address.city + ', ' + data[i].address.country);
				$('#descriptionInfo').text(data[i].description);
				$('#dateInfo').text('Gift was added on ' + data[i].timeadd.dayOfMonth + ' ' + data[i].timeadd.month + ' ' + data[i].timeadd.year);
				var wishers = data[i].wishers;
				$('#countWisherGift').text(wishers.length);

			}
		}

	});

	google.maps.event.addDomListener(
		window,
		'load',
		function () {
			window.setTimeout(initialize, 2500);
		}
		);


	$(document).on('click', '#toWishGift', function(){
		$.ajax({
			url: "https://freehands1337.herokuapp.com/freehands/" + giftId + "/iwantit",
			type: "GET",
			dataType: "json",
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization':'Basic ' + btoa(token)
			},
			error: function(){
				alert("Oops, it seems that you have already want this gift. Check your wishes' list" );
			}
		}).then(function(data){
			$('#toWishGift').css('display', 'none');
			$('#toNotWishGift').css('display', 'inline-block');
		});
	});

	$(document).on('click', '#toNotWishGift', function(){
		$.ajax({
			url: "https://freehands1337.herokuapp.com/freehands/" + giftId + "/idontwantit",
			type: "GET",
			dataType: "json",
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization':'Basic ' + btoa(token)
			}
		}).then(function(data){
			$('#toNotWishGift').css('display', 'none');
			$('#toWishGift').show();
		});
	});


});



function initialize() {
	var map;
	var address =$('#addressInfo').text();
	var geocoder = new google.maps.Geocoder();
	
	if (geocoder) {
		geocoder.geocode({
			'address': address
		}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
					var myOptions = {
						zoom: 8,
						center: results[0].geometry.location,
						mapTypeControl: true,
						mapTypeControlOptions: {
							style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
						},
						navigationControl: true,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};
					map = new google.maps.Map(document.getElementById("map"), myOptions);


					var marker = new google.maps.Marker({
						position: results[0].geometry.location,
						map: map,
						title: address
					});
					google.maps.event.addListener(marker, 'click', function() {
						infowindow.open(map, marker);
					});

				} else {
					alert("No results found");
				}
			} else {
				alert("Geocode was not successful for the following reason: " + status);
			}
		});
	}
}
