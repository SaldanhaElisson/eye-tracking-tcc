import { useEffect, useState } from "react";
import { initJsPsych, JsPsychExtension } from "jspsych";
import jsPsychExtensionWebgazer from "@jspsych/extension-webgazer";
import * as trials from './trials';
import generateTrial from "../../utils/generateTrial";
import "./index.css";
import ImageUploader from "../ImageUploader";

import HtmlKeyboardResponsePlugin from '@jspsych/plugin-html-keyboard-response';
interface UploadedImage {
    url: string;
    name: string;
}

interface WebgazerExtensionWithMethods extends JsPsychExtension {
    setRegressionType: (type: 'ridge' | 'weightedRidge' | 'threadedRidge') => void;
    showVideo: () => void;
    hideVideo: () => void;
    showPredictions: () => void;
    hidePredictions: () => void;
    startMouseCalibration: () => void;
    stopMouseCalibration: () => void;

}

const Experiment = () => {
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [experimentStarted, setExperimentStarted] = useState(false);

    const handleImagesUploaded = (images: UploadedImage[]) => {
        setUploadedImages(images);
        setExperimentStarted(true);
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

        const webgazerExt = jsPsych.extensions.webgazer as WebgazerExtensionWithMethods | undefined;

        if (webgazerExt) {
            console.log("WebGazer regression type set to 'weightedRidge'.");
        }

        const imageUrlsToPreload = uploadedImages.map(image => image.url);

        const experimentTimeline = [
            trials.createPreloadTrial(imageUrlsToPreload),
            trials.createInitCameraTrial(),
            trials.createCalibrationInstructions(jsPsych),
            trials.createCalibrationTrial(jsPsych),
            trials.createValidationInstructions(),
            trials.createRecalibrateTrial(jsPsych),
            trials.createRecalibrateTrial(jsPsych),

            {
                type: HtmlKeyboardResponsePlugin,
                stimulus: `
                    <p>Calibração concluída! Preparando para o experimento.</p>
                    <p>Mantenha sua cabeça o mais parada possível durante os próximos estímulos.</p>
                `,
                choices: 'NO_KEYS',
                trial_duration: 2000,
                on_start: () => {
                    if (webgazerExt) {
                        webgazerExt.hidePredictions();
                        webgazerExt.hideVideo();

                    }
                },
            },

            trials.createBeginTrial(),
            ...generateTrial(uploadedImages, "img"),

        ];

        console.log('Experiment timeline:', experimentTimeline);

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