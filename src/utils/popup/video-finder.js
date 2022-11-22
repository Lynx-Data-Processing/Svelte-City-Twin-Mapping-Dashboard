// https://blob.smarterai.com/eventrecording0/dir/4ae96319-7547-4015-bd45-6412c14c7e041663967029153.mp4?sig=aSs%2FLW%2BErGkg4kM02Od1kBdBUYg4oOWaFWWW%2FjALTdY%3D&se=2022-10-04T16%3A36%3A58Z&sv=2015-12-11&sp=rcw&sr=b
import { getAllVideoRecordingsFromDevice } from '../../service/smarter-api';

export const findVideo = async (StartTime, EndTime , deviceId) => {
  // 5 mins after and before timestamp
  return getAllVideoRecordingsFromDevice(
    deviceId,
    StartTime,
    EndTime,
  ).then((result) => {
    const videos = result.data.mediaEventRecordings.filter((res) => res.type === 'VIDEO'); // && res.endTimestamp > timestamp && res.startTimestamp < timestamp
    return videos.length ? videos[0].url : null;
  });
};

export default findVideo;
