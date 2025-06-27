// utils/generateTrial.ts

import VideoKeyboardResponsePlugin from "@jspsych/plugin-video-keyboard-response";
import imageKeyboardResponse from '@jspsych/plugin-image-keyboard-response';
import jsPsychExtensionWebgazer from "@jspsych/extension-webgazer";

interface UploadedImage {
    url: string;
    name: string;
}

export default function generateTrial(
    images: UploadedImage[],
    typeFile: "img" | "video",
) {
    const mediaPlugin = typeFile === "video"
        ? VideoKeyboardResponsePlugin
        : imageKeyboardResponse;

    return images.map((image) => ({
        type: mediaPlugin,
        stimulus: image.url,
        choices: [" "],
        stimulus_width: 700,
        stimulus_height: 900,

        extensions: [{
            type: jsPsychExtensionWebgazer,
            params: {
                targets: [typeFile === "video"
                    ? '#jspsych-video-keyboard-response-stimulus'
                    : '#jspsych-image-keyboard-response-stimulus']
            }
        }],
        data: {
            path: image.url,
            original_filename: image.name,
            trialType: typeFile === "video" ? "video" : "image",

        },


    }));
}