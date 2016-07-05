/*!
* CodeloApp Controller 1.0
* 
* 23/05/2016 19:44:30
*
* Asociación Civil Cogollos del Oeste
* http://www.cogollosdeloeste.com.ar
*
*/

// Store params
var storeParams = {
    brId : '',
    strId : '',
    consumoCode: '',
    lugarCode: '',
    solCode: ''
}

//Store Map and Marker for Geolocalization
var map;
var currPosMarker;

/*
* Initialize the map for RaidAlarm
*/
$(document).ready(function() {
	/*
	* Set page events
	*/
	$(":mobile-pagecontainer").pagecontainer({
		show: function( event, ui ) {
			var currPageId = $.mobile.activePage.attr('id');
			if(currPageId){
				var loadPageId = currPageId.charAt(0).toUpperCase() + currPageId.slice(1);
				var functionLoadPage = "load"+loadPageId;
				if (typeof window[functionLoadPage] === "function") {
					window[functionLoadPage]();
				}
			}
		},
		change: function( event, ui ){
			var currPageId = $.mobile.activePage.attr('id');
			if(localStorage.getItem("pending-message")==currPageId){
				localStorage.setItem("pending-message","");
				$("#popupMsg-"+currPageId).popup("open");
			}
		},
		beforechange: function( event, ui ) {
			var currPageId = ui.toPage[0].id;
			if(currPageId){
				currPageId = currPageId.charAt(0).toUpperCase() + currPageId.slice(1);
				var functionBeforeLoadPage = "beforeLoad"+currPageId;
				if (typeof window[functionBeforeLoadPage] === "function") {
					window[functionBeforeLoadPage]();
				}
			}
		},
	});
	
	/*
	* Click event listener for button 'search-strains-button'
	*/
	$( "#search-strains-button").click(function() {
		showLoadingMsg();
		var searchStrainsString = $("#search-strains-input").val();
		
		var searchResult;
		$.ajax({method: "GET",
				url: "http://es.seedfinder.eu/api/json/search.json",
				data:{ac:'07cfa16f66d5ef7cff32eaf4f997a731', q: searchStrainsString},
		}).done(function( response ) {
			searchResult = jQuery.parseJSON( response );
			
			if(searchResult.count!=0){
				var list = createList();
				$.each(searchResult.strains, function(i, strain) {
					$(list).append(createStrainListElement(strain));
				});
				$("#strain-search-results").empty().append(list);
			}else{
				$("#strain-search-results").empty().append('No se encontraron genéticas.');
			}
		});
	});
	/*
	* Click event listener for button 'get-location-btn'
	*/
	$('#get-location-btn').click(function() {
		localizationAndloadWeatherstation();
	});
	
	/*
	* Click event listener for button 'set-location-bsas-btn'
	*/
	$('#set-location-bsas-btn').click(function() {
		obtainAndLoadCurrentWeatherData(bsAsLatLong);
	});
	
	/*
	* Click event listener for button 'consumo-opts'
	*/
	$('#consumo-opts a').click(function() {
		storeParams.consumoCode = $(this).attr('id');
	});
	/*
	* Click event listener for button 'lugar-opts'
	*/
	$('#lugar-opts a').click(function() {
		storeParams.lugarCode = $(this).attr('id');
	});
	/*
	* Click event listener for button 'sol-opts'
	*/
	$('#sol-opts a').click(function() {
		storeParams.solCode = $(this).attr('id');
	});
	/*
	* Click event listener for button 'allanamiento-btn'
	*/
	$("#allanamiento-btn").click(function() {
		$("#situacion-section").hide();
		localStorage.setItem("raidalarm-type", "ALLANAMIENTO");
		
		var partnerProfile = JSON.parse(localStorage.getItem("partnerprofile"));
		localStorage.setItem("last-location", null);
		$("#address-raidalarm").html(partnerProfile.direccion);
		$("#allanamiento-section").show();
		$("#send-alarm-msg-section").show();
	});
	/*
	* Click event listener for button 'detencion-btn'
	*/
	$("#detencion-btn").click(function() {
		$("#situacion-section").hide();
		localStorage.setItem("raidalarm-type", "DETENCION");
		showLoadingMsg();
		cordova.plugins.locationAccuracy.request(
				function(success){
					navigator.geolocation.getCurrentPosition(
							function(position){
								var currPos = L.latLng(position.coords.latitude, position.coords.longitude);
								var lastLoc = position.coords.latitude+" , "+position.coords.longitude;
								localStorage.setItem("last-location", lastLoc);
								map.setView(currPos, 18);
								if(currPosMarker!=null){
									map.removeLayer(currPosMarker);
								}
								
								currPosMarker = new L.marker(currPos).addTo(map);
								currPosMarker.bindPopup('<p class="map-not-info">Usted se encuentra aquí.</p>').openPopup();
								hideLoadingMsg();
							},
							function (error){
								showMsgPopUp('Error','No se ha podido obtener su localización','raidalarm');
								$('#send-location-raid-alarm').prop('checked', false);
								$("#send-location-raid-alarm").flipswitch("refresh");
								var currPos = L.latLng(-34.61964735979719, -58.51661682128906);
								
								map.setView(currPos, 18);
								if(currPosMarker!=null){
									map.removeLayer(currPosMarker);
								}
								hideLoadingMsg();
							},
							{timeout:gpsTimeOut, enableHighAccuracy: true });
				}, 
				function(e){
					localStorage.setItem("last-location","NONE");
					var currPos = L.latLng(-34,6037, -58,3816);
					
					map.setView(currPos, 14);
					if(currPosMarker!=null){
						map.removeLayer(currPosMarker);
					}
					hideLoadingMsg();
				}, 
				cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
		$("#detencion-section").show();
		$("#send-alarm-msg-section").show();
	});
	/*
	* Click event listener for button 'send-location-raid-alarm'
	*/
	$('#send-location-raid-alarm').change(function() {
        if($(this).is(":checked")) {
        	$("#map, .map-legend").show();
        	$("#detencion-btn").click();
        }else{
        	$("#map, .map-legend").hide();
        }
    });
	
	/*
	* Click event listener for button 'raidalarm-btn'
	*/
	$("#raidalarm-btn").click(function(e) {
		var partnerprofile = JSON.parse(localStorage.getItem("partnerprofile"));
		var lastLocation = localStorage.getItem("last-location");
		var alarmType = localStorage.getItem("raidalarm-type");
		var gcmId = localStorage.getItem("gcm-id");
		var msgInput = $("#raidalarm-message").val();
		if(alarmType=="DETENCION"){
			if(!$('#send-location-raid-alarm').is(":checked")) {
				lastLocation = "NONE";
			}			
		}
		$.ajax({
			url: "http://www.cogollosdeloeste.com.ar/cws/codeloadmin/api/raidalarm",
			type : "POST",
			data : {
				userid: partnerprofile.user_id,
				location: lastLocation,
				msg: msgInput,
				alarmtype: alarmType,
				gcmid: gcmId,
				async: false
			},
			success: function(result){
				changePageAndShowMsgPopUp('Mensaje','Alarma enviada correctamente','main');
			},
			error: function (request, textStatus, errorThrown) {
				showMsgPopUp('Error','No se ha enviado la alarma','raidalarm');
			}
		});
	});
	
	/*
	* Click event listener for button 'closeSession'
	*/
	$("#closeSession").click(function(e) {
		e.preventDefault();
		localStorage.setItem("auth", null);
    	checkAuth(false);
		$(':mobile-pagecontainer').pagecontainer('change', '#main');
	});
	
	/*
	* Execute initialization for RaidAlarm map
	*/
	initializeRaidAlarmMap();
});

/*
* Initialize the map for RaidAlarm
*/
function initializeRaidAlarmMap(){
	map = L.map('map');
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
	map.on('contextmenu', function(e){
		map.removeLayer(currPosMarker);
		
		var lastLoc = e.latlng.lat+" , "+e.latlng.lng;
		localStorage.setItem("last-location", lastLoc);
		
		currPosMarker = new L.marker(e.latlng).addTo(map);
		currPosMarker.bindPopup('<p class="map-not-info">Localizacion personalizada.</p>').openPopup();
	});
}

/*
* Show loading animation
*/
function showLoadingMsg(){
	$.mobile.loading("show", {
		text : 'Cargando...',
		textVisible : true,
		theme : 'b',
		textonly : false,
		html : ''
	});
}

/*
* Hide loading animation
*/
function hideLoadingMsg(){
	$.mobile.loading("hide");
}

/*
* Set the loading animations to the ajax start and stop listener
*/
$(document).ajaxStart(function() {
	showLoadingMsg();
});
$(document).ajaxStop(function() {
	hideLoadingMsg();
});

/*
* Listener for beforeLoad event for page Eventos
*/
function beforeLoadEventos(){
	$("#next-events").empty();
	$("#prev-events").empty();
}	

/*
* Listener for load event for page Eventos
*/
function loadEventos(){	
	$.ajax({method: "GET",
			url: "http://www.cogollosdeloeste.com.ar/cws/codeloadmin/api/nextevents",
	}).done(function( response ) {
		var nextEvents = response;
		if(nextEvents.length!=0){
			var list = createList();
			$.each(nextEvents, function(i, item) {
				$(list).append(createEventListElement(item));
			});
			$("#next-events").empty().append(list);
		}else{
			$("#next-events").empty().append('No hay eventos.');
		}
		
		$.ajax({method: "GET",
			url: "http://www.cogollosdeloeste.com.ar/cws/codeloadmin/api/prevevents",
			async: false,
		}).done(function( response ) {
			var prevEvents = response;
			if(prevEvents.length!=0){
				var list = createList();
				$.each(prevEvents, function(i, item) {
					$(list).append(createEventListElement(item));
				});
				$("#prev-events").empty().append(list);
			}else{
				$("#prev-events").empty().append('No hay eventos.');
			}
		});
		
	});
}



/*
* Listener for load event for page Strainssearch
*/
function loadStrainssearch(){
	$("#strain-search-results").empty();
}

/*
* Listener for load event for page Straininfo
*/
function loadStraininfo(){
	var resObj = strainInfo(storeParams.strId, storeParams.brId);

	$('#name').html(resObj.name);
	$('#breeder').html(resObj.brinfo.name);
	$('#type').html(resObj.brinfo.type);
	var floweringInfo = resObj.brinfo.flowering.info;
	if(floweringInfo==''){
		floweringInfo = resObj.brinfo.flowering.days + 'días.';
	}
	if(floweringInfo==''){
		floweringInfo = 'Desconocido';
	}
	$('#flowering-days').html(floweringInfo);
	if(resObj.brinfo.flowering.auto){
		$('.strain-info-box-content').append('<span class="badge badge-negative">AUTO</span>')	
	}
	$('#strain-desc').html(resObj.brinfo.descr);
	if(resObj.brinfo.pic!=false){
		$('#strain-pic').attr("src", resObj.brinfo.pic);
	}
}

/*
* Listener for beforeLoad event for page Raidalarm
*/
function beforeLoadRaidalarm(){
	$("#allanamiento-section").hide();
	$("#detencion-section").hide();
	$("#send-alarm-msg-section").hide();
	$("#situacion-section").show();
}

/*
* Listener for beforeLoad event for page Weatherstation
*/
function beforeLoadWeatherstation(){
	$('#weather-content').empty();
	$('#weather-info').hide();
	$('#get-location-btn').show();
	$('#set-location-bsas-btn').show();
}

/*
* Listener for load event for page Weatherstation
*/
function localizationAndloadWeatherstation(){
	showLoadingMsg();
	cordova.plugins.locationAccuracy.request(
			function(a){
				navigator.geolocation.getCurrentPosition(
						function(position){
							var posLatLong = position.coords.latitude+", "+position.coords.longitude;
							obtainAndLoadCurrentWeatherData(posLatLong);
							hideLoadingMsg();
						},
						function (error){
							hideLoadingMsg();
							console.log("Error: "+error);
						},
						{timeout:gpsTimeOut, enableHighAccuracy: true });
			}, 
			function(e){
				hideLoadingMsg();
				$('#get-location-btn').show();
				$('#set-location-bsas-btn').show();
			}, 
			cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
}

/*
* Function to load a weather data with a position
*/
function obtainAndLoadCurrentWeatherData(position){
	$.ajax({
    	method: "GET",
		url : "http://api.worldweatheronline.com/free/v2/weather.ashx",
		dataType: "json",
		async: false,
		data : { 
			q: position,
			key: '7a295a36893f5eed921533ddd9d19',
			format: 'json',
			lang: 'es',
			num_of_days: '1',
			tp: '3',
			includelocation: 'yes'
		}
	}).done(function(response) {
		var currentCondition =response.data.current_condition[0];
		var weather = response.data.weather[0];
		var location = response.data.nearest_area[0];
		
		var tempValue = currentCondition.temp_C + ' °C';
		var stValue = currentCondition.FeelsLikeC + ' °C';
		var windSpeed = currentCondition.windspeedKmph + 'Km/h'
		var windDirection = currentCondition.windirDegree + '°';
		var remoteWeatherIconUrl = currentCondition.weatherIconUrl[0].value;
		var humidity = currentCondition.humidity + ' %';
		var cloudcover = currentCondition.cloudcover + '%';
		var sunrise = weather.astronomy[0].sunrise;
		var sunset = weather.astronomy[0].sunset;
		var condition = currentCondition.lang_es[0].value;

		var maxTempValue = 'Max: ' + weather.maxtempC + ' °C';
		var minTempValue = 'Min: ' + weather.mintempC + ' °C';

		var area = location.areaName[0].value;
		var region = location.region[0].value;
		var country = location.country[0].value;

		var currHourlyIndex = Math.floor(new Date().getHours()/3);

		var chanceOfRain = weather.hourly[currHourlyIndex].chanceofrain + '%';

		var locationDesc = area+', '+region;
		var weatherIconUrl = iconMap[remoteWeatherIconUrl.substring(remoteWeatherIconUrl.lastIndexOf("/")+1)];

    	var iconW = document.createElement("img");
    	$(iconW).attr("src", 'img/icons/weather-icons/'+weatherIconUrl);
    	$(iconW).css("width","100%");
    	
    	var iconContent = document.createElement("div");
    	$(iconContent).addClass("weather-icon-content");
    	$(iconContent).append(iconW);

    	var cityName = document.createElement("div");
    	$(cityName).addClass("weather-location");
    	$(cityName).append(locationDesc);

    	var tempCurr = document.createElement("div");
    	$(tempCurr).append(tempValue);
    	$(tempCurr).addClass("weather-temp-curr");

    	var tempMin = document.createElement("div");
    	$(tempMin).addClass("weather-temp-min");
    	$(tempMin).append(minTempValue);

    	var tempMax = document.createElement("div");
    	$(tempMax).addClass("weather-temp-max");
    	$(tempMax).append(maxTempValue);

    	var conditionDesc = document.createElement("div");
    	$(conditionDesc).addClass("weather-condition-desc");
    	$(conditionDesc).append(condition);

		var temp = document.createElement("div");
    	$(temp).addClass("weather-temp");
    	$(temp).append(tempCurr);
    	$(temp).append(tempMin);
		$(temp).append(tempMax);
		$(temp).append(conditionDesc);
		
		$('#weather-info').show();
		
    	$('#weather-content').append(cityName);
    	$('#weather-content').append(iconContent);
    	$('#weather-content').append(temp);
    	
    	$('#nubosidad').empty();
    	$('#humedad').empty();
    	$('#viento').empty();
    	$('#sunrise').empty();
    	$('#sunset').empty();
    	$('#posPrecipitaciones').empty();
    	
    	$('#nubosidad').append(cloudcover);
    	$('#humedad').append(humidity);
    	$('#viento').append(windSpeed);
    	$('#posPrecipitaciones').append(chanceOfRain);
    	$('#sunrise').append(sunrise);
    	$('#sunset').append(sunset);
    	
    	$('#get-location-btn').hide();
    	$('#set-location-bsas-btn').hide();
    });
}

/*
* Listener for load event for page Growplannerfour
*/
function loadGrowplannerfour(){
	var growCode = storeParams.consumoCode+"|"+storeParams.lugarCode+"|"+storeParams.solCode;
	$.ajax({
    	method: "GET",
		url : "http://www.cogollosdeloeste.com.ar/grow_plans/jamaica_nice_grow_plan.json",
		dataType: "json"
	}).done(function(response) {
		$("#id-grow-plan-info").empty();
		$("#strains-grow-plan-info").empty();
		$("#plants-grow-plan-info").empty();
		$("#farming-grow-plan-info").empty();
		$("#germination-grow-plan-info").empty();
		
		$("#id-grow-plan-info").html(response.grow_plans[codeGrowId[growCode]].id);
		$("#strains-grow-plan-info").html(response.grow_plans[codeGrowId[growCode]].strains);
		$("#plants-grow-plan-info").html(response.grow_plans[codeGrowId[growCode]].plants);
		$("#farming-grow-plan-info").html(response.grow_plans[codeGrowId[growCode]].farming);
		$("#germination-grow-plan-info").html(response.grow_plans[codeGrowId[growCode]].germination);
		
		var consumoSelected = $(document.getElementById(storeParams.consumoCode)).clone();
		var lugarSelected = $(document.getElementById(storeParams.lugarCode)).clone();
		var solSelected = $(document.getElementById(storeParams.solCode)).clone();
		
		$(consumoSelected).attr('id','SEL_'+$(consumoSelected).attr('id'));
		$(lugarSelected).attr('id','SEL_'+$(lugarSelected).attr('id'));
		$(solSelected).attr('id','SEL_'+$(solSelected).attr('id'));
		$(consumoSelected).attr('href','#growplannerone');
		$(lugarSelected).attr('href','#growplannertwo');
		$(solSelected).attr('href','#growplannerthree');
		var liConsumo = document.createElement('li');
		var liLugar = document.createElement('li');
		var liSol = document.createElement('li');

		$(liConsumo).append(consumoSelected);
		$(liLugar).append(lugarSelected);
		$(liSol).append(solSelected);
		
		$("#grow-plan-sel").html('<li id="consumo-selection" data-role="list-divider">CONSUMO</li>'+
		'<li id="lugar-selection" data-role="list-divider">LUGAR</li>'+
		'<li id="sol-selection" data-role="list-divider">SOL</li>');

		$("#consumo-selection").after(liConsumo);
		$("#lugar-selection").after(liLugar);
		$("#sol-selection").after(liSol);
		
		$("#grow-plan-sel").listview('refresh');
	});
}

/*
* Listener for load event for page Partnerprofile
*/
function loadPartnerprofile(){
	$.ajax({
		url: "http://www.cogollosdeloeste.com.ar/cws/codeloadmin/api/socio",
		type : "GET",
		error: function (request, textStatus, errorThrown) {
			console.log('Authentication error.');
		},
		success: function(result){
			var profilePhoto;
			
			if((!result.photoProfileUrl || 0 === result.photoProfileUrl.length)){
				profilePhoto="0.jpg";
			}else{
				profilePhoto = result.photoProfileUrl;
			}
			
			$("#profilePhoto").attr('src', 'http://www.cogollosdeloeste.com.ar/profiles/'+profilePhoto);
			
			$("#nroSocio").html(result.numsocio);
			$("#nombreSocio").html(result.firstname);
			$("#apellidoSocio").html(result.lastname);
			
			var fechaingreso;
			var fechaUltimoPago;
			
			if(result.fechaingreso!=null){
				var dFeIngreso = new Date(result.fechaingreso);
				var month = dFeIngreso.getMonth() + 1
			    var day = dFeIngreso.getDay();
			    var year = dFeIngreso.getFullYear();
			    fechaingreso = month + "/" + day + "/" + year;
			}
			
			if(result.fechaultimopago!=null){
				var dFeUlPago = new Date(result.fechaultimopago);
				var month = dFeUlPago.getMonth() + 1
			    var day = dFeUlPago.getDay();
			    var year = dFeUlPago.getFullYear();
			    fechaUltimoPago = month + "/" + day + "/" + year;
			}

			$("#fechaIngresoSocio").html(fechaingreso);
			$("#fechaUltimoPagoSocio").html(fechaUltimoPago);
			if(result.aldia==0){
				$("#ultimaCuotaSocio").removeClass("badge-negative");
				$("#ultimaCuotaSocio").addClass("badge-positive");
				$("#ultimaCuotaSocio").html("PAGA");
			}else{
				$("#ultimaCuotaSocio").removeClass("badge-positive");
				$("#ultimaCuotaSocio").addClass("badge-negative");
				$("#ultimaCuotaSocio").html("IMPAGA");
			}
			
		}
	});
}

/*
* Function to create a jQuery mobile list
*/
function createList(){
	var ul = document.createElement('ul');
	$(ul).attr( "data-role", "listview" );
	$(ul).attr( "data-count-theme", "b" );
	$(ul).attr( "data-inset", "true" );
	$(ul).addClass("ui-listview");
	$(ul).addClass("ui-listview-inset");
	$(ul).addClass("ui-corner-all");
	$(ul).addClass("ui-shadow");

	return ul;
}

/*
* Function to create a jQuery mobile list element
*/
function createEventListElement(event){
	var li = document.createElement('li');
	var a = document.createElement('a');
	var p = document.createElement('p');
	var span = document.createElement('span');

	$(li).addClass("ui-li-has-count");
	$(li).addClass("ui-first-child");
	$(li).addClass("ui-last-child");

	$(a).addClass("ui-btn");
	$(a).addClass("ui-btn-icon-right");
	$(a).addClass("ui-icon-carat-r");

	$(a).attr({
		href: "http://www.cogollosdeloeste.com.ar/cws/codeloweb/article/"+event.id_article
	});
	
	$(span).addClass("ui-li-count");
	$(span).append(event.event_date)

	$(p).append(span)

	$(a).append(event.name);
	$(a).append(p);
	$(li).append(a);

	return li;
}

/*
* Function to create a jQuery mobile list for strains
*/
function createStrainListElement(strain){
	var li = document.createElement('li');
	var a = document.createElement('a');
	var p = document.createElement('p');

	$(li).addClass("ui-li-has-count");
	$(li).addClass("ui-first-child");
	$(li).addClass("ui-last-child");

	$(a).addClass("ui-btn");
	$(a).addClass("ui-btn-icon-right");
	$(a).addClass("ui-icon-carat-r");

	$(a).attr({
		href: "#straininfo"
	});

	$(a).click(function() {
		storeParams.brId = strain.brid;
		storeParams.strId = strain.id;
	});

	$(p).append(strain.brname)

	$(a).append(strain.name);
	$(a).append(p);
	$(li).append(a);

	return li;
}

/*
* Function to execute the ajax call for search strains
*/
function searchStrains(searchString) {
	var result;
	$.ajax({method: "GET",
			url: "http://es.seedfinder.eu/api/json/search.json",
			data:{ac:'07cfa16f66d5ef7cff32eaf4f997a731', q: searchString},
			async: false,
	}).done(function( response ) {
		result = jQuery.parseJSON( response );
	});
	return result;
}

/*
* Function to obtain data for an specific strain
*/
function strainInfo(strId, brId) {
	var result;
	$.ajax({method: "GET",
			url: "http://es.seedfinder.eu/api/json/strain.json",
			data:{ac:'07cfa16f66d5ef7cff32eaf4f997a731', br: brId, str: strId, lng: 'es' },
			async: false,
	}).done(function( response ) {
		result = jQuery.parseJSON( response );
	});
	return result;
}

/*
* Function to convert UTC to formattedTime
*/
function convertUTCtoTime(unix_timestamp){
	var date = new Date(unix_timestamp*1000);
	var hours = date.getHours();
	var minutes = "0" + date.getMinutes();
	var seconds = "0" + date.getSeconds();
	var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
	return formattedTime;
}