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


export const createShowPrecisionTrial = (jsPsych: any) => ({
  type: HtmlKeyboardResponsePlugin,
  stimulus: () => {
    const validation_data = jsPsych.data.get().filter({ task: 'validate' }).last(1).values()[0];

    if (validation_data && Array.isArray(validation_data.percent_in_roi)) {
      const lowest_precision = Math.min(...validation_data.percent_in_roi);

      return `
              <div style="font-size: 20px;">
                  <p>Teste de calibração inicial concluído.</p>
                  <p>Sua precisão (ponto mais crítico) foi de: <strong>${lowest_precision.toFixed(2)}%</strong></p>
                  <br>
                  <p>A seguir, você terá a opção de recalibrar caso não esteja satisfeito(a).</p>
                  <br>
                  <p>Pressione qualquer tecla para continuar.</p>
              </div>
          `;
    } else {
      return `
              <p>Não foi possível calcular a precisão. Pressione qualquer tecla para continuar.</p>
          `;
    }
  },
  choices: 'ALL_KEYS'
});


export const createVoluntaryRecalibrationLoop = (jsPsych: any) => {

  const askRecalibrateTrial = {
    type: jsPsychHtmlButtonResponse,
    stimulus: () => {
      const validation_data = jsPsych.data.get().filter({ task: 'validate' }).last(1).values()[0];
      const lowest_precision = validation_data ? Math.min(...validation_data.percent_in_roi) : 0;
      return `
        <p>Sua precisão atual (ponto mais crítico) é de <strong>${lowest_precision.toFixed(2)}%</strong>.</p>
        <p>Você gostaria de tentar uma nova recalibração para melhorar este valor?</p>
      `;
    },
    choices: ['Sim, tentar recalibrar', 'Não, estou satisfeito(a) e quero continuar'],
    data: {
      task: 'ask_recalibrate'
    }
  };

  const recalibrationActionsNode = {
    timeline: [
      createRecalibrateInstructions(jsPsych),
      createCalibrationTrial(jsPsych),
      createValidationInstructions(),
      createValidationTrial()
    ],
    conditional_function: function () {
      const ask_data = jsPsych.data.get().filter({ task: 'ask_recalibrate' }).last(1).values()[0];
      const userChoice = ask_data.response;

      if (userChoice === 0) {
        return true;
      } else {
        return false;
      }
    }
  };

  const voluntaryRecalibrationNode = {
    timeline: [
      askRecalibrateTrial,
      recalibrationActionsNode
    ],
    loop_function: function () {
      const ask_data = jsPsych.data.get().filter({ task: 'ask_recalibrate' }).last(1).values()[0];
      const userChoice = ask_data.response;

      if (userChoice === 0) {
        return true;
      } else {
        return false;
      }
    }
  };

  return voluntaryRecalibrationNode;
};

export const createRecalibrateInstructions = (jsPsych: any) => ({
  type: jsPsychHtmlButtonResponse,
  stimulus: () => {
    const validation_data = jsPsych.data.get().filter({ task: 'validate' }).last(1).values()[0];

    let precision_text;

    if (validation_data && Array.isArray(validation_data.percent_in_roi)) {
      const lowest_precision = Math.min(...validation_data.percent_in_roi);
      precision_text = `<p>Sua menor precisão foi de <strong>${lowest_precision.toFixed(2)}%</strong></p>`;
    }

    return `
      ${precision_text}
      <p>Vamos tentar calibrar mais uma vez.</p>
      <p>Por favor, olhe e CLIQUE nos pontos que irão aparecer na tela.</p>
    `;
  },
  choices: ['OK']
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