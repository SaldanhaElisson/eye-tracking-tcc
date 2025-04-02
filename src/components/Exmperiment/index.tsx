import { useEffect } from "react";
import { initJsPsych } from "jspsych";
import jsPsychExtensionWebgazer from "@jspsych/extension-webgazer";
import * as trials from './trials';
import generateTrial from "../../utils/generateTrial";

const Experiment = () => {
    useEffect(() => {
        const jsPsych = initJsPsych({
            extensions: [{ type: jsPsychExtensionWebgazer }],
            on_finish: () => {
                console.log('Experiment finished');
            }
        });

        // Verifique se todos os trials estão corretos
        const experimentTimeline = [
            trials.createPreloadTrial(),
            trials.createCameraInstructions(),
            trials.createInitCameraTrial(),
            trials.createCalibrationInstructions(),
            trials.createCalibrationTrial(),
            trials.createValidationInstructions(),
            trials.createValidationTrial(),
            trials.createRecalibrateTrial(jsPsych),
            trials.createBeginTrial(),
            ...generateTrial(["/image1.jpg"], "img")
        ];

        console.log('Experiment timeline:', experimentTimeline);

        try {
            jsPsych.run(experimentTimeline);
        } catch (error) {
            console.error('Error running experiment:', error);
        }
    }, []);

    return <div id="jspsych-experiment"></div>;
};

export default Experiment;