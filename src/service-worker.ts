// Service worker for caching static assets and intermediate API calls


// TODO: 
// - Cache static data
// - Check cache before API calls

/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker';

const CACHE = `cache-${version}`;

const ASSETS = [
    ...build,
    ...files,
];



