import {Injectable} from '@angular/core';
import {LocalAudioTrack} from "./local-audio-track";
import {from, Observable} from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class LocalAudioService {

    private audioExtensions: string[] = ["wav", "mp3", "flac", "ogg", "aac", "m4a"]

    toLocalAudioTrack(file: File): Promise<LocalAudioTrack> {
        const audioUrl = URL.createObjectURL(file);
        const audio = new Audio();
        return new Promise<LocalAudioTrack>((resolve, reject) => {
            audio.src = audioUrl;
            audio.addEventListener('loadedmetadata', () => {
                let audiotrack = {
                    url:audioUrl,
                    name: this.initiateName(file.name),
                    artist: this.initiateArtist(file.name),
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

    initiateName(filename: string) {
        let wholeName = this.trimFileExtension(filename);
        const dashIndex = wholeName.indexOf('-');
        if (dashIndex !== -1) {
            return wholeName.substring(dashIndex + 1).trim();
        }
        return wholeName;
    }

    initiateArtist(filename: string) {
        let wholeName = this.trimFileExtension(filename);
        const dashIndex = wholeName.indexOf('-');
        if (dashIndex !== -1) {
            return wholeName.substring(0, dashIndex).trim();
        }
        return "";
    }

    trimFileExtension(filename: string): string {
        const dotIndex = filename.lastIndexOf('.');

        if (dotIndex !== -1 && this.audioExtensions.find(ext => filename.substring(dotIndex + 1) === ext)) {
            return filename.substring(0, dotIndex).trim();
        } else {
            return filename.trim();
        }
    }
}