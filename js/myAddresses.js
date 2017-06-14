$(document).ready(function(){

	var token = localStorage.getItem('access_token');

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
		if (addressesCount == 0){
			$('#addressesListInfo')
			.append($("<p></p>")
				.text("No addresses"));
		} else {
			for (var i = 0; i <= addressesCount - 1; i++) {
				var idAddress = data[i].id_str;
				$('#addressesListInfo').append('<div class="row item" id="' + idAddress +'"><div class="col-lg-10 col-sm-10 col-xs-9">' + 
					'<p id="addressString' + i +'"></p></div><div class="col-lg-2 col-sm-2 col-xs-3">' + 
					'<div class="close" title="Deleate address"></div></div></div>');
				$('#addressString' + i).text(data[i].country + ', ' + 
					data[i].city + ', ' + 
					data[i].street);

			}
		}
	});

	$(document).on('click', '.close', function(){
		var addressId = $(this).closest('.item').attr('id');
		$(this).parent().parent().remove();
		$.ajax({
			url: "https://freehands1337.herokuapp.com/freehands/" + addressId +  "/deleteaddress",
			type: "DELETE",
			dataType: "json",
			contentType: "application/json; charset=utf-8",
			headers: {
				'Authorization':'Basic ' + btoa(token)
			}
		});

	});



});