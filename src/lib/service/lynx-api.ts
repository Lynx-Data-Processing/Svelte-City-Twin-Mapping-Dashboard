import { PUBLIC_NODE_BACKEND_URL } from '$env/static/public';

import type {
    IDeviceType, IEventType,
    ISensorReading
} from '$lib/types/smarterAITypes';
import axios from 'axios';
import { fetchAuth } from "../features/auth/helpers/fetch-auth";

export const getSmarterAi = async () => {

    const config = {
        method: 'get',
        url: `${PUBLIC_NODE_BACKEND_URL}/`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${fetchAuth()}`,
        },
    };

    try {
        const res = await axios(config);
        return res;

    } catch (error: any) {
        if (error.response) {
            return error.response.status;
        }
        if (error.request) {
            return error.request;
        }
        return error.message;
    }
};

// get all smarterAI devices
export const getDevices = async () => {

    const config = {
        method: 'get',
        url: `${PUBLIC_NODE_BACKEND_URL}/devices`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${fetchAuth()}`,
        },
    };

    try {
        // parse response and return devices
        const res = await axios(config);
        const devices: IDeviceType[] = res.data.endpoints;

        return devices;
    } catch (error: any) {
        if (error.response) {
            return error.response.status;
        }
        if (error.request) {
            return error.request;
        }
        return error.message;
    }
};

// get information for a specific endpoint
export const getInfo = async (endpointId: string) => {

    const params = new URLSearchParams({
        endpointId: endpointId,
    });

    const config = {
        method: 'get',
        url: `${PUBLIC_NODE_BACKEND_URL}/info?${params.toString()}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${fetchAuth()}`,
        },
    };

    try {
        // parse response and return device
        const res = await axios(config);
        const device: IDeviceType = res.data;

        return device;
    } catch (error: any) {
        if (error.response) {
            return error.response.status;
        }
        if (error.request) {
            return error.request;
        }
        return error.message;
    }
}

// get events for a specific device
export const getEvents = async (deviceId: string) => {

    const params = new URLSearchParams({
        deviceId: deviceId,
    });

    const config = {
        method: 'get',
        url: `${PUBLIC_NODE_BACKEND_URL}/events?${params.toString()}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${fetchAuth()}`,
        },
    };

    try {
        // parse response and return events
        const res = await axios(config);
        const events: IEventType[] = res.data.events;

        return events;
    } catch (error: any) {
        if (error.response) {
            return error.response.status;
        }
        if (error.request) {
            return error.request;
        }
        return error.message;
    }
}


// get sensors for a specific endpoint
export const getSensor = async (
    endpointId: string,
    startTime: number,
    endTime: number,
    sensorType: string,
    processType: string,
) => {

    const params = new URLSearchParams({
        endpointId: endpointId,
        startTime: `${startTime}`,
        endTime: `${endTime}`,
        sensorType: sensorType,
        processType: processType,
    });

    const config = {
        method: 'get',
        url: `${PUBLIC_NODE_BACKEND_URL}/sensor?${params.toString()}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${fetchAuth()}`,
        },
    };

    try {
        // parse response and return sensor data
        const res = await axios(config);
        const sensorData: ISensorReading = res.data;

        return sensorData;
    } catch (error: any) {
        if (error.response) {
            return error.response.status;
        }
        if (error.request) {
            return error.request;
        }
        return error.message;
    }
}