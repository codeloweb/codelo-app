jQuery.support.cors = true;

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition,function error(msg){alert('Please enable your GPS position future.');}, {enableHighAccuracy: true});
	} else { 
		alert("Geolocation is not supported by this browser.");
	}
}

function showPosition(position) {
	var accuracy = String(position.coords.accuracy);
	accuracy = accuracy.split('.')[0];
	alert("Latitud: " + position.coords.latitude + "\nLongitud: " + position.coords.longitude + "\n Precisión: " +accuracy+" Metros");
}

function toggleLoginPopUp(){
	var hidden = $('#loginSocio').hasClass("hidden");
	if(hidden){
		$('#loginSocio').removeClass('hidden');
	}else{
		$('#loginSocio').addClass('hidden');
	}
}

function setAuthVar(username, password){
	var authKey = Base64.encode(username +':'+ password);
	var authInfo = "Basic "+authKey;
	localStorage.setItem("auth", authInfo);
}

function checkAuth(){
	var authInfo = localStorage.getItem("auth");
	if(authInfo!=null){
		$.ajaxSetup({
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", authInfo);
			}
		});

		$.ajax({
			url: "http://www.cogollosdeloeste.com.ar/cws/codeloadmin/api/socio",
			type : "GET",
			error: function (request, textStatus, errorThrown) {
				console.log(request.responseText);
				console.log(textStatus);
				console.log(errorThrown);
			},
			success: function(result){
				$('.auth-required').show();
				$('.show-only-guest').hide();
			}
		});
	}
}

function getUrlParameter(sParam){
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');
	for (var i = 0; i < sURLVariables.length; i++) 
	{
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] == sParam) 
		{
			return sParameterName[1];
		}
	}
}

function onPushEvent(){
	alert(document.body);
	if(document.getElementById('index')) {
		index();
	}
	if(document.getElementById('perfil-socio')) {
		perfilSocio();
	}
	if(document.getElementById('eventos')) {
		eventos();
	}
	if(document.getElementById('strain-search')) {
		strainSearch();
	}
	if(document.getElementById('strain')) {
		strain();
	}
	if(document.getElementById('strains-list')) {
		strainsList();
	}
}

window.addEventListener('push', onPushEvent);

$(document).ready(onPushEvent);

//index
function index() {
	checkAuth();
	$('#loginButton').click(function() {
		var us = $('#inputUser').val();
		var pass = $('#inputPass').val();
		setAuthVar(us, pass);
		checkAuth();
	});
}

//perfil-socio
function perfilSocio() {

}

//eventos
function eventos() {
	$.ajax({method: "GET",
			url: "http://www.cogollosdeloeste.com.ar/cws/codeloweb/api/nextevents",
	}).done(function( msg ) {
		var obj = jQuery.parseJSON( msg );
		if(obj.length<0){
			$.each(obj, function(i, item) {
				$('#stranis-next-events').append('<li class="table-view-cell"><a href="http://www.cogollosdeloeste.com.ar/cws/codeloweb/article/'+item.id_article+'"><strong>'+item.name+'</strong></a><span class="badge badge-event-date">'+item.event_date+'</span></li>');
			});
		}else{
			$('#stranis-next-events').append('No hay eventos programados.');
		}
	});

	$.ajax({method: "GET",
			url: "http://www.cogollosdeloeste.com.ar/cws/codeloweb/api/prevevents",
	}).done(function( msg ) {
		var obj = jQuery.parseJSON( msg );
		if(obj.length!=0){
			$.each(obj, function(i, item) {
				$('#stranis-prev-events').append('<li class="table-view-cell"><a href="http://www.cogollosdeloeste.com.ar/cws/codeloweb/article/'+item.id_article+'"><strong>'+item.name+'</strong></a><span class="badge badge-event-date">'+item.event_date+'</span></li>');
			});
		}else{
			$('#stranis-prev-events').append('No hay eventos.');
		}
	});
}

//buscador-variedades
function buscadorVariedades() {
	$( "#targetButton" ).click(function() {
		var url = "search-screen-strains.html?strainString="+$("#strainString").val();    
		$(location).attr('href',url);
	});
}

//search-screen-strains
function searchScreenStrains() {
	var strainString = getUrlParameter("strainString");
	$.ajax({method: "GET",
			url: "http://es.seedfinder.eu/api/json/search.json",
			data:{ac:'07cfa16f66d5ef7cff32eaf4f997a731', q: strainString}
	}).done(function( msg ) {
		var obj = jQuery.parseJSON( msg );
		if(obj.count!=0){
			$.each(obj.strains, function(i, item) {
				$('#stranis-table').append('<li class="table-view-cell"><a href="strain.html?strId='+item.id+'&brId='+item.brid+'"><strong>'+item.name+'</strong></a><a href="breeder-info.html?id='+item.brid+'"><span class="badge">'+item.brname+'</span></a></li>');
			});
		}else{
			$('#stranis-table').append('No se encontraron resultados.');
		}
	});
}

//strain-info
function strainInfo() {
	var strId = getUrlParameter("strId");
	var brId = getUrlParameter("brId");
	$.ajax({method: "GET",
			url: "http://es.seedfinder.eu/api/json/strain.json",
			data:{ac:'07cfa16f66d5ef7cff32eaf4f997a731', br: brId, str: strId, lng: 'es' }
	}).done(function( response ) {
		var resObj = jQuery.parseJSON( response );
		$('#strain-title').html(resObj.brinfo.name+' - '+resObj.name);
		$('#strain-name').html(resObj.name);
		$('#strain-breeder').html(resObj.brinfo.name);
		$('#strain-type').html(resObj.brinfo.type);
		var floweringInfo = resObj.brinfo.flowering.info;
		if(floweringInfo==''){
			floweringInfo = resObj.brinfo.flowering.days + 'días.';
		}
		if(floweringInfo==''){
			floweringInfo = 'Desconocido';
		}
		$('#strain-flowering-info').html(floweringInfo);
		if(resObj.brinfo.flowering.auto){
			$('#strain-info-container').append('<span class="badge badge-negative">AUTO</span>')	
		}
		$('#strain-desc').append(resObj.brinfo.descr);
		if(resObj.brinfo.pic!=false){
			$('#strain-pic').attr("src", resObj.brinfo.pic);
		}
		
	});
}