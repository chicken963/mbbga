export interface AudioTrackVersion {
    id?: string;
    startTime: number;
    endTime: number;
    progressInSeconds: number;
    createdByCurrentUser: boolean;
    mode: string;
    selected: boolean;
}