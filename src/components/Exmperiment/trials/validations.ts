/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";
import jsPsychWebgazerValidate from "@jspsych/plugin-webgazer-validate";

export const createValidationInstructions = () => ({ 
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p>Agora, vamos validar a precisão da calibração.</p>
    <p>Você verá pontos novamente. Olhe para cada ponto, mas desta vez NÃO PRECISA CLICAR.</p>
    <p>Apenas siga-os com o olhar para que o sistema possa verificar o quão bem ele está rastreando.</p>
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


