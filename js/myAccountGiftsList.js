$(document).ready(function(){

	var token = localStorage.getItem('access_token');

	$.ajax({
		url: " https://freehands1337.herokuapp.com/freehands/getallproductswithoutuser",
		type: "GET",
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		headers: {
			'Authorization':'Basic ' + btoa(token)
		}
	}).then(function(data){
		$('#showGoods').append('<div id="allGiftsListInfo"></div>');
		$('#allGiftsListInfo').hide();
		var giftsCount = data.length;
		if (giftsCount == 0){
			$('#allGiftsListInfo').show();
			$('#allGiftsListInfo')
			.append($("<p></p>")
				.text("No gifts to show"));
		}else{
			var n = 0;
			for (var i = giftsCount - 1; i >= 0; i--) {

				var idGift = data[i].id_str;
				var photoUrl = 'img/show.jpg';
				if (data[i].photo1 != null) {
					photoUrl = data[i].photo1;
				}

				if (n%3 == 0) {
					$('#allGiftsListInfo').append('<div class="row gift" id="' + (n/3) + '"></div>');
					$('#' + (n/3)).append('<div class="col-sm-4">' + 
						'<div class="thumbnail" id="' + idGift + '"><img src=' + photoUrl + ' alt="">'+
						'<div class="caption"><h5>' + data[i].title + '</h5><p>' + 
						data[i].productAd + '</p><p><i class="fa fa-gratipay" aria-hidden="true">' + 
						'</i> ' + data[i].wishers.length + '</p><p><a class="btn btn-primary href-btn giftDetails">Details >></a></p>' + 
						'</div></div></div>');
				} else{
					$('.row.gift:last-child').append('<div class="col-sm-4">' + 
						'<div class="thumbnail" id="' + idGift + '"><img src=' + photoUrl + ' alt="">'+
						'<div class="caption"><h5>' + data[i].title + '</h5><p>' + 
						data[i].productAd + '</p><p><i class="fa fa-gratipay" aria-hidden="true">' + 
						'</i > ' + 	data[i].wishers.length +  '</p><p><a class="btn btn-primary href-btn giftDetails">Details >></a>' + 
						'</div></div></div>');
				};
				n++;
			};

			$('#allGiftsListInfo').parent().append('<p id="show_more_btn">' + 
				'<a class="btn btn-action btn-lg" role="button">Show more »</a></p>');
			
			$('#allGiftsListInfo').show();
			var rowsCount = 1;
			var rowsMax = $('#allGiftsListInfo .row').length;
			
			$("#allGiftsListInfo").children().hide();

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

	$(document).on('click', '.giftDetails', function(){
		var itemId = $(this).closest('.thumbnail').attr('id');
		window.location.href = "itemInformation.html?id=" + itemId;
	});


});