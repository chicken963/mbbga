export class AudioTrack {
    id: string;
    url:string;
    name: string;
    artist: string;
    startTime: number;
    endTime: number;
    length: number;

    constructor(
        id: string,
        url: string,
        name: string,
        artist: string,
        startTime: number,
        endTime: number,
        length: number) {
        this.id = id;
        this.url = url;
        this.name = name;
        this.artist = artist;
        this.startTime = startTime;
        this.endTime = endTime;
        this.length = length;
    }
}