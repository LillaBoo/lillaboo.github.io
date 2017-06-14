$(document).ready(function(){

	var token = localStorage.getItem('access_token');

	$.ajax({
		url: "https://freehands1337.herokuapp.com/freehands/fulluserinfo",
		type: "GET",
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		headers: {
			'Authorization':'Basic ' + btoa(token)
		}
	}).then(function(data){

		var wishesCount = data.wishes.length;
		if (wishesCount == 0){
			$('#wishesListInfo')
			.append($("<p></p>")
				.text("You haven't wished any gift yet"));
		} else{
			var wishes = data.wishes;
			var wishesInfo = {
				wishes: wishes
			};

			var strWishes = JSON.stringify(wishesInfo);

			$.ajax({
				url: "https://freehands1337.herokuapp.com/freehands/getmywishes",
				type: "PUT",
				dataType: "json",
				data: strWishes,
				contentType: "application/json; charset=utf-8",
				headers: {
					'Authorization':'Basic ' + btoa(token)
				}
			}).then(function(data){
				var n = 0;
				for (var j = data.length - 1; j >= 0; j--) {
					var idGift = data[j].id_str;
					var photoUrl = 'img/show.jpg';
					if (data[j].photo1 != null) {
						photoUrl = data[j].photo1;
					};

					if (n%3 == 0) {
						$('#wishesListInfo').append('<div class="row gift" id="' + (n/3) + '"></div>');
						$('#' + (n/3)).append('<div class="col-sm-4">' + 
							'<div class="thumbnail" id="' + idGift + '"><img src=' + photoUrl + ' alt="">'+
							'<div class="caption"><h5>' + data[j].title + '</h5><p>' + 
							data[j].address.city + '</p><p><i class="fa fa-gratipay" aria-hidden="true">' + 
						'</i> ' + data[j].wishers.length + '</p><p><a class="btn btn-primary href-btn myWishDeteails">Details >></a>' + 
							'</div></div></div>');
					} else{
						$('.row.gift:last-child').append('<div class="col-sm-4">' + 
							'<div class="thumbnail" id="' + idGift + '"><img src=' + photoUrl + ' alt="">' +
							'<div class="caption"><h5>' + data[j].title + '</h5><p>' + 
							data[j].address.city + '</p><p><i class="fa fa-gratipay" aria-hidden="true">' + 
						'</i> ' + data[j].wishers.length + '</p><p><a class="btn btn-primary href-btn myWishDeteails">Details >></a>' + 
							'</div></div></div>');
					};
				};

			});
		}
	});

	$(document).on('click', '.myWishDeteails', function(){
		var itemId = $(this).closest('.thumbnail').attr('id');
		window.location.href = "myWishFullInfo.html?id=" + itemId;
	});

});