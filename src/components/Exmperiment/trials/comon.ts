import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";
import jsPsychPreload from "@jspsych/plugin-preload";

export const createPreloadTrial = () => ({
  type: jsPsychPreload,
  auto_preload: true
});

export const createCameraInstructions = () => ({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p>Esse experimento é uma versão beta</p>
    <p>A primeira etapa consiste em calibração e validação da calibração, caso os valores sejam abaixo do esperado haverá uma etapa de recalibração.</p>
    <p>Normalmente demora 30 segundos para câmara se inicializar.</p>
  `,
  choices: ["Continuar"],
});

export const createBeginTrial = () => ({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p>A proxíma etapa consiste em localizar os objetos</p>
    <p>Como desafio encare os objetos por alguns segundos</p>
    <p>Para ir a proxíma imagem pressione espaço.</p>
    <p>Click em continuar, se precisar tirar um descanso.</p>
  `,
  choices: ["Continuar"],
});

export const createShowDataTrial = (jsPsych: any) => ({
  type: jsPsychHtmlButtonResponse,
  stimulus: function () {
    jsPsych.data.get().localSave('csv', 'eye-tracking-data.csv');
    
    const trial_data = jsPsych.data.get().values();
    const data_by_media: Record<string, any[]> = {};
    
    trial_data.forEach((trial: any) => {
      const media_path = trial.path;
      if (media_path) {
        if (!data_by_media[media_path]) {
          data_by_media[media_path] = [];
        }
        data_by_media[media_path].push(trial);
      }
    });

    const media_colors: Record<string, string> = {
      "/image1.jpg": "rgba(255, 255, 255, 0.7)",
      "/image2.jpg": "rgba(255, 0, 0, 0.7)",
      "/image3.jpg": "rgba(0, 0, 255, 0.7)",
    };

    let html = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      ">
        <h2 style="color: white; margin-bottom: 20px;">Visualização dos Pontos de Gaze</h2>
        <div style="
          position: relative;
          width: 100vw;
          height: 100vh;
          border: 3px solid white;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.7);
        ">
    `;

    Object.entries(data_by_media).forEach(([media_path, trials]) => {
      const color = media_colors[media_path] || "rgba(128, 128, 128, 0.7)";
      trials.forEach((trial) => {
        if (trial.webgazer_data) {
          trial.webgazer_data.forEach((gaze: { x: number; y: number }) => {
            const x = (gaze.x / window.innerWidth) * 100;
            const y = (gaze.y / window.innerHeight) * 100;

            html += `
              <div style="
                position: absolute;
                left: ${x}%;
                top: ${y}%;
                width: 8px;
                height: 8px;
                background-color: ${color};
                border-radius: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none;
              "></div>
            `;
          });
        }
      });
    });

    html += `
        </div>
      </div>
    `;

    return html;
  },
  choices: [],
});