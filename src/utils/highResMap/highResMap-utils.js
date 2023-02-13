import { 
    PUBLIC_ESRI_CONFIG_KEY,
    PUBLIC_ESRI_ELEVATION_LAYER_URL,
    PUBLIC_ESRI_TILE_LAYER_URL
} from "$env/static/public";

let view;

// TODO: esri types

// Config esri API

export const esriAPIConfig = (esriConfig) => { 
    esriConfig.apiKey = PUBLIC_ESRI_CONFIG_KEY;
}

// Create esri high res map

export const esriMapConfig = (
    Map,
    MapView,
    Home,
    ScaleBar,
    LayerList,
    Legend,
    Expand,
    Compass,
    TileLayer,
    SceneView,
    FeatureLayer,
    ElevationLayer
) => {
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
    view = new SceneView({
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

