// Store params
var storeParams = {
    brId : '',
    strId : ''
}

$( document ).ready(function() {
	$(":mobile-pagecontainer").pagecontainer({
		show: function( event, ui ) {
			var currPageId = $.mobile.activePage.attr('id');
			currPageId = currPageId.charAt(0).toUpperCase() + currPageId.slice(1);
			var functionLoadPage = "load"+currPageId;
			if (typeof window[functionLoadPage] === "function") {
				window[functionLoadPage]();
			}
		}
	});
	$( "#search-strains-button" ).bind( "click", function(event, ui) {
		var searchStrainsString = $("#search-strains-input").val();
		var searchResult = searchStrains(searchStrainsString);	
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

function obtainNextEvents() {
	var result;
	$.ajax({method: "GET",
			url: "http://www.cogollosdeloeste.com.ar/cws/codeloweb/api/nextevents",
			async: false,
	}).done(function( response ) {
		result = jQuery.parseJSON( response );
	});
	return result;
}

function obtainPrevEvents() {
	
	var result;
	$.ajax({method: "GET",
			url: "http://www.cogollosdeloeste.com.ar/cws/codeloweb/api/prevevents",
			async: false,
	}).done(function( response ) {
		result = jQuery.parseJSON( response );
	});
	return result;
}

function loadEventos(){
	var nextEvents = obtainNextEvents();
	var prevEvents = obtainPrevEvents();

	if(nextEvents.length!=0){
		var list = createList();
		$.each(nextEvents, function(i, item) {
			$(list).append(createEventListElement(item));
		});
		$("#next-events").empty().append(list);
	}else{
		$("#next-events").empty().append('No hay eventos.');
	}

	if(prevEvents.length!=0){
		var list = createList();
		$.each(prevEvents, function(i, item) {
			$(list).append(createEventListElement(item));
		});
		$("#prev-events").empty().append(list);
	}else{
		$("#prev-events").empty().append('No hay eventos.');
	}
}

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

function loadRaidalarm(){
	alert('Ingresó');
	var mapDiv = document.getElementById("map-canvas");
	// Initialize the map plugin
	var map = plugin.google.maps.Map.getMap(mapDiv, {
		'backgroundColor' : 'white',
		'mapType' : plugin.google.maps.MapTypeId.HYBRID,
		'controls' : {
			'compass' : true,
			'myLocationButton' : true,
			'indoorPicker' : true,
			'zoom' : true
		},
		'gestures' : {
			'scroll' : true,
			'tilt' : true,
			'rotate' : true,
			'zoom' : true
		}
	});
	
	map.on(plugin.google.maps.event.MAP_READY, function(map){
		alert('Map Ready');
		navigator.geolocation.getCurrentPosition(function(position){
			var currPos = new plugin.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			map.setCenter(currPos);
			alert('Position Ready');
		});	
	});
}

function loadWeatherstation(){
	$.ajax({
    	method: "GET",
		url : "http://api.openweathermap.org/data/2.5/weather",
		dataType: "json",
		data : { 
			q: 'Buenos%20Aires,%20Ar',
			units: 'metric',
			appid: 'a83bbc60e6d5819e9ee153d37659078a'
		}
	}).done(function(data) {
    	var iconW = document.createElement("img");
    	$(iconW).attr("src", 'img/icons/weather-icons/'+data.weather[0].icon+'.png');
    	var cityName = document.createElement("span");
    	$(cityName).append(data.name);
    	var temp = document.createElement("span");
    	$(temp).append(data.main.temp+' °C');
    	$('#weather-content').empty();
    	$('#weather-content').append(cityName);
    	$('#weather-content').append(iconW);
    	$('#weather-content').append(temp);
    	
    	$('#nubosidad').empty();
    	$('#humedad').empty();
    	$('#viento').empty();
    	$('#sunrise').empty();
    	$('#sunset').empty();
    	
    	$('#nubosidad').append(data.clouds.all+'%');
    	$('#humedad').append(data.main.humidity+'%');
    	$('#viento').append(data.wind.speed+' m/s');
    	$('#sunrise').append(convertUTCtoTime(data.sys.sunrise));
    	$('#sunset').append(convertUTCtoTime(data.sys.sunset));
    }).fail(function( jqXHR, textStatus ) {
    	alert( "Request failed: " + textStatus );
    });
}

function drawMap(latlng) {
	var myOptions = {
		zoom: 10,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
	// Add an overlay to the map of current lat/lng
	var marker = new google.maps.Marker({
		position: latlng,
		map: map,
		title: "Greetings!"
	});
}

function convertUTCtoTime(unix_timestamp){
	var date = new Date(unix_timestamp*1000);
	var hours = date.getHours();
	var minutes = "0" + date.getMinutes();
	var seconds = "0" + date.getSeconds();
	var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
	return formattedTime;
}