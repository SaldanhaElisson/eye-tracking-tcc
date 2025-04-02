import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";
import jsPsychWebgazerCalibrate from "@jspsych/plugin-webgazer-calibrate";
import WebgazerInitCamera from "@jspsych/plugin-webgazer-init-camera";

export const createInitCameraTrial = () => ({
  type: WebgazerInitCamera,
  instructions: `
    <p>
      Posicione sua cabeça de forma que a webcam tenha uma boa visão dos seus olhos.<br>
      Centralize seu rosto na caixa e olhe diretamente para a câmera.<br>
      É importante que você tente manter a cabeça razoavelmente parada durante o experimento, então, por favor, reserve um momento para ajustar sua posição de forma confortável.<br>
      Quando seu rosto estiver centralizado na caixa e a caixa estiver verde, você pode clicar para continuar.
    </p>`
});

export const createCalibrationInstructions = () => ({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p>Estapa irá calibrar o sistema</p>
    <p>Você verá uma conjutno de pontos na tela, olhe fixamente para ponto.</p>
    <p>Tempo estimado: 2 minutos</p>
  `,
  choices: ["Continue"],
});

export const createCalibrationTrial = () => ({
  type: jsPsychWebgazerCalibrate,
  calibration_points: [
    [25, 25],
    [75, 25],
    [50, 50],
    [25, 75],
    [75, 75],
  ],
  calibration_mode: "click",
  point_color: "blue",
  point_size: 30,
  repetitions_per_point: 3,
  randomize_calibration_order: true,
});