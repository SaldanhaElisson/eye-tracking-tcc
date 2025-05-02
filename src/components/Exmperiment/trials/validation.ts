/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";
import jsPsychWebgazerValidate from "@jspsych/plugin-webgazer-validate";
import { createCalibrationTrial } from "./calibration";

export const createValidationInstructions = () => ({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p>Agora nós iremos calcular a acuracia, estamos na etapa de validação.</p>
    <p>Olhe para os pontos que irão aparecer na tela.</p>
    <p style="font-weight: bold;">Você não rpecisa clicar neles</p>
  `,
  choices: ["Continue"],
  post_trial_gap: 1000,
});

export const createValidationTrial = () => ({
  type: jsPsychWebgazerValidate,
  validation_points: [
    [25, 25],
    [75, 25],
    [50, 50],
    [25, 75],
    [75, 75],
  ],
  roi_radius: 100,
  target_color: "green",
  time_to_saccade: 1000,
  randomize_validation_order: true,
  validation_duration: 3000,
  point_size: 30,
  data: {
    task: "validate",
  },
});

export const createRecalibrateInstructions = () => ({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p>A precisão da calibração está um pouco abaixo do esperado.</p>
    <p>Vamos tentar calibrar mais uma vez.</p>
    <p>Na próxima tela, olhe para os pontos e clique neles.</p>
  `,
  choices: ['OK'],
});

export const createRecalibrateTrial = (jsPsych: any) => ({
  timeline: [
    createRecalibrateInstructions(),
    createCalibrationTrial(),
    createValidationInstructions(),
    createValidationTrial()
  ],
  conditional_function: function () {
    const validation_data = jsPsych.data.get().filter({ task: 'validate' }).values()[0];
    const minimum_percent_acceptable = 80;
    return validation_data.percent_in_roi.some((x: number) => x < minimum_percent_acceptable);
  },
  data: {
    phase: 'recalibration',
  },
});