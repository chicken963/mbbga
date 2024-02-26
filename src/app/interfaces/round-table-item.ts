export interface RoundTableItem {
    audioFileId: string,
    artist: string,
    title: string,
    versionId: string,
    startTime: number,
    endTime: number,
    duration: number,
    selected: boolean,
    audioEl: HTMLAudioElement,
    url: string,
    progressInSeconds: number;
    status: 'not loaded' | 'loading' | 'preloading' | 'loaded';
}