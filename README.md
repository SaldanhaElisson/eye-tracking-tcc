## Passo a Passo para Utilização da Aplicação
Siga estas etapas para configurar e utilizar a aplicação:

- [ ] Clone o Repositório: Obtenha o código-fonte da aplicação clonando o repositório do GitHub no seguinte link:
https://github.com/SaldanhaElisson/eye-tracking-tcc
```bash
git clone https://github.com/SaldanhaElisson/eye-tracking-tcc
cd eye-tracking-tcc
```
- [ ] Crie a Imagem Docker: Construa a imagem Docker da aplicação a partir do código clonado.

```
bash
docker build -t eye-tracking:1.0.0 .
```

- Inicie o Contêiner Docker: Execute um contêiner a partir da imagem Docker criada, publicando as portas necessárias.
```bash

docker run -p 5173:5173 eye-tracking:1.0.0
```
- [ ] Acesse a Interface Web: Abra seu navegador Google Chrome e navegue até a URL da aplicação:
http://localhost:5173/

- [ ] Selecione as Imagens: Na interface da aplicação, selecione as imagens que deseja utilizar para o processo.

- [ ] Realize a Calibração: Execute o procedimento de calibração conforme as instruções da aplicação.

- [ ] Conduza os Testes: Prossiga com os testes da aplicação para validar a funcionalidade.

- [ ] Acesse os Dados Gerados: Visualize e analise os dados resultantes, que estarão disponíveis em uma planilha Excel.

## Pré-requisitos
- Navegador Google Chrome
- Docker Instalado e Configurado
- Webcam Conectada 