
import type { IVideoType } from '$lib/types/eventTypes';
import axios from 'axios';

export const pingMachineLearningAPIWithAxios = async () => {
    try {
        let config = {
            method: 'get',
            url: 'http://127.0.0.1:8000/dashcam',
            headers: {
                'Content-Type': 'application/json'
            },
        };

        const promise = await axios(config);
        return promise;

    } catch (error: any) {
        if (error.response) {
            return error.response.status;
        } if (error.request) {
            return error.request;
        }
        return error.message;
    }
}

export async function processVideoWithMachineLearning(eventId: number, deviceId: number, videoUrl: string) {
    try {
        let data = JSON.stringify({
            video_id: eventId,
            device_id: deviceId,
            video_link: videoUrl
        });

        let config = {
            method: 'post',
            url: 'http://127.0.0.1:8000/dashcam/machinelearning',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        };

        let response = await fetch(config.url, config);
        let videoBlob = await response.blob();
        let processedVideoUrl = URL.createObjectURL(videoBlob);
        return processedVideoUrl;
    } catch (error) {
        console.log(error);
    }
}