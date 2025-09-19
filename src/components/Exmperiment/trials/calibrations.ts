/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";
import jsPsychWebgazerCalibrate from "@jspsych/plugin-webgazer-calibrate";
import HtmlKeyboardResponsePlugin from '@jspsych/plugin-html-keyboard-response';
import { createValidationInstructions, createValidationTrial } from "./validations";



export const createCalibrationInstructions = (jsPsych: any) => ({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p>A seguir, faremos a calibração do sistema de rastreamento ocular.</p>
    <p>Você verá uma sequência de pontos na tela. Por favor, olhe fixamente para cada ponto e CLIQUE NELE quando ele aparecer.</p>
    <p>Faça isso com precisão, pois uma boa calibração é crucial para a qualidade dos dados.</p>
    <p>Tempo estimado: aproximadamente 2 minutos.</p>
  `,
  choices: ["Começar Calibração"]
});

export const createCalibrationTrial = (jsPsych: any) => ({
  type: jsPsychWebgazerCalibrate,
  calibration_points: [
    [25, 25], [75, 25], [50, 50], [25, 75], [75, 75],
    [50, 25], [25, 50], [75, 50], [50, 75],
    [10, 10], [90, 10], [10, 90], [90, 90]
  ],
  calibration_mode: "click",
  point_size: 30,
  repetitions_per_point: 3,
  randomize_calibration_order: true,
});


export const createRecalibrateInstructions = () => ({ 
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p>A precisão da calibração está um pouco abaixo do esperado.</p>
    <p>Vamos tentar calibrar mais uma vez.</p>
    <p>Por favor, olhe e CLIQUE nos pontos que irão aparecer na tela.</p>
  `,
  choices: ['OK']
});

export const createRecalibrateTrial = (jsPsych: any) => ({
  timeline: [
    createRecalibrateInstructions(),
    createCalibrationTrial(jsPsych),
    createValidationInstructions(), 
    createValidationTrial() 
  ],

  conditional_function: function () {
    const validation_data = jsPsych.data.get().filter({ task: 'validate' }).values();
    if (validation_data.length === 0) {
        console.warn("Nenhum dado de validação encontrado para verificar a precisão da recalibração.");
        return false; 
    }
    const last_validation_data = validation_data[validation_data.length - 1];

    const minimum_percent_acceptable = 80; 
    
    const needs_recalibration = last_validation_data.percent_in_roi.some((x: number) => x < minimum_percent_acceptable);

    if (needs_recalibration) {
        console.log("Recalibração necessária. Pelo menos um ponto de validação está abaixo de", minimum_percent_acceptable, "%.");
    } else {
        console.log("Calibração aceitável. Não é necessária recalibração.");
    }
    return needs_recalibration;
  },
  data: {
    phase: 'recalibration',
  },
});

export const calibrationCompletedTrial = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
        <p>Calibração concluída! Preparando para o experimento.</p>
        <p>Mantenha sua cabeça o mais parada possível durante os próximos estímulos.</p>
    `,
    choices: 'NO_KEYS', 
    trial_duration: 5000, 
};