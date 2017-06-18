$(document).ready(function(){

	var token = localStorage.getItem('access_token');



	$.ajax({
		url: "https://freehands1337.herokuapp.com/freehands/getallmyproductscurrent",
		type: "GET",
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		headers: {
			'Authorization':'Basic ' + btoa(token)
		}
	}).then(function(data){

		var giftsCount = data.length;
		if (giftsCount == 0){
			$('#giftsListInfo')
			.append($("<p></p>")
				.text("No gifts to show"));
		} else{
				var n = 0;
				for (var i = giftsCount - 1; i >= 0; i--) {
					if (data[i].id_str !== null){
					var idGift = data[i].id_str;
					var idAddress;
					if (data[i].address === null){
						idAddress = null;
					} else {
					idAddress = data[i].address.id_str;
					}
					var photoUrl = 'img/show.jpg';
					if (data[i].photo1 != null) {
						photoUrl = data[i].photo1;
					}
					if (n%3 == 0) {
						$('#giftsListInfo').append('<div class="row gift" id="' + (n/3) + '"></div>');
						$('#' + (n/3)).append('<div class="col-sm-4">' + 
							'<div class="thumbnail" id="' + idGift + '/' + idAddress + '"><img src=' + photoUrl + ' alt="">'+
							'<div class="caption"><h5>' + data[i].title + '</h5><p>' + 
							data[i].productAd + '</p><p><i class="fa fa-gratipay" aria-hidden="true">' + 
						'</i> ' + data[i].wishers.length + '</p><p><a class="btn btn-primary href-btn myGiftDeteails">Details >></a>' + 
							'</div></div></div>');
					} else{
						$('.row.gift:last-child').append('<div class="col-sm-4">' + 
							'<div class="thumbnail" id="' + idGift + '/' + idAddress + '"><img src=' + photoUrl + ' alt="">' +
							'<div class="caption"><h5>' + data[i].title + '</h5><p>' + 
							data[i].productAd + '</p><p><i class="fa fa-gratipay" aria-hidden="true">' + 
						'</i> ' + data[i].wishers.length + '</p><p><a class="btn btn-primary href-btn myGiftDeteails">Details >></a>' + 
							'</div></div></div>');
					};
				};
			}
		};	
	});

	$(document).on('click', '.myGiftDeteails', function(){
		var itemId = $(this).closest('.thumbnail').attr('id');
		window.location.href = "myGiftFullInfo.html?id=" + itemId;
	});


});