/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";
import jsPsychWebgazerCalibrate from "@jspsych/plugin-webgazer-calibrate";
import WebgazerInitCamera from "@jspsych/plugin-webgazer-init-camera";

interface WebgazerExtensionWithMethods {
    setRegressionType: (type: 'ridge' | 'weightedRidge' | 'threadedRidge') => void;
    showVideo: () => void;
    hideVideo: () => void;
    showPredictions: () => void;
    hidePredictions: () => void;
    startMouseCalibration: () => void;
    stopMouseCalibration: () => void;
}

export const createInitCameraTrial = () => ({
  type: WebgazerInitCamera,
  instructions: `
    <p>
      Para que o rastreamento ocular funcione bem, precisamos de acesso à sua webcam.<br>
      Por favor, <b>permita o acesso à câmera</b> quando solicitado pelo navegador.
    </p>
    <p>
      Posicione sua cabeça de forma que a webcam tenha uma boa visão dos seus olhos.<br>
      Tente centralizar seu rosto na caixa que aparece na tela e olhe diretamente para a câmera.
    </p>
    <p>
      É importante que você tente manter a cabeça razoavelmente parada durante todo o experimento.
      Por favor, reserve um momento para ajustar sua posição de forma confortável.
    </p>
    <p>
      Quando seu rosto estiver bem posicionado (a caixa ficará verde), você pode clicar para continuar.
    </p>`
});

export const createCalibrationInstructions = (jsPsych: any) => ({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p>A seguir, faremos a **calibração do sistema de rastreamento ocular**.</p>
    <p>Você verá uma sequência de pontos na tela. Por favor, **olhe fixamente para cada ponto e CLIQUE NELE** quando ele aparecer.</p>
    <p>Faça isso com precisão, pois uma boa calibração é crucial para a qualidade dos dados.</p>
    <p>Tempo estimado: aproximadamente 2 minutos.</p>
    <p style="font-size: 16px; color: #555;">(Se você vir um pequeno ponto azul seguindo seu olhar, tente fazê-lo se mover com precisão para cada ponto de calibração.)</p>
  `,
  choices: ["Começar Calibração"],
   on_start: function() {
    const webgazerExt = jsPsych.extensions.webgazer as WebgazerExtensionWithMethods;
    if (webgazerExt) {
        webgazerExt.hideVideo();     
        webgazerExt.showPredictions();
    }
  }
});

export const createCalibrationTrial = (jsPsych: any) => ({ 
  type: jsPsychWebgazerCalibrate,
 calibration_points: [
    [25, 25], [75, 25], [50, 50], [25, 75], [75, 75], 
    [50, 25], [25, 50], [75, 50], [50, 75], 
    [10, 10], [90, 10], [10, 90], [90, 90],
  ],
  calibration_mode: "click",
  point_color: "blue",
  point_size: 30,
  repetitions_per_point: 3,
  randomize_calibration_order: true,
  on_start: function() { 
    const webgazerExt = jsPsych.extensions.webgazer as WebgazerExtensionWithMethods;
    if (webgazerExt) {
        webgazerExt.hideVideo();
        webgazerExt.showPredictions();
    }
  }
});
