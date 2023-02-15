import {
    PUBLIC_ESRI_CONFIG_KEY,
    PUBLIC_ESRI_ELEVATION_LAYER_URL,
    PUBLIC_ESRI_TILE_LAYER_URL
} from "$env/static/public";


// TODO: esri types

// Config esri API

export const esriAPIConfig = (esriConfig) => {
    esriConfig.apiKey = PUBLIC_ESRI_CONFIG_KEY;
}

export const createMapAndSceneView = (Map, SceneView, ElevationLayer, TileLayer) => {
    const map = new Map({
        ground: {
            layers: [
                new ElevationLayer({
                    url: PUBLIC_ESRI_ELEVATION_LAYER_URL
                })
            ]
        },
        layers: [
            new TileLayer({
                url: PUBLIC_ESRI_TILE_LAYER_URL
            })
        ],
        basemap: 'arcgis-navigation'
    });
    let view = new SceneView({
        container: 'viewDiv',
        map: map,
        zoom: 10, // scale: 72223.819286

        camera: {
            position: {
                x: -76.491143, //Longitude
                y: 44.231689, //Latitude
                z: 2000 //Meters
            },
            tilt: 40
        }
    });

    return [map, view];
}


// Create esri high res map

export const createMapWidgets = (
    view,
    Home,
    ScaleBar,
    LayerList,
    Legend,
    Expand,
    Compass
) => {


    // Add widgets
    const homeBtn = new Home({
        view: view
    });

    const scaleBar = new ScaleBar({
        view: view,
        unit: 'dual'
    });

    const layerList = new LayerList({
        view: view
    });

    const legend = new Legend({
        view: view
    });

    const layerListExpand = new Expand({
        view: view,
        content: layerList,
        expanded: false,
        expandTooltip: 'Expand LayerList'
    });

    const legendExpand = new Expand({
        view: view,
        content: legend,
        expandTooltip: 'Expand Legend',
        expanded: false
    });

    const compass = new Compass({
        view: view,
        visible: false
    });

    view.ui.add(homeBtn, 'top-left');
    view.ui.add(scaleBar, 'bottom-right');
    view.ui.add(layerListExpand, 'top-right');
    view.ui.add(legendExpand, 'bottom-left');
    view.ui.add(compass, 'top-left');

    // load the Compass only when the view is rotated
    view.watch('rotation', function (rotation) {
        if (rotation && !compass.visible) {
            compass.visible = true;
        }
    });

}

export const createBaseMapToggle = (view, BasemapToggle, BasemapGallery) => {
    const basemapToggle = new BasemapToggle({
        view: view,
        nextBasemap: "arcgis-imagery"
    });

    view.ui.add(basemapToggle, "bottom-right");

    const basemapGallery = new BasemapGallery({
        view: view,
        source: {
            query: {
                title: '"World Basemaps for Developers" AND owner:esri'
            }
        }
    });

}


export const addTileLayer = (map, TileLayer, url) => {
    const tileLayer = new TileLayer({
        url: url
    });

    map.add(tileLayer);
}

export const addFeatureLayer = (map, FeatureLayer, url) => {
    const featureLayer = new FeatureLayer({
        url: url
    });

    map.add(featureLayer);
}