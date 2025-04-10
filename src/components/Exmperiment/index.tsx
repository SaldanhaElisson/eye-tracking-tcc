import { useEffect } from "react";
import { initJsPsych } from "jspsych";
import jsPsychExtensionWebgazer from "@jspsych/extension-webgazer";
import * as trials from './trials';
import generateTrial from "../../utils/generateTrial";
import "./index.css";

const Experiment = () => {
    useEffect(() => {
        const jsPsych = initJsPsych({
            extensions: [{ type: jsPsychExtensionWebgazer }],
            on_finish: () => {
                console.log("Experiment finished");
            }
        });

        const experimentTimeline = [
            trials.createPreloadTrial(),
            trials.createCameraInstructions(),
            trials.createInitCameraTrial(),
            trials.createCalibrationInstructions(),
            trials.createCalibrationTrial(),
            trials.createValidationInstructions(),
            trials.createValidationTrial(),
            trials.createRecalibrateTrial(jsPsych),
            // trials.createRecalibrateTrial(jsPsych)
            trials.createBeginTrial(),
            ...generateTrial(["/001.jpg", "/002.jpg"], "img"),
            trials.createShowDataTrial(jsPsych)

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