
import { PUBLIC_QUEENS_API_URL, PUBLIC_QUEENS_IMAGE_URL } from "$env/static/public";
import type { ISeachParameters } from "../types";
import type { IQueensData } from '../types/queensTypes';


export const getQueensData = async (searchParams: ISeachParameters) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Cookie", "csrftoken=Rqpt2pSLcXhurB3ebMmgogCW6rBMpPma");
    
    var urlencoded = new URLSearchParams();
    urlencoded.append("dateStart", searchParams.dateStart);
    urlencoded.append("dateEnd", searchParams.dateEnd);
    urlencoded.append("location", "[[44.2130138219895,-76.54269376924945],[44.26005731091407,-76.54269376924945],[44.26196285545905,-76.47214094332172],[44.21215254495739,-76.47385755709125]]");
    urlencoded.append("model", "model1");
    urlencoded.append("videoReturn", searchParams.returnVideo ? "1" : "0");
    
    var requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    const response = await fetch(PUBLIC_QUEENS_API_URL, requestOptions)
    const data: IQueensData[] = await response.json()

    // For each element in the data array, add a url in from of the videoPath
    data.forEach(element => {
        if(element.videoPath){ element.videoPath = `${PUBLIC_QUEENS_IMAGE_URL}${element.videoPath}`}
    });

    return data

}