$(document).ready(function(){

	var token = localStorage.getItem('access_token');


	var options = $('#addItemCategory2').children().clone();

	$('#addItemCategory1').change(function() {
		$('#addItemCategory2').children().remove();
		var rawValue = $(this).val();
		options.each(function () {
			var newValue = this.value;
			if (rawValue[0] == newValue[0] || rawValue[0] =="") {
				$('#addItemCategory2').append(this);
			}
		});
		$('#addItemCategory2').val('');
	});

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
			height: 500,
			crop: 'scale'
		}));
		return true;
	}
	).bind('cloudinaryprogress', function(e, data) {
		var percent = Math.round((data.loaded * 100.0) / data.total);
		$('.progress_bar').css('width', percent + '%');
	});
	

	$('#addItemForm').validate({
		rules: {
			addItemName: {
				required: true
			},
			addItemCategory1: {
				required: true
			},
			addressesList: {
				required: true
			}
		},
		messages: {
			addItemName: {
				required: "Please enter gift's name"
			},
			addItemCategory1: {
				required: "Please enter gift's category"
			},
			addressesList: {
				required: "Please choose address or add new address in your profile"
			}
		},
		submitHandler: function(form) {
			
			var token = localStorage.getItem('access_token');
			var title = $('#addItemName').val();
			var category1 = $('#addItemCategory1').val();
			var category2 = $('#addItemCategory2 option:selected').text();
			var addressId = $('#addressesList option:selected').val();
			var description = $('#description').val();
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
			}


			var newItem = {
				title: title,
				category1: category1,
				category2: category2,
				description: description,
				photo1: photo1,
				photo2: photo2,
				photo3: photo3
			};

			var item = JSON.stringify(newItem);

			$.ajax({
				url: "https://freehands1337.herokuapp.com/freehands/" + addressId + "/addproduct",
				type: "POST",
				dataType: "json",
				data: item,
				contentType: "application/json; charset=utf-8",
				headers: {
					'Authorization':'Basic ' + btoa(token)
				},
				success: function(){
					location.href = "myGifts.html"
				},
				error: function(){
					alert("Check information about the gift");
				}
			});
		}
	});


});