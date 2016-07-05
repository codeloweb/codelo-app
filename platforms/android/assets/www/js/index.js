/*!
* CodeloApp 1.0
* 
* 23/05/2016 19:46:27
*
* Asociación Civil Cogollos del Oeste
* http://www.cogollosdeloeste.com.ar
*
*/
$.ajaxSetup({
	error: function (request, textStatus, errorThrown) {
		hideLoadingMsg();
		var currPageId = $.mobile.activePage.attr('id');
		changePageAndShowMsgPopUp("Error","Error de conexión. Intente nuevamente mas tarde.","main");
	}
});

function setAuthVar(username, password){
	var authKey = Base64.encode(username +':'+ password);
	var authInfo = "Basic "+authKey;
	localStorage.setItem("auth", authInfo);
	localStorage.setItem("loged-username", username);
}

function checkAuth(showMessages){
	var authInfo = localStorage.getItem("auth");
	var gcmId = localStorage.getItem("gcm-id");
	
	if(authInfo!=null){
		$.ajaxSetup({
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", authInfo);
			}
		});

		$.ajax({
			url: "http://www.cogollosdeloeste.com.ar/cws/codeloadmin/api/socio",
			type : "GET",
			data : { gcmid: gcmId },
			error: function (request, textStatus, errorThrown) {
				$('.auth-required a').bind('click', function(e){
			        e.preventDefault();
				});
				$('#socio-divider').remove();
				$('#partnerprofile-anchor').remove();
				$('#raidalarm-anchor').remove();
				$("#main-menu").listview('refresh');
				$(".auth-required").hide();
				$('.show-only-guest').show();
				console.log('Authentication error.');
				if(showMessages){
					showMsgPopUp("Datos incorrectos","Usuario y/o contraseña incorrectos","main");
				}
			},
			success: function(result){
				var sociosSection = "<li id='socio-divider' data-role='list-divider'>Socios</li>"+
					"<li id='partnerprofile-anchor'><a href='#partnerprofile'>" +
					"<img src='img/icons/profile-icon.png' class='ui-li-icon'>Perfil Socio</a></li>"+
					"<li id='raidalarm-anchor'><a href='#raidalarm'>" +
					"<img src='img/icons/raid-alarm-icon.png' class='ui-li-icon'>Alarma Allanamiento</a></li>";
				
				$("#main-menu").append(sociosSection);
				$("#main-menu").listview('refresh');
				$('.auth-required').show();
				$('.show-only-guest').hide();
				$("#loged-username").html(localStorage.getItem("loged-username"));
				localStorage.setItem("partnerprofile", JSON.stringify(result));
				console.log('Authentication OK.');
				if(showMessages){
		        	showMsgPopUp("Datos Correctos","Bienvenido "+localStorage.getItem("loged-username"),"main");
				}
			}
		});
	}
}

function showMsgPopUp(title,message,parent){
	$("#popupMsg-title-"+parent).html(title);
	$("#popupMsg-main-"+parent).html(message);
	$("#popupMsg-"+parent).popup("open");
}

function changePageAndShowMsgPopUp(title,message,parent){
	$("#popupMsg-title-"+parent).html(title);
	$("#popupMsg-main-"+parent).html(message);
	localStorage.setItem("pending-message", parent);
	$(':mobile-pagecontainer').pagecontainer('change', '#'+parent);
}

function exitFromApp(){
	navigator.app.exitApp();
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    onDeviceReady: function() {
    	//Check Authentication
    	checkAuth(false);
    	// Push Plugin initialization
    	var push = PushNotification.init({
			"android" : {
				"senderID" : "1021024381358"
			},
			"ios" : {},
			"windows" : {}
		});
        
        push.on('registration', function(data) {
        	$.support.cors = true;
        	
        	localStorage.setItem("gcm-id", data.registrationId);

            $.ajax({
            	method: "GET",
				url : "http://www.cogollosdeloeste.com.ar/cws/codeloadmin/api/Registergcmid",
				data : { 
					gcmid: data.registrationId 
				}
			}).done(function() {
            	console.log( "success" );
            }).fail(function( jqXHR, textStatus ) {
            	console.log( "Request failed: " + jqXHR );
            });
        });

        push.on('notification', function(data) {
        	var additionalData = data.additionalData;        	
        	//Notification Message
        	var messageNotification = "<p>"+data.message+"</p>";
        	
        	if(additionalData.additionalData){
        		//Notification Button
            	var buttonIcon = additionalData.additionalData.buttonIcon;
            	var buttonText = additionalData.additionalData.buttonText;
            	var buttonLink = additionalData.additionalData.buttonLink;
            	
            	//Raid Alarm
            	var raidalarmusrmsg = additionalData.additionalData.raidalarmusrmsg;
        		if(raidalarmusrmsg){
            		messageNotification = messageNotification+"<p><strong>Mensaje del usuario: " +
        			"</strong>"+raidalarmusrmsg+"</p>";
            	}
        		
            	if(buttonIcon && buttonText && buttonLink){
            		var notificationButton = "<a href='"+buttonLink+"' " +
        			"class='ui-btn ui-corner-all ui-shadow ui-btn-b ui-btn-icon-left "+buttonIcon+"'>"+buttonText+"</a>";
            		messageNotification = messageNotification + notificationButton;
            	}
        	}
    		changePageAndShowMsgPopUp(data.title,messageNotification,'main');
        });

        push.on('error', function(e) {
            console.log("push error");
        });
        
        $("#login-form").submit(function(event) {
    		var username = $("#user-input").val();
    		var password = $("#password-input").val();
    		setAuthVar(username, password);
    		checkAuth(true);
    		$("#login-form").dialog( "close" );
    		event.preventDefault();
		});
        
        $(".exit-app-btn").click(function(event) {
    		event.preventDefault();
    		exitFromApp();
		});
        
        $("body").show("slow");
    },
};

app.initialize();