import {Injectable} from '@angular/core';
import {AudioTrack} from "../interfaces/audio-track";

@Injectable({
    providedIn: 'root',
})
export class LocalAudioService {

    private audioExtensions: string[] = ["wav", "mp3", "flac", "ogg", "aac", "m4a"]

    toLocalAudioTrack(file: File, mode: string): Promise<AudioTrack> {
        const audioUrl = URL.createObjectURL(file);
        const audio = new Audio();
        return new Promise<AudioTrack>((resolve, reject) => {
            audio.src = audioUrl;
            audio.addEventListener('loadedmetadata', () => {
                let audioTrack = {
                    url: audioUrl,
                    name: this.initiateName(file.name),
                    artist: this.initiateArtist(file.name),
                    length: audio.duration,
                    audioEl: audio,
                    file: file,
                    mode: mode,
                    createdByCurrentUser: true,
                    versions: [{
                        mode: 'edit',
                        createdByCurrentUser: true,
                        startTime: 0,
                        endTime: audio.duration
                    }]
                } as AudioTrack
                resolve(audioTrack);
            });
            audio.addEventListener('error', (error) => {
                reject(error);
            });
        });
    }

    initiateName(filename: string) {
        let wholeName = this.trimFileExtension(filename);
        let dashIndex = this.findDashIndex(wholeName);
        if (dashIndex !== -1) {
            return wholeName.substring(dashIndex + 1).trim();
        }
        return wholeName;
    }

    initiateArtist(filename: string) {
        let wholeName = this.trimFileExtension(filename);
        let dashIndex = this.findDashIndex(wholeName);
        if (dashIndex !== -1) {
            return wholeName.substring(0, dashIndex).trim();
        }
        return "";
    }

    private findDashIndex(wholeName: string) {
        let dashIndex = wholeName.indexOf('-');
        if (dashIndex === -1) {
            dashIndex = wholeName.indexOf('–');
        }
        return dashIndex;
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