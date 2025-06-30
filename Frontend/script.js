document.addEventListener("DOMContentLoaded", () => {
  const VOLTAGEM_MAXIMA = 150;
  let ultimaPosicao = null;

  const ctx = document.getElementById('grafico').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Voltagem (V)',
          data: [],
          borderColor: '#00e5ff',
          backgroundColor: 'transparent',
          tension: 0.3
        },
        {
          label: 'Posição (°)',
          data: [],
          borderColor: '#ffcc00',
          backgroundColor: 'transparent',
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          ticks: { color: '#fff' }
        },
        y: {
          ticks: { color: '#fff' },
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#fff'
          }
        }
      }
    }
  });

  function atualizarBarra(voltagem) {
    const eficiencia = Math.min(100, Math.round((voltagem / VOLTAGEM_MAXIMA) * 100));
    const barra = document.getElementById("barraInterna");
    barra.style.width = eficiencia + "%";
    barra.innerText = eficiencia + "%";
  }

  function atualizarGrafico(hora, voltagem, posicao) {
    const labels = chart.data.labels;
    const voltagemData = chart.data.datasets[0].data;
    const posicaoData = chart.data.datasets[1].data;

    labels.push(hora);
    voltagemData.push(voltagem);
    posicaoData.push(posicao);

    if (labels.length > 30) {
      labels.shift();
      voltagemData.shift();
      posicaoData.shift();
    }

    chart.update();
  }

  function lerArduino() {
    fetch('http://localhost:5129/Arduino/ler')
      .then(res => res.json())
      .then(data => {
        const erroDiv = document.getElementById("erro");
        erroDiv.innerText = "";

        if (data.erro === "Dados inválidos recebidos do Arduino.") {
          erroDiv.innerText = "❌ Dados inválidos recebidos do Arduino.";
          return;
        }

        const voltagem = Number(data.voltagem ?? data.Voltagem ?? 0);
        const posicao = Number(data.posicao ?? data.Posição ?? 0);

        document.getElementById("voltagem").innerText = `${voltagem}V`;
        document.getElementById("posicao").innerText = `${posicao}°`;

        atualizarBarra(voltagem);

        const horario = new Date().toLocaleTimeString();
        const novaLinha = `
          <tr>
            <td>${horario}</td>
            <td>${voltagem}</td>
            <td>${posicao}</td>
          </tr>
        `;
        const tabela = document.getElementById("historico");
        tabela.insertAdjacentHTML("afterbegin", novaLinha);
        while (tabela.rows.length > 30) tabela.deleteRow(tabela.rows.length - 1);

        atualizarGrafico(horario, voltagem, posicao);
      })
      .catch(err => {
        console.error(err);
        document.getElementById("erro").innerText = "❌ Erro ao tentar ler os dados do Arduino.";
      });
  }

  lerArduino();
  setInterval(lerArduino, 5000);
});
