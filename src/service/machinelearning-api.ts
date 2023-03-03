
import axios from 'axios';
import type { videoType } from '../types/eventTypes';

export async function pingMachineLearningAPI() {
    try {
        let config = {
            method: 'get',
            url: 'http://127.0.0.1:8000/dashcam',
            headers: {
                'Content-Type': 'application/json'
            },
        };

        let response = await fetch(config.url, config);

        return response.status == 200;

    } catch (error) {
        console.log(error);
    }
}

export async function processVideoWithMachineLearning(selectedVideo: videoType) {
    try {
        let data = JSON.stringify({
            video_id: selectedVideo?.eventId,
            device_id: selectedVideo?.deviceId,
            video_link: selectedVideo?.videoUrl
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