$(document).ready(function(){
	$('#signupForm').validate({
		rules: {
			email: {
				required: true,
				email: true
			},
			password1: {
				required: true,
				minlength: 6,
				maxlength: 16
			},
			password2: {
				required: true,
				equalTo: '#password1'
			},
			check_agreement: {
				required:true
			}
		},
		messages: {
			email: {
				required: "Please enter your email",
				email: "Your email address must be in the format of name@domain.com"
			},
			password1: {
				required: "Please enter the password",
				minlength: "Your password must consist of at least 6 characters",
				maxlength: "Your password must consist of maximum 16 characters"
			},
			password2: {
				required: "Please confirm the password",
				equalTo: "Confirmed password is uncorrect"
			},
			check_agreement: {
				required:"Please indicate that you accept the Terms and Conditions"
			}
		},
		submitHandler: function(form) {
		var email = $('input[name="email"]').val();
		var password = $('input[name="password2"]').val();

		var token = email + ":" + password;

		var registrationUser = {
			email: email,
			password: password
		};

		var str = JSON.stringify(registrationUser);
		$.ajax({
			url: "https://freehands1337.herokuapp.com/freehands/registration",
			type: "POST",
			dataType: "json",
			data: str,
			contentType: "application/json; charset=utf-8",
			success: function(){
				$.ajax({
                  url: "https://freehands1337.herokuapp.com/freehands/fulluserinfo",
                  type: "GET",
                  dataType: "json",
                  contentType: "application/json; charset=utf-8",
                  headers: {
                    'Authorization':'Basic ' + btoa(token)
                },
                success: function(){
                    location.href = "myaccount.html";
                },
                error: function(){
                    alert("This account has been already registred");
                }
            }); 
			},
			error: function(){
				alert("This account has been already registred");
			}
		}).then(function(data){
			console.log(data);
			localStorage.setItem('access_token', (token));
		});	
		}
	});



});