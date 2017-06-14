$(document).ready(function(){

	var token = localStorage.getItem('access_token');
	var giftAddressId = window.location.href.split("?")[1].split("=")[1];
	var myGiftId = giftAddressId.split('/')[0];

	var myAddressId = giftAddressId.split('/')[1];

	getMyGiftInfo(token, myGiftId);

	$(document).on('click', '.edit', function(){
		$('#editForm').show();
		$('html, body').animate({
        scrollTop: $("#descriptionInfo").offset().top
    }, 300);
		$('#addItemName').val($('#titleInfo').text());

		var options = $('#category2').children().clone();

		$('#category1').change(function() {
			$('#category2').children().remove();
			var rawValue = $(this).val();
			options.each(function () {
				var newValue = this.value;
				if (rawValue[0] == newValue[0] || rawValue[0] =="") {
					$('#category2').append(this);
				}
			});
			$('#category2').val('');
		});

		$('#addDescription').val($('#descriptionInfo').text());
		
		$.ajax({
			url: "https://freehands1337.herokuapp.com/freehands/getalladdresses",
			type: "GET",
			dataType: "json",
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization':'Basic ' + btoa(token)
			}
		}).then(function(data){
			var addressesCount = data.length;
			if (addressesCount != 0){

				for (var i = addressesCount - 1; i >= 0; i--) {
					$('#addressesList')
					.append($("<option></option>")
						.attr("value", data[i].id_str)
						.text(data[i].country + ', ' + 
							data[i].city + ', ' + 
							data[i].street));
				}
			}
		});	

		var cloud_name = 'dn5wbzrci';
		var preset_name = 'w0zhaa3i';

		$.cloudinary.config({
			cloud_name: cloud_name
		})

		$('.upload_field').unsigned_cloudinary_upload(preset_name, {
			cloud_name: cloud_name
		}, {
			multiple: true
		}).bind('cloudinarydone', function(e, data) {
			$('#photosToAdd').append($.cloudinary.image(data.result.public_id, {
				format: 'jpg',
				gravity: 'face'
			}));
			return true;
		}
		).bind('cloudinaryprogress', function(e, data) {
			var percent = Math.round((data.loaded * 100.0) / data.total);
			$('.progress_bar').css('width', percent + '%');
		});

	});


	$('#editItemForm').validate({

		submitHandler: function(form) {

			var title = $('#addItemName').val();
			var category1 = $('#category1 option:selected').val();
			var category2 = $('#category2 option:selected').text();
			var description = $('#addDescription').val();
			var addressId = $('#addressesList option:selected').val();
			var photo1;
			var photo2;
			var photo3;
			var countPhoto = $("#photosToAdd").children().length;

			switch (countPhoto) {
				case 0:
				photo1 = null;
				photo2 = null;
				photo3 = null;
				break;
				case 1:
				photo1 = $("#photosToAdd").children().eq(0).attr('src');
				photo2 = null;
				photo3 = null;
				break;
				case 2:
				photo1 = $("#photosToAdd").children().eq(0).attr('src');
				photo2 = $("#photosToAdd").children().eq(1).attr('src');
				photo3 = null;
				break;
				case 3:
				photo1 = $("#photosToAdd").children().eq(0).attr('src');
				photo2 = $("#photosToAdd").children().eq(1).attr('src');
				photo3 = $("#photosToAdd").children().eq(2).attr('src');
				break;
				default:
				photo1 = $("#photosToAdd").children().eq(0).attr('src');
				photo2 = $("#photosToAdd").children().eq(1).attr('src');
				photo3 = $("#photosToAdd").children().eq(2).attr('src');
			};

			var editGiftJson = getEditGiftJson(title, category1, category2, description, photo1, photo2, photo3);

			var editGift = JSON.stringify(editGiftJson);

			$.ajax({
				url: "https://freehands1337.herokuapp.com/freehands/" + myGiftId + "/" + addressId + "/editproduct",
				type: "PUT",
				dataType: "json",
				data: editGift,
				contentType: "application/json; charset=utf-8",
				headers: {
					'Authorization':'Basic ' + btoa(token)
				}
			}).then(function(data){
				$('#editForm').hide();
				$('.edit').show();
				getMyGiftInfo(token, myGiftId);
				$('body,html').animate({scrollTop: 0}, 300);
			});
		}

	});


	$(document).on('click', '#deleteGift', function(){
		$.ajax({
			url: "https://freehands1337.herokuapp.com/freehands/" + myGiftId + "/deleteproduct",
			type: "DELETE",
			dataType: "json",
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization':'Basic ' + btoa(token)
			}
		}).then(function(data){
			$.ajax({
				url: "https://freehands1337.herokuapp.com/freehands/getallmyproductscurrent",
				type: "GET",
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				headers: {
					'Authorization':'Basic ' + btoa(token)
				}
			});
			location.href = "myGifts.html";
		});
	});

	

	google.maps.event.addDomListener(
		window,
		'load',
		function () {
			window.setTimeout(initialize, 3000);
		});

});


function getEditGiftJson (title, category1, category2, description, photo1, photo2, photo3){
	var editGiftJson;

	if (title && description  && (photo1 != null)){

		editGiftJson = {
			title: title,
			category1: category1,
			category2: category2,
			description: description,
			photo1: photo1,
			photo2: photo2,
			photo3: photo3
		};
	} else if ((!title) && description && (photo1 != null)){
		editGiftJson = {
			category1: category1,
			category2: category2,
			description: description,
			photo1: photo1,
			photo2: photo2,
			photo3: photo3
		};
	} else if ((!title) && (!description) && (photo1 != null)) {
		editGiftJson = {
			category1: category1,
			category2: category2,
			photo1: photo1,
			photo2: photo2,
			photo3: photo3
		};
	} else if (title && (!description) && (photo1 != null)) {
		editGiftJson = {
			title: title,
			category1: category1,
			category2: category2,
			photo1: photo1,
			photo2: photo2,
			photo3: photo3
		};
	} else if (title && description && (photo1 == null)) {
		editGiftJson = {
			title: title,
			category1: category1,
			category2: category2,
			description: description
		};
	} else if (title && (!description) && (photo1 == null)) {
		editGiftJson = {
			title: title,
			category1: category1,
			category2: category2
		};
	} else if ((!title) && description && (photo1 == null)) {
		editGiftJson = {
			category1: category1,
			category2: category2,
			description: description
		};
	} else {
		editGiftJson = {
			category1: category1,
			category2: category2
		};
	}
	return editGiftJson;
}



function getMyGiftInfo(token, myGiftId){
	$.ajax({
		url: "https://freehands1337.herokuapp.com/freehands/getallmyproductscurrent",
		type: "GET",
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		headers: {
			'Authorization':'Basic ' + btoa(token)
		}
	}).then(function(data){
		for (var i = 0; i <= data.length - 1; i++) {
			if (data[i].id_str == myGiftId) {
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
				$('#addressInfo').text(data[i].address.street + ', ' + data[i].address.city + ', ' + data[i].address.country);
				$('#descriptionInfo').text(data[i].description);
				$('#dateInfo').text('Gift was added on ' + data[i].timeadd.dayOfMonth + ' ' + data[i].timeadd.month + ' ' + data[i].timeadd.year);

				var wishers = data[i].wishers;
				if (wishers.length == 0){
					$('#giftWishers').empty();
					$('#giftWishers')
					.append($("<p></p>")
						.text("There are no wishers for this gift"));
				} else {
					var wishersInfo = {
						wishers: wishers
					};

					var strWishers = JSON.stringify(wishersInfo);

					$.ajax({
						url: "https://freehands1337.herokuapp.com/freehands/getmywishers",
						type: "PUT",
						dataType: "json",
						data: strWishers,
						contentType: "application/json; charset=utf-8",
						headers: {
							'Authorization':'Basic ' + btoa(token)
						}
					}).then(function(data){
						$('#giftWishers').empty();
						for (var j = 0; j <= data.length - 1; j++) {
							var idWisher = data[j].id_str;
							$('#giftWishers').append('<div class="row item" id="' + idWisher +'"><div class="col-lg-10 col-sm-10 col-xs-10">' + 
								'<p class="wisherInfo" id="wisherString' + j +'"></p></div><div class="col-lg-2 col-sm-2 col-xs-2">' + 
								'<div class="giveGift" title="To give the gift"><i class="fa fa-gift" aria-hidden="true"></i>'+ 
								'</div></div></div>');
							var name = 'no name';
							var phone = 'no phone';
							if ((data[j].phone != null) && (data[j].phone != " ") && (data[j].phone)) {
								phone = 'phone ' + data[j].phone;
							}
							if ((data[j].firstName != null) && (data[j].firstName != "")) {
								name = data[j].firstName;
							}

							$('#wisherString' + j).text(data[j].email + ', ' + 
								phone + ', ' + name);

						}

					});


					



				}
			}
		}
	});
}

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
