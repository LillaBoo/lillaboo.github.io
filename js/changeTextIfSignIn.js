


        var token = localStorage.getItem('access_token');

        if (token != null) {
        $('#sign_account').text('My accaunt');
        $('#sign_account').attr('href', 'myAccount.html');
        $('.btn').attr('disabled', false);
        $('.jumbotron').hide();
        $('#intro').css({'margin-top':'70px'})
        } else {
        	 $('#sign_account').text('SIGN IN / SIGN UP');
        }
   
