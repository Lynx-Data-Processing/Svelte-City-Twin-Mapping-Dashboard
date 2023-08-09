
// TODO: 
// - Load Google Map / Map Data
// - Load Kingston Data
// - Cache Static Data

/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker';

const CACHE = `cache-${version}`;

const ASSETS = [
    ...build,
    ...files,
];

