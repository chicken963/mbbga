export interface AudioTrackVersion {
    id?: string;
    startTime: number;
    endTime: number;
    inputsEditable: boolean; //whether to show start time and end time in edit inputs
    progressInSeconds: number;
    createdByCurrentUser: boolean;
}