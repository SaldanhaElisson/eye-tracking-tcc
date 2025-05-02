/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/generateTrial.ts
import VideoKeyboardResponsePlugin from "@jspsych/plugin-video-keyboard-response";
import imageKeyboardResponse from '@jspsych/plugin-image-keyboard-response';
import jsPsychExtensionWebgazer from "@jspsych/extension-webgazer"; 

export default function generateTrial(
    filePaths: string[], 
    typeFile: "img" | "video",
) {
    const mediaPlugin = typeFile === "video" 
        ? VideoKeyboardResponsePlugin 
        : imageKeyboardResponse;
    
    return filePaths.map((path) => ({
        type: mediaPlugin,
        stimulus: path,
        choices: [" "],
        stimulus_width: 700, 
        extensions: [{
            type: jsPsychExtensionWebgazer,
            params: { 
                targets: [typeFile === "video" 
                    ? '#jspsych-video-keyboard-response-stimulus' 
                    : '#jspsych-image-keyboard-response-stimulus']
            }
        }],
        data: {
            path,
            trialType: typeFile === "video" ? "video" : "image"
        },
        on_finish: function(data: any) {
            if (data.webgazer_data) {
              const stimulusElement = typeFile === "video" 
                ? document.querySelector('#jspsych-video-keyboard-response-stimulus') 
                : document.querySelector('#jspsych-image-keyboard-response-stimulus');
              
              if (stimulusElement) {
                const rect = stimulusElement.getBoundingClientRect();

                data.webgazer_data_relative = data.webgazer_data.map((gaze: { x: number; y: number }) => ({
                  x: (gaze.x - rect.left) / rect.width * 100,
                  y: (gaze.y - rect.top) / rect.height * 100
                }));
              }
            }
          }
    }));
}