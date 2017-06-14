$(document).ready(function(){

	$('#logout').click(function(){
    
        localStorage.clear();
        location.href = "index.html";
    });

	$('#logout2').click(function(){
    
        localStorage.clear();
        location.href = "index.html";
    });
});