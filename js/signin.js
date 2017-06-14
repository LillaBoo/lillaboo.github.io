$(document).ready(function(){
	$('#signinForm').validate({

        rules: {
            username: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 6,
                maxlength: 10
            }
        },
        messages: {
            username: {
                required: "Please enter your email",
                email: "Your email address must be in the format of name@domain.com"
            },
            password: {
                required: "Please enter the password",
                minlength: "Your password must consist of at least 2 characters",
                minlength: "Your password must consist of maximum 10 characters"
            }
        },
        submitHandler: function(form) {
          var email = $('input[name="username"]').val();
          var password = $('input[name="password"]').val();
          var token = email + ":" + password;

          
          $.ajax({
              url: "https://freehands1337.herokuapp.com/login",
              type: "GET",
              headers: {
                'Authorization':'Basic ' + btoa(token)
              },
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
                    alert("Email or password is uncorrected");
                }
            }); 
            },
            error: function(){
                alert("Email or password is uncorrected");
            }
        }).then(function(data){
            console.log(data);
            localStorage.setItem('access_token', token);
        }); 
        }

    });

});