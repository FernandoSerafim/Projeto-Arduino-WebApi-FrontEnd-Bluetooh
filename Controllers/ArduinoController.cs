using Microsoft.AspNetCore.Mvc;
using System.IO.Ports;

namespace APILeituraArduino.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ArduinoController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<ArduinoController> _logger;

        public ArduinoController(ILogger<ArduinoController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetWeatherForecast")]
        public IEnumerable<WeatherForecast> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }


        [HttpGet("ler")]
        public IActionResult LerDadosArduino()
        {
            try
            {
                string portName = "COM14";
                int baudRate = 9600;

                using var serialPort = new SerialPort(portName, baudRate);
                serialPort.ReadTimeout = 3000;
                serialPort.Open();

                string dados = serialPort.ReadLine();

                return Ok(new { valores = dados });
            }

            catch (Exception ex)
            {
                return BadRequest(new { erro = ex.Message });
            }
        }
    }
}
