import {Injectable} from '@angular/core';
import {LocalAudioTrack} from "./local-audio-track";
import {from, Observable} from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class LocalAudioService {

    toLocalAudioTrack(file: File): Promise<LocalAudioTrack> {
        const audioUrl = URL.createObjectURL(file);
        const audio = new Audio();
        return new Promise<LocalAudioTrack>((resolve, reject) => {
            audio.src = audioUrl;
            audio.addEventListener('loadedmetadata', () => {
                let audiotrack = {
                    url:audioUrl,
                    name: file.name,
                    artist: "",
                    startTime: 0,
                    endTime: audio.duration,
                    length: audio.duration,
                    audioEl: audio,
                    file: file
                } as LocalAudioTrack
                resolve(audiotrack);
            });
            audio.addEventListener('error', (error) => {
                reject(error);
            });
        });
    }
}