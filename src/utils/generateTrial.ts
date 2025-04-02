// utils/generateTrial.ts
import VideoKeyboardResponsePlugin from "@jspsych/plugin-video-keyboard-response";
import imageKeyboardResponse from '@jspsych/plugin-image-keyboard-response';
import jsPsychExtensionWebgazer from "@jspsych/extension-webgazer"; 

export default function generateTrial(
    filePaths: string[], 
    typeFile: "img" | "video"
) {
    const mediaPlugin = typeFile === "video" 
        ? VideoKeyboardResponsePlugin 
        : imageKeyboardResponse;
    
    return filePaths.map((path) => ({
        type: mediaPlugin,
        stimulus: path,  // Removido o array [] aqui
        choices: [" "],
        stimulus_width: 1700,
        stimulus_height: 800,
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
        }
    }));
}