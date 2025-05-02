/* eslint-disable @typescript-eslint/no-explicit-any */
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



function getColorForPath(path: string): string {
  let hash = 0;
  for (let i = 0; i < path.length; i++) {
    hash = path.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const channel = hash % 3;
  const r = channel === 0 ? 200 + (hash % 55) : 50 + (hash % 100);
  const g = channel === 1 ? 200 + (hash % 55) : 50 + (hash % 100);
  const b = channel === 2 ? 200 + (hash % 55) : 50 + (hash % 100);
  
  return `rgba(${r}, ${g}, ${b}, 0.8)`;
}

function createColorMap(paths: string[]): Record<string, string> {
  const colorMap: Record<string, string> = {};
  paths.forEach(path => {
    colorMap[path] = getColorForPath(path);
  });
  return colorMap;
}
export const createShowDataTrial = (jsPsych: any) => ({
  type: jsPsychHtmlButtonResponse,
  stimulus: function () {
    jsPsych.data.get().localSave('csv', 'eye-tracking-data.csv');
    
    const trial_data = jsPsych.data.get().values();
    const data_by_media: Record<string, any[]> = {};
    const all_paths: string[] = [];
    
    trial_data.forEach((trial: any) => {
      const media_path = trial.path;
      if (media_path) {
        if (!data_by_media[media_path]) {
          data_by_media[media_path] = [];
          all_paths.push(media_path);
        }
        data_by_media[media_path].push(trial);
      }
    });

    const media_colors = createColorMap(all_paths);

    let legendHtml = '<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; margin-bottom: 20px;">';
    all_paths.forEach(path => {
      const filename = path.split('/').pop() || path;
      legendHtml += `
        <div style="display: flex; align-items: center;">
          <div style="
            width: 15px;
            height: 15px;
            background-color: ${media_colors[path]};
            border-radius: 50%;
            margin-right: 5px;
          "></div>
          <span style="color: white;">${filename}</span>
        </div>
      `;
    });
    legendHtml += '</div>';

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
        padding: 20px;
        box-sizing: border-box;
      ">
        <h2 style="color: white; margin-bottom: 10px;">Visualização dos Pontos de Gaze</h2>
        ${legendHtml}
        <div style="
          position: relative;
          width: 90vw;
          height: 70vh;
          border: 3px solid white;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.7);
        ">
    `;

    Object.entries(data_by_media).forEach(([media_path, trials]) => {
      const color = media_colors[media_path];
      trials.forEach((trial) => {
        if (trial.webgazer_data) {
          trial.webgazer_data.forEach((gaze: { x: number; y: number }) => {
            // Usa as coordenadas relativas já calculadas (x e y em %)
            html += `
              <div style="
                position: absolute;
                left: ${gaze.x}%;
                top: ${gaze.y}%;
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
        <p style="color: white; margin-top: 15px;">Cada cor representa os pontos de gaze de uma imagem diferente</p>
      </div>
    `;

    return html;
  },
  choices: ["Finalizar"],
});