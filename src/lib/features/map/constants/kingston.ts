import type { IMapDetailsType } from "../types";

export const OPEN_DATA_KINGSTON_CITY_ZONES_URL = "https://opendatakingston.cityofkingston.ca/api/records/1.0/search/?dataset=neighbourhoods&q=&rows=100&facet=name";
export const OPEN_DATA_KINGSTON_TREES_URL = "https://opendatakingston.cityofkingston.ca/api/records/1.0/search/?dataset=trees-municipal&q=&rows=500&facet=owner&facet=common_name&facet=scientific_name&facet=date_installed&facet=memorial_tree";
export const OPEN_DATA_KINGSTON_PLANNING_POINT_URL = "https://opendatakingston.cityofkingston.ca/api/records/1.0/search/?dataset=capital-planning-points&q=&rows=1000&facet=capital_program_point&facet=program_subclass&facet=project_title&facet=project_description&facet=project_planning_from&facet=project_planning_to&facet=planned_construction_from&facet=planned_construction_to&facet=construction_completion_from&facet=construction_completion_to";
export const OPEN_DATA_KINGSTON_PLANNING_POLYGON_URL = "https://opendatakingston.cityofkingston.ca/api/records/1.0/search/?dataset=capital-planning-polygons&q=&rows=1000&facet=program_subclass&facet=project_title&facet=project_planning_from&facet=project_planning_to&facet=planned_construction_from&facet=planned_construction_to&facet=construction_completion_from&facet=construction_completion_to";
export const OPEN_DATA_KINGSTON_PLANNING_LINE_URL = "https://opendatakingston.cityofkingston.ca/api/records/1.0/search/?dataset=road-segments&q=&rows=1000&facet=street_type_suffix&facet=no_of_lane&facet=gis_class&facet=jurisdiction&facet=right_side_parity&facet=traffic_flow&facet=status&facet=road_level";
export const OPEN_DATA_KINGSTON_BUS_ROUTES_URL = "https://opendatakingston.cityofkingston.ca/api/records/1.0/search/?dataset=transit-gtfs-routes&q=&rows=1000&facet=route_short_name"
export const OPEN_DATA_KINGSTON_CYCLING_PATHS_URL = "https://opendatakingston.cityofkingston.ca/api/records/1.0/search/?dataset=cycling-facilities&q=&rows=500&facet=cycle_status&facet=cycle_type&facet=construction_status&facet=construction_type&facet=cycle_width"
export const OPEN_DATA_KINGSTON_WALKING_PATHS_URL = "https://opendatakingston.cityofkingston.ca/api/records/1.0/search/?dataset=paths&q=&rows=5000&facet=material"

export const KINGSTON_COORDINATES_OBJ = { lng: -76.491143, lat: 44.231689 }
export const KINGSTON_COORDINATES_ARRAY = [-76.491143, 44.231689]

export const INITIAL_MAP_DATA: IMapDetailsType = {
    mapTypeId: 'satellite',
    center: KINGSTON_COORDINATES_OBJ,
    zoom: 17,
    tilt: 45,
    heading: -17.6,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: 1,
      mapTypeIds: ["satellite","roadmap", "terrain"],
      position: 2
    },
};

