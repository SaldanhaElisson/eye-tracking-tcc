/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";
import jsPsychWebgazerValidate from "@jspsych/plugin-webgazer-validate";
import { createCalibrationTrial } from "./calibration";


export const createValidationInstructions = () => ({ 
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p>Agora, vamos **validar a precisão** da calibração.</p>
    <p>Você verá pontos novamente. **Olhe para cada ponto**, mas desta vez **NÃO PRECISA CLICAR**.</p>
    <p>Apenas siga-os com o olhar para que o sistema possa verificar o quão bem ele está rastreando.</p>
    <p style="font-size: 16px; color: #555;">(Observe o ponto azul. Tente fazê-lo se mover com precisão para cada ponto.)</p>
  `,
  choices: ["Começar Validação"],
  post_trial_gap: 1000
});


export const createValidationTrial = () => ({ 
  type: jsPsychWebgazerValidate,
  validation_points: [
    [25, 25], [75, 25], [50, 50], [25, 75], [75, 75],
   
    [50, 25], [25, 50], [75, 50], [50, 75], 
    [10, 10], [90, 10], [10, 90], [90, 90], 
  ],
  roi_radius: 100,
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
    <p>Por favor, **olhe e CLIQUE nos pontos** que irão aparecer na tela.</p>
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