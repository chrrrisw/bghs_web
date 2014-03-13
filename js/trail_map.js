function trail_map_init() {

    var map, selectControl, selectedFeature;
    var mapnik;
    var trl1;
    var trl2;
    var trl3;
    var vector_markers;

    function showHide(evt) {
        var layer = null;
        if (evt.target.id == "trail1Btn") {
            layer = trl1;
        } else if (evt.target.id == "trail2Btn") {
            layer = trl2;
        } else if (evt.target.id == "trail3Btn") {
            layer = trl3;
        } else if (evt.target.id == "poiBtn") {
            layer = vector_markers;
        }
        if (layer) {
            if (layer.getVisibility()) {
                ga('send', 'event', evt.target.id, 'hidden');
                layer.setVisibility(false);
            } else {
                ga('send', 'event', evt.target.id, 'shown');
                layer.setVisibility(true);
            }
        }
    }

    function onPopupClose(evt) {
        selectControl.unselect(selectedFeature);
    }

    function onFeatureSelect(feature) {
        ga('send', 'event', 'poi', 'shown');
        selectedFeature = feature;
        popup = new OpenLayers.Popup.FramedCloud("poi", feature.geometry.getBounds().getCenterLonLat(), null, "<div style='font-size:.8em'>" + feature.attributes.title + "<br>" + feature.attributes.description + "</div>", null, true, onPopupClose);
        feature.popup = popup;
        map.addPopup(popup);
    }

    function onFeatureUnselect(feature) {
        map.removePopup(feature.popup);
        feature.popup.destroy();
        feature.popup = null;
    }

    // Create the map
    map = new OpenLayers.Map("trailMap", {
        controls : [new OpenLayers.Control.Navigation(), new OpenLayers.Control.PanZoomBar(),
        //new OpenLayers.Control.LayerSwitcher(),
        new OpenLayers.Control.Attribution(), new OpenLayers.Control.MousePosition()],
        units : 'm',
        projection : new OpenLayers.Projection("EPSG:900913"),
        displayProjection : new OpenLayers.Projection("EPSG:4326")
    });

    // Create the layers
    mapnik = new OpenLayers.Layer.OSM();
    map.addLayer(mapnik);

    // Add the Layer with the GPX Track
    trl1 = new OpenLayers.Layer.Vector("Victoria Hill Walk", {
        strategies : [new OpenLayers.Strategy.Fixed()],
        protocol : new OpenLayers.Protocol.HTTP({
            url : "data/VictoriaHillWalk.gpx",
            format : new OpenLayers.Format.GPX()
        }),
        style : {
            strokeColor : "orange",
            strokeWidth : 5,
            strokeOpacity : 0.5
        },
        projection : new OpenLayers.Projection("EPSG:4326")
    });
    map.addLayer(trl1);

    // Add the Layer with the GPX Track
    trl2 = new OpenLayers.Layer.Vector("Phoenix Hike", {
        strategies : [new OpenLayers.Strategy.Fixed()],
        protocol : new OpenLayers.Protocol.HTTP({
            url : "data/PhoenixHike.gpx",
            format : new OpenLayers.Format.GPX()
        }),
        style : {
            strokeColor : "pink",
            strokeWidth : 5,
            strokeOpacity : 0.7
        },
        projection : new OpenLayers.Projection("EPSG:4326"),
        visibility : false
    });
    map.addLayer(trl2);

    // Add the Layer with the GPX Track
    trl3 = new OpenLayers.Layer.Vector("Lady Pearce Hike", {
        strategies : [new OpenLayers.Strategy.Fixed()],
        protocol : new OpenLayers.Protocol.HTTP({
            url : "data/LadyPearceHike.gpx",
            format : new OpenLayers.Format.GPX()
        }),
        style : {
            strokeColor : "green",
            strokeWidth : 5,
            strokeOpacity : 0.5
        },
        projection : new OpenLayers.Projection("EPSG:4326"),
        visibility : false
    });
    map.addLayer(trl3);

    vector_markers = new OpenLayers.Layer.Vector("Points of Interest", {
        strategies : [new OpenLayers.Strategy.Fixed()],
        protocol : new OpenLayers.Protocol.HTTP({
            url : "img/geolocated/poi.txt",
            format : new OpenLayers.Format.Text()
        }),
        projection : new OpenLayers.Projection("EPSG:4326"),
        visibility : false
    });
    map.addLayer(vector_markers);

    selectControl = new OpenLayers.Control.SelectFeature(vector_markers, {
        onSelect : onFeatureSelect,
        onUnselect : onFeatureUnselect
    });
    map.addControl(selectControl);
    selectControl.activate();

    /*
    var markers = new OpenLayers.Layer.Text("Points of Interest", {
    location : "img/geolocated/poi.txt",
    projection : new OpenLayers.Projection("EPSG:4326")
    });
    map.addLayer(markers);
    */

    // Define position and zoom level
    var fromProjection = new OpenLayers.Projection("EPSG:4326");
    // Transform from WGS 1984
    var toProjection = new OpenLayers.Projection("EPSG:900913");
    // to Spherical Mercator Projection
    var position = new OpenLayers.LonLat(138.826, -34.662).transform(fromProjection, toProjection);
    var zoom = 15;

    // Set position and zoom level
    map.setCenter(position, zoom);

    $("#trail1Btn").on("click", showHide).addClass("active");
    $("#trail2Btn").on("click", showHide);
    $("#trail3Btn").on("click", showHide);
    $("#poiBtn").on("click", showHide);
}

