$(document).ready(function(){

	var token = localStorage.getItem('access_token');
	

	getInfo(token);

	$('#changeAvatar').click(function(){
		$(this).hide();
		$('#setAvatarForm').css('visibility', 'visible');

		var cloud_name = 'dn5wbzrci';
		var preset_name = 'msatbqea';

		$.cloudinary.config({
			cloud_name: cloud_name
		})

		$('.upload_field').unsigned_cloudinary_upload(preset_name, {
			cloud_name: cloud_name
		}, {
			multiple: true
		}).bind('cloudinarydone', function(e, data) {
			$('#photoToAdd').append($.cloudinary.image(data.result.public_id, {
				transformation: [{
					width: 400, 
					height: 400, 
					gravity: "face", 
					radius: "max", 
					crop: "crop"},
					{
						width: 150, 
						crop: "scale"
					}
				]}));
			return true;
		}
		).bind('cloudinaryprogress', function(e, data) {
			var percent = Math.round((data.loaded * 100.0) / data.total);
			$('.progress_bar').css('width', percent + '%');
		});


		$('#setAvatarForm').validate({
			submitHandler: function(form) {
				var countPhoto = $("#photoToAdd").children().length;
				var	photo;
				switch (countPhoto) {
					case 0:
					photo = null;
					break;
					case 1:
					photo = $("#photoToAdd").children().eq(0).attr('src');
					break;
					default:
					photo = $("#photoToAdd").children().eq(0).attr('src');
				}
				var avatarJson = {
				photo: photo
				};

				var avatarStr = JSON.stringify(avatarJson);

			$.ajax({
				url: "https://freehands1337.herokuapp.com/freehands/setavatar",
				type: "PUT",
				dataType: "json",
				data: avatarStr,
				contentType: "application/json; charset=utf-8",
				headers: {
					'Authorization':'Basic ' + btoa(token)
				},
				error: function(){
					alert("Check the photo");
				}
			}).then(function(){
				$('#setAvatarForm').css('visibility', 'hidden');
				$('#changeAvatar').show();
				getInfo(token);
			});
			}
		});
	});


	$('.edit').click(function(){

		$(this).siblings().attr('disabled', false);

		$(this).hide();
		$('#saveInfo').show();	
	});

	$('#editPassword').click(function(){

		$('#editPassword').hide();
		$('#passwordInfo').show();
		$('#confirmPasswordInput').show();
		$('#saveInfo').show();

	});





	$('#profileInfoForm').validate({
		rules: {
			passwordInfo: {
				required: true,
				minlength: 6,
				maxlength: 16
			},
			passwordInfo2: {
				required: true,
				equalTo: '#passwordInfo'
			}
		},
		messages: {
			passwordInfo: {
				minlength: "Your password must consist of at least 6 characters",
				maxlength: "Your password must consist of maximum 16 characters"
			},
			passwordInfo2: {
				required: "Please confirm the password",
				equalTo: "Confirmed password is uncorrect"
			}
		},
		submitHandler: function(form) {

			var firstName = $('input[name="nameInfo"]').val();
			var phone = $('input[name="phoneInfo"]').val();
			var password = $('input[name="passwordInfo"]').val();
			var email = $('input[name="emailInfo"]').val();

			var updateInfo = {
				firstName: firstName,
				phone: phone
			};


			var updatePassword = {
				password: password
			};

			var strNamePhone = JSON.stringify(updateInfo);
			var strPassword = JSON.stringify(updatePassword);



			$.ajax({
				url: "https://freehands1337.herokuapp.com/freehands/fulluserinfo",
				type: "PUT",
				dataType: "json",
				data: strNamePhone,
				contentType: "application/json; charset=utf-8",
				headers: {
					'Authorization':'Basic ' + btoa(token)
				}
			}).then(function(data){

				// if (password != null) {
				// 	$.ajax({
				// 		url: "https://freehands1337.herokuapp.com/freehands/changepassword",
				// 		type: "PUT",
				// 		dataType: "json",
				// 		data: strPassword,
				// 		contentType: "application/json; charset=utf-8",
				// 		headers: {
				// 			'Authorization':'Basic ' + btoa(token)
				// 		}
				// 	}).then(function(){
				// 		token = email + ":" + password;
				// 		localStorage.setItem('access_token', token);
				// 	});
				// }
				

				$('#saveInfo').hide();
				$('.edit').show();
				$('#editPassword').show();
				$('#passwordInfo').hide();
				$('#confirmPasswordInput').hide();
				$('#emailInfo').attr('disabled', true);
				$('#nameInfo').attr('disabled', true);
				$('#phoneInfo').attr('disabled', true);
				getInfo(token);
			});
		}
	});

});



var getInfo = function(token){ $.ajax({
	url: "https://freehands1337.herokuapp.com/freehands/fulluserinfo",
	type: "GET",
	dataType: "json",
	contentType: "application/json; charset=utf-8",
	headers: {
		'Authorization':'Basic ' + btoa(token)
	}
}).then(function(data){
	$('#avatar').empty();
	if (data.photo != null) {
		$('#avatar').append('<img src="' + data.photo + '" alt="avatar">');
	} else{
		$('#avatar').append('<i class="fa fa-user-circle" aria-hidden="true"></i>');
	}

	$('#profileAvatar').empty();
	if (data.photo != null) {
		$('#profileAvatar').append('<img src="' + data.photo + '" alt="avatar">');
	} else{
		$('#profileAvatar').append('<i class="fa fa-user-circle" aria-hidden="true"></i>');
	}

	$('#emailInfo').val(data.email);
	if (data.firstName != null) {
		$('#nameInfo').val(data.firstName);
	}else{
		$('#nameInfo').val('None');
	};
	if (data.phone != null) {
		$('#phoneInfo').val(data.phone);
	}else{
		$('#phoneInfo').val('None');
	};
});
};