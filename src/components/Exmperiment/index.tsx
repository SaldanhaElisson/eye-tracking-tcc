import { useEffect, useState } from "react";
import { initJsPsych } from "jspsych";
import jsPsychExtensionWebgazer from "@jspsych/extension-webgazer";
import * as trials from './trials';
import generateTrial from "../../utils/generateTrial";
import "./index.css";
import ImageUploader from "../ImageUploader";
import { UploadedImage, UploadPayload, WebgazerExtensionWithMethods } from "../../types";

const Experiment = () => {
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [experimentStarted, setExperimentStarted] = useState(false);

    const [imageWidth, setImageWidth] = useState<number>(700);
    const [imageHeight, setImageHeight] = useState<number>(900);

    const [qtdRecalibration, setQtdRecalibration] = useState<number>(1);

    const handleImagesUploaded = (payload: UploadPayload) => {
        setUploadedImages(payload.images);
        setImageWidth(payload.width ?? 700);
        setImageHeight(payload.height ?? 900);
        setExperimentStarted(true);
        setQtdRecalibration(payload.qtdRecalibration)
    };

    useEffect(() => {
        if (!experimentStarted || uploadedImages.length === 0) {
            return;
        }

        const jsPsych = initJsPsych({
            extensions: [{ type: jsPsychExtensionWebgazer }],
            on_finish: () => {
                uploadedImages.forEach(image => URL.revokeObjectURL(image.url));
                jsPsych.data.get().localSave('csv', 'eye-tracking-data.csv');
            }
        });

       const webgazerExt = jsPsych.extensions.webgazer as WebgazerExtensionWithMethods

        const imageUrlsToPreload = uploadedImages.map(image => image.url);

        const experimentTimeline = [
            trials.createPreloadTrial(imageUrlsToPreload), 
            trials.createInitCameraTrial(), 
            trials.createSetWebgazerRegressionTrial(webgazerExt),
            
            trials.createCalibrationInstructions(jsPsych), 
            trials.createCalibrationTrial(jsPsych), 
            trials.createValidationInstructions(),
            trials.createValidationTrial(),

            ...Array.from({ length: qtdRecalibration }, () => trials.createRecalibrateTrial(jsPsych)),

            trials.calibrationCompletedTrial,
            trials.createBeginTrial(), 
            ...generateTrial(uploadedImages, "img", imageWidth, imageHeight),

        ];


        try {
            jsPsych.run(experimentTimeline);
        } catch (error) {
            console.error('Error running experiment:', error);
        }

        return () => {
            uploadedImages.forEach(image => URL.revokeObjectURL(image.url));
        };

    }, [experimentStarted, uploadedImages]);

    return (
        <div id="jspsych-container">
            {!experimentStarted ? (
                <ImageUploader onImagesUploaded={handleImagesUploaded} />
            ) : (
                <div id="jspsych-experiment">
                    {/* O JsPsych renderizará o conteúdo aqui */}
                </div>
            )}
        </div>
    );
};

export default Experiment;