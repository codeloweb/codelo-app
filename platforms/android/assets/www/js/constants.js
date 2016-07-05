/*
 * Constants
 * */

//Weather icons
var iconMap = [];
//Day weather icons
iconMap["wsymbol_0001_sunny.png"] = "01d.png";
iconMap["wsymbol_0002_sunny_intervals.png"] = "02d.png";
iconMap["wsymbol_0003_white_cloud.png"] = "03d.png";
iconMap["wsymbol_0004_black_low_cloud.png"] = "04d.png";
iconMap["wsymbol_0006_mist.png"] = "06d.png";
iconMap["wsymbol_0007_fog.png"] = "06d.png";
iconMap["wsymbol_0009_light_rain_showers.png"] = "10d.png";
iconMap["wsymbol_0010_heavy_rain_showers.png"] = "09d.png";
iconMap["wsymbol_0011_light_snow_showers.png"] = "13d.png";
iconMap["wsymbol_0012_heavy_snow_showers.png"] = "13d.png";
iconMap["wsymbol_0013_sleet_showers.png"] = "13d.png";
iconMap["wsymbol_0016_thundery_showers.png"] = "11d.png";
iconMap["wsymbol_0017_cloudy_with_light_rain.png"] = "10d.png";
iconMap["wsymbol_0018_cloudy_with_heavy_rain.png"] = "09d.png";
iconMap["wsymbol_0019_cloudy_with_light_snow.png"] = "13d.png";
iconMap["wsymbol_0020_cloudy_with_heavy_snow.png"] = "13d.png";
iconMap["wsymbol_0021_cloudy_with_sleet.png"] = "13d.png";
iconMap["wsymbol_0024_thunderstorms.png"] = "09d.png";
//Night weather icons
iconMap["wsymbol_0008_clear_sky_night.png"] = "01n.png";
iconMap["wsymbol_0008_clear_sky_night.png"] = "02n.png";
iconMap["wsymbol_0004_black_low_cloud.png"] = "03n.png";
iconMap["wsymbol_0004_black_low_cloud.png"] = "04n.png";
iconMap["wsymbol_0006_mist.png"] = "06n.png";
iconMap["wsymbol_0007_fog.png"] = "06n.png";
iconMap["wsymbol_0025_light_rain_showers_night.png"] = "10n.png";
iconMap["wsymbol_0026_heavy_rain_showers_night.png"] = "09n.png";
iconMap["wsymbol_0027_light_snow_showers_night.png"] = "13n.png";
iconMap["wsymbol_0028_heavy_snow_showers_night.png"] = "13n.png";
iconMap["wsymbol_0029_sleet_showers_night.png"] = "13n.png";
iconMap["wsymbol_0032_thundery_showers_night.png"] = "11n.png";
iconMap["wsymbol_0033_cloudy_with_light_rain_night.png"] = "10n.png";
iconMap["wsymbol_0034_cloudy_with_heavy_rain_night.png"] = "09n.png";
iconMap["wsymbol_0035_cloudy_with_light_snow_night.png"] = "13n.png";
iconMap["wsymbol_0036_cloudy_with_heavy_snow_night.png"] = "13n.png";
iconMap["wsymbol_0037_cloudy_with_sleet_night.png"] = "13n.png";
iconMap["wsymbol_0040_thunderstorms_night.png"] = "09n.png";

//Grow planner map
var codeGrowId = [];
codeGrowId["C_OCASIONAL|L_BALCON|S_EM"]=0;
codeGrowId["C_OCASIONAL|L_BALCON|S_ET"]=1;
codeGrowId["C_OCASIONAL|L_BALCON|S_BM"]=2;
codeGrowId["C_OCASIONAL|L_BALCON|S_BT"]=3;
codeGrowId["C_OCASIONAL|L_BALCON|S_M"]=4;
codeGrowId["C_OCASIONAL|L_BALCON|S_A"]=5;
codeGrowId["C_OCASIONAL|L_TERRAZA|S_EM"]=6;
codeGrowId["C_OCASIONAL|L_TERRAZA|S_ET"]=7;
codeGrowId["C_OCASIONAL|L_TERRAZA|S_BM"]=8;
codeGrowId["C_OCASIONAL|L_TERRAZA|S_BT"]=9;
codeGrowId["C_OCASIONAL|L_TERRAZA|S_M"]=10;
codeGrowId["C_OCASIONAL|L_TERRAZA|S_A"]=11;
codeGrowId["C_OCASIONAL|L_SUELO|S_EM"]=12;
codeGrowId["C_OCASIONAL|L_SUELO|S_ET"]=13;
codeGrowId["C_OCASIONAL|L_SUELO|S_BM"]=14;
codeGrowId["C_OCASIONAL|L_SUELO|S_BT"]=15;
codeGrowId["C_OCASIONAL|L_SUELO|S_M"]=16;
codeGrowId["C_OCASIONAL|L_SUELO|S_A"]=17;
codeGrowId["C_OCASIONAL|L_PATIO|S_ESCASOM"]=18;
codeGrowId["C_OCASIONAL|L_PATIO|S_ESCASOT"]=19;
codeGrowId["C_OCASIONAL|L_PATIO|S_BAJOM"]=20;
codeGrowId["C_OCASIONAL|L_PATIO|S_BAJOT"]=21;
codeGrowId["C_OCASIONAL|L_PATIO|S_MEDIO"]=22;
codeGrowId["C_OCASIONAL|L_PATIO|S_ALTO"]=23;
codeGrowId["C_BAJO|L_BALCON|S_ESCASOM"]=24;
codeGrowId["C_BAJO|L_BALCON|S_ESCASOT"]=25;
codeGrowId["C_BAJO|L_BALCON|S_BAJOM"]=26;
codeGrowId["C_BAJO|L_BALCON|S_BAJOT"]=27;
codeGrowId["C_BAJO|L_BALCON|S_MEDIO"]=28;
codeGrowId["C_BAJO|L_BALCON|S_ALTO"]=29;
codeGrowId["C_BAJO|L_TERRAZA|S_ESCASOM"]=30;
codeGrowId["C_BAJO|L_TERRAZA|S_ESCASOT"]=31;
codeGrowId["C_BAJO|L_TERRAZA|S_BAJOM"]=32;
codeGrowId["C_BAJO|L_TERRAZA|S_BAJOT"]=33;
codeGrowId["C_BAJO|L_TERRAZA|S_MEDIO"]=34;
codeGrowId["C_BAJO|L_TERRAZA|S_ALTO"]=35;
codeGrowId["C_BAJO|L_SUELO|S_ESCASOM"]=36;
codeGrowId["C_BAJO|L_SUELO|S_ESCASOT"]=37;
codeGrowId["C_BAJO|L_SUELO|S_BAJOM"]=38;
codeGrowId["C_BAJO|L_SUELO|S_BAJOT"]=39;
codeGrowId["C_BAJO|L_SUELO|S_MEDIO"]=40;
codeGrowId["C_BAJO|L_SUELO|S_ALTO"]=41;
codeGrowId["C_BAJO|L_PATIO|S_ESCASOM"]=42;
codeGrowId["C_BAJO|L_PATIO|S_ESCASOT"]=43;
codeGrowId["C_BAJO|L_PATIO|S_BAJOM"]=44;
codeGrowId["C_BAJO|L_PATIO|S_BAJOT"]=45;
codeGrowId["C_BAJO|L_PATIO|S_MEDIO"]=46;
codeGrowId["C_BAJO|L_PATIO|S_ALTO"]=47;
codeGrowId["C_MEDIO|L_BALCON|S_ESCASOM"]=48;
codeGrowId["C_MEDIO|L_BALCON|S_ESCASOT"]=49;
codeGrowId["C_MEDIO|L_BALCON|S_BAJOM"]=50;
codeGrowId["C_MEDIO|L_BALCON|S_BAJOT"]=51;
codeGrowId["C_MEDIO|L_BALCON|S_MEDIO"]=52;
codeGrowId["C_MEDIO|L_BALCON|S_ALTO"]=53;
codeGrowId["C_MEDIO|L_TERRAZA|S_ESCASOM"]=54;
codeGrowId["C_MEDIO|L_TERRAZA|S_ESCASOT"]=55;
codeGrowId["C_MEDIO|L_TERRAZA|S_BAJOM"]=56;
codeGrowId["C_MEDIO|L_TERRAZA|S_BAJOT"]=57;
codeGrowId["C_MEDIO|L_TERRAZA|S_MEDIO"]=58;
codeGrowId["C_MEDIO|L_TERRAZA|S_ALTO"]=59;
codeGrowId["C_MEDIO|L_SUELO|S_ESCASOM"]=60;
codeGrowId["C_MEDIO|L_SUELO|S_ESCASOT"]=61;
codeGrowId["C_MEDIO|L_SUELO|S_BAJOM"]=62;
codeGrowId["C_MEDIO|L_SUELO|S_BAJOT"]=63;
codeGrowId["C_MEDIO|L_SUELO|S_MEDIO"]=64;
codeGrowId["C_MEDIO|L_SUELO|S_ALTO"]=65;
codeGrowId["C_MEDIO|L_PATIO|S_ESCASOM"]=66;
codeGrowId["C_MEDIO|L_PATIO|S_ESCASOT"]=67;
codeGrowId["C_MEDIO|L_PATIO|S_BAJOM"]=68;
codeGrowId["C_MEDIO|L_PATIO|S_BAJOT"]=69;
codeGrowId["C_MEDIO|L_PATIO|S_MEDIO"]=70;
codeGrowId["C_MEDIO|L_PATIO|S_ALTO"]=71;
codeGrowId["C_ALTO|L_BALCON|S_ESCASOM"]=72;
codeGrowId["C_ALTO|L_BALCON|S_ESCASOT"]=73;
codeGrowId["C_ALTO|L_BALCON|S_BAJOM"]=74;
codeGrowId["C_ALTO|L_BALCON|S_BAJOT"]=75;
codeGrowId["C_ALTO|L_BALCON|S_MEDIO"]=76;
codeGrowId["C_ALTO|L_BALCON|S_ALTO"]=77;
codeGrowId["C_ALTO|L_TERRAZA|S_ESCASOM"]=78;
codeGrowId["C_ALTO|L_TERRAZA|S_ESCASOT"]=79;
codeGrowId["C_ALTO|L_TERRAZA|S_BAJOM"]=80;
codeGrowId["C_ALTO|L_TERRAZA|S_BAJOT"]=81;
codeGrowId["C_ALTO|L_TERRAZA|S_MEDIO"]=82;
codeGrowId["C_ALTO|L_TERRAZA|S_ALTO"]=83;
codeGrowId["C_ALTO|L_SUELO|S_ESCASOM"]=84;
codeGrowId["C_ALTO|L_SUELO|S_ESCASOT"]=85;
codeGrowId["C_ALTO|L_SUELO|S_BAJOM"]=86;
codeGrowId["C_ALTO|L_SUELO|S_BAJOT"]=87;
codeGrowId["C_ALTO|L_SUELO|S_MEDIO"]=88;
codeGrowId["C_ALTO|L_SUELO|S_ALTO"]=89;
codeGrowId["C_ALTO|L_PATIO|S_ESCASOM"]=90;
codeGrowId["C_ALTO|L_PATIO|S_ESCASOT"]=91;
codeGrowId["C_ALTO|L_PATIO|S_BAJOM"]=92;
codeGrowId["C_ALTO|L_PATIO|S_BAJOT"]=93;
codeGrowId["C_ALTO|L_PATIO|S_MEDIO"]=94;
codeGrowId["C_ALTO|L_PATIO|S_ALTO"]=95;

//GPS TimeOut
var gpsTimeOut=30000;

//Bs. As. Position
var bsAsLatLong = "-34.603762,-58.381715";

/*
 * End Constants
 * */