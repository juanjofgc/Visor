// Crea un mapa y inicializa su posición y escala

/* CAPAS BASE 

  /*Unicamente cambiar el world_topo_map fuente: https://leaflet-extras.github.io/leaflet-providers/preview/ ejemplo: World_Street_Map*/
  var esri_img = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });

  var esri_img1 = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });

  var carto = L.tileLayer('http://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png',{attribution: 'Tiles &copy; CartoDB'});
/*Fin capas base*/


/*ARCHIVOS GEOJSON*/
/* Agrega aquí tu propio archivo GeoJSON el nombre es el que hace indicativo al archivo en la variable */
var ventidad = L.geoJSON(ventidad,
  {
    fillColor: '',/*color relleno*/
    opacity: 1,/*color relleno*/
    fillOpacity: 0,/*transparencia*/
    color: 'blue',/*color linea borde, blue*/
    weight: 2/*peso linea borde*/
  }
);

var vmun = L.geoJSON(vmun,
  {
    fillColor: '',/*color relleno*/
    opacity: 1,/*color relleno*/
    fillOpacity: 0,/*transparencia*/
    color: 'purple',/*color linea borde, purple*/
    weight: 1.5/*peso linea borde*/
  }
);
/*Ventana informacion municipio*/
vmun.bindPopup(function (layer) {
  return layer.feature.properties.nombre;
});
/*Fin de ventana informacion municipio*/


var vcol = L.geoJSON(vcol,
  {
      fillColor: '',/*color relleno*/
      opacity: 1,/*color relleno*/
      fillOpacity: 0,/*transparencia*/
      color: 'orchid',/*color linea borde, orchid*/
      weight: 0.5,  /*peso linea borde*/      
  }
);


/*Carga, estilo y pop de capa punto*/
/*Funcion estilo de punto http://bl.ocks.org/sigdeletras/b61d7aed65a7af157bca55527b0dbec0 , https://embed.plnkr.co/Gvei5I0S9yEo6fCYXPuy/*/
/*#31a354,*/
function estiloCircleMarker(feature, latlng) {
  return L.circleMarker(latlng, {
      radius: 1.5,
      fillColor: 'powderblue',
      color: '#01665e',
      weight: 1,
      opacity: 1.0,
      fillOpacity: 1.0
  })
}
/*Fin de funcoin estilo de punto */

/*Popup de ventana de punto*/
function onEachFeature(feature, layer) {
  // does this feature have a property named popupContent?
  if (feature.properties && feature.properties.direccion) {
      layer.bindPopup( '<h4>' + feature.properties.alcaldia + '</h4> <p> Domicilio: ' + feature.properties.direccion +'</p>'+ '<p> Colonia: ' + feature.properties.colonia_ +'</p>');
      
    }
}
/*Fin Popup de ventana de punto*/

/*Atributos de capa punto, agregar a control de mapa la variable*/
var lgeo= L.geoJSON(geojsonFeature, {
  onEachFeature: onEachFeature,
  pointToLayer: estiloCircleMarker
});
/*Fin de atributos de capa punto*/
/*Fin Carga, estilo y pop de capa punto*/




/* INICIALIZA EL MAPA */
/* Dependiendo de tu región de estudio puedes modificar el center y zoom */
/*Instancia L.map crea un mapa, dos argumentos id del div  y json con minimo centro y zoom*/
var map = L.map('map', {
/*    center: [19.413026, -99.218457 -102.356389], */
    center: [19.325075030834952,-99.13307189941406],
    zoom: 10,
    zoomControl: false, 
    layers: [esri_img, esri_img1, carto, ventidad, vmun, vcol, lgeo]
});


/*Pluging zoom restablecer https://github.com/torfsen/leaflet.zoomhome se apago zoomCOntrol en map*/
var zoomHome = L.Control.zoomHome({position: 'topleft'});
zoomHome.addTo(map);
/*Fin pluging */

/*
map.on('click', onMapClick);
*/

/*Control de capas normal */
/* Listar las capas base, cambiar para el orden de capa base, se despliega la ultima capa base */
var baseMaps = {
   "Esri-Street": esri_img1,
   "Esri-topologico": esri_img,
   "Carto": carto
};

/* Listar las capas overlays, capas que se pueden sobreponer */
var overlays = {   
  "Entidad": ventidad,
  "Alcaldias": vmun,
  "Colonias": vcol,
  "Tiraderos": lgeo,  
};

/* Se agrega el controlador  
L.control.layers(baseMaps, overlays).addTo(map);*/
/*Fin control de capas normañ */


/*Control de capas agrupado https://github.com/ismyrnow/leaflet-groupedlayercontrol */
var groupedOverlays = {
  "Capas": {
    "Entidad": ventidad,
    "Alcaldias": vmun,
    "Colonias": vcol
  },
  "Tiraderos": {
    "Tiraderos": lgeo
  }
};

/*
var options = {
  // Make the "Capas Base" group exclusive (use radio inputs)
  exclusiveGroups: ["Base"],
  // Show a checkbox next to non-exclusive group labels for toggling all
  groupCheckboxes: true
};
*/

/* position: 'topright', // 'topleft', 'bottomleft', 'bottomright'
    collapsed: false // true*/
L.control.groupedLayers(baseMaps, groupedOverlays,{
  collapsed: true,
  position: 'topright'
}).addTo(map);
/*Termina control de capas agrupado */
/*L.control.layers(baseMaps, overlays).addTo(map);*/


/*Control de escala http://bl.ocks.org/sigdeletras/669a78d38941190d23a6a55fe9cad549 , */
L.control.scale({
  imperial: false,
  metric: true, 
  position: 'topleft',
  }).addTo(map);
/*Fin control de escala*/
