$(document).ready(function(){

	var token = localStorage.getItem('access_token');


	if (token != null) {
		$.ajax({
			url: " https://freehands1337.herokuapp.com/freehands/getallproductswithoutuser",
			type: "GET",
			dataType: "json",
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization':'Basic ' + btoa(token)
			}
		}).then(function(data){
			$('.maincontent').append('<div class="container" >' + 
				'<h3 class="text-center">Recent addings</h3>' + 
				'<div id="allGiftsList"></div></div>');
			$('#allGiftsList').hide();
			var giftsCount = data.length;
			if (giftsCount == 0){
				$('#allGiftsList').show();
				$('#allGiftsList')
				.append($("<p></p>")
					.text("No gifts to show"));
			}else{
				var n = 0
				for (var i = giftsCount - 1; i >= 0  ; i--) {
					var idGift = data[i].id_str;
					var photoUrl = 'img/show.jpg';
					if (data[i].photo1 != null) {
						photoUrl = data[i].photo1;
					}
					if (n%3 == 0) {
						$('#allGiftsList').append('<div class="row gift" id="' + (n/3) + '"></div>');
						$('#' + (n/3)).append('<div class="col-sm-4">' + 
							'<div class="thumbnail" id="' + idGift + '"><img src=' + photoUrl + ' alt="">'+
							'<div class="caption"><h5>' + data[i].title + '</h5><p>' + 
							data[i].productAd + '</p><p><a class="btn btn-primary href-btn giftDetails">Details >></a>' + 
							'</div></div></div>');
					} else{
						$('.row.gift:last-child').append('<div class="col-sm-4">' + 
							'<div class="thumbnail" id="' + idGift + '"><img src=' + photoUrl + ' alt="">'+
							'<div class="caption"><h5>' + data[i].title + '</h5><p>' + 
							data[i].productAd + '</p><p><a class="btn btn-primary href-btn giftDetails">Details >></a>' + 
							'</div></div></div>');
					};
					n++;
				};

				$('#allGiftsList').parent().append('<p id="show_more_btn">' + 
					'<a class="btn btn-action btn-lg" role="button">Show more »</a></p>');
				
				$('#allGiftsList').show();
				var rowsCount = 1;
				var rowsMax = $('#allGiftsList .row').length;
				
				$("#allGiftsList").children().hide();

				function showNextRows() {
					var pagination = 3;

					for (var i = rowsCount; i < (rowsCount + pagination); i++) {
						$('.gift:nth-child(' + i + ')').show();
					}

					rowsCount += pagination;

					if (rowsCount > rowsMax) {
						$('#show_more_btn').hide();
					}
				};

				showNextRows();

				$('#show_more_btn').on('click', function (e) {
					e.preventDefault();
					showNextRows();
				});

			};	
		});
	}

	$(document).on('click', '.giftDetails', function(){
		var itemId = $(this).closest('.thumbnail').attr('id');
		window.location.href = "itemInformation.html?id=" + itemId;
	});



});