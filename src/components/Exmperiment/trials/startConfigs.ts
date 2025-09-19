 
import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";
import jsPsychPreload from "@jspsych/plugin-preload";
import WebgazerInitCamera from "@jspsych/plugin-webgazer-init-camera";
import jsPsychCallFunction from '@jspsych/plugin-call-function';
import { WebgazerExtensionWithMethods } from "../../../types";

export const createPreloadTrial = (imageUrls: string[] = []) => ({
    type: jsPsychPreload,
    images: imageUrls,
    message: `<p>Carregando os recursos para o experimento. Por favor, aguarde...</p>`,
    show_progress_bar: true,
    continue_after_error: false,
    on_finish: function() {
        console.log("Pré-carregamento de imagens concluído!");
    }
});

export const createCameraInstructions = () => ({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p style="font-size: 24px; font-weight: bold;">Bem-vindo ao Experimento!</p>
    <p>Este estudo utiliza uma tecnologia de rastreamento ocular experimental (beta), o que significa que precisamos da sua ajuda para garantir a melhor precisão possível.</p>
    
    <p style="font-size: 20px; margin-top: 30px;">Primeiro Passo: Configuração da Câmera</p>
    <p>Para começar, pediremos acesso à sua webcam. Por favor, permita o acesso à câmera quando solicitado pelo seu navegador.</p>
    
    <p>Em seguida, você verá uma caixa de enquadramento na tela. É crucial que você:</p>
    <ul>
      <li>Centralize seu rosto dentro dessa caixa.</li>
      <li>Olhe diretamente para a câmera.</li>
      <li>Tente manter sua cabeça o mais parada possível durante todo o experimento. Ajuste sua posição agora para ficar confortável.</li>
    </ul>
    <p>A câmera pode levar até 30 segundos para se inicializar e a caixa ficar verde, indicando que seu rosto foi detectado. Por favor, seja paciente.</p>
    
    <p style="font-size: 20px; margin-top: 30px;"><b>Próximos Passos: Calibração e Validação</b></p>
    
    <p>Após a configuração da câmera, passaremos por etapas de calibração e validação do sistema de rastreamento ocular. Se a precisão estiver abaixo do esperado, teremos uma etapa de recalibração.</p>
    
    <p style="margin-top: 40px;">Quando estiver pronto, clique em "Continuar".</p>
  `,
  choices: ["Continuar"],
});

export const createInitCameraTrial = () => ({
  type: WebgazerInitCamera,
  instructions: `
    <p>
      Para que o rastreamento ocular funcione bem, precisamos de acesso à sua webcam.
      Por favor, <b>permita o acesso à câmera</b> quando solicitado pelo navegador.
    </p>
    <p>
      Posicione sua cabeça de forma que a webcam tenha uma boa visão dos seus olhos.
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

export const createBeginTrial = () => ({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p>A proxíma etapa consiste em localizar os objetos</p>
    <p>Como desafio encare os objetos por alguns segundos. Para ir a proxíma imagem pressione espaço.</p>
    <p>Click em continuar, se precisar tirar um descanso.</p>
  `,
  choices: ["Continuar"],
});

export const createSetWebgazerRegressionTrial = (
    webgazerExt: WebgazerExtensionWithMethods | undefined, 
    regressionType: 'ridge' | 'weightedRidge' | 'threadedRidge' = 'weightedRidge'
) => ({
    type: jsPsychCallFunction,
    func: () => {
        if (webgazerExt) {
            console.log(`Configurando o tipo de regressão para '${regressionType}'`);
            webgazerExt.setRegressionType(regressionType);
        }
    },
});