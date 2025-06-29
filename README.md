# Projeto-Arduino-WebApi-FrontEnd-Bluetooh
Projeto final da disciplina de computação pervasiva e ubíqua. 

O projeto consiste do seguintes componentes:
1- Dispositivo Arduíno;
2- Web API Asp.net Rest;
3 - Front-End para interação com arduíno;

Através do botão "Ler dados Arduíno", uma requisição é feita para o endPoint /Arduino/ler. A API realiza a comunicação via bluetooh com o arduíno através da porta serial configurada. Os dados de leitura do arduíno são retornadas para a API que por sua vez retorna os dados como JSON para o FRONT-END, exibindo-os em tela para o usuário final.
