
import axios from 'axios';

export async function processVideoWithMachineLearning(videoLink: string) {
    try {
        let data = JSON.stringify({
            video_link: videoLink
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