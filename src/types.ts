import { JsPsychExtension } from "jspsych";

export interface UploadedImage {
    url: string;
    name: string;
}

export interface WebgazerExtensionWithMethods extends JsPsychExtension {
    setRegressionType: (type: 'ridge' | 'weightedRidge' | 'threadedRidge') => void;
    showVideo: () => void;
    hideVideo: () => void;
    showPredictions: () => void;
    hidePredictions: () => void;
    startMouseCalibration: () => void;
    stopMouseCalibration: () => void;

}

export interface UploadPayload {
    images: UploadedImage[];
    width: number | null;
    height: number | null;
    qtdRecalibration: number;
}