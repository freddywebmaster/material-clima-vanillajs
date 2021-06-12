const container = document.querySelector(".container");
const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");

window.addEventListener("load", () => {
  formulario.addEventListener("submit", buscarClima);
});

const buscarClima = (e) => {
  e.preventDefault();
  const ciudad = document.querySelector("#last_name").value;
  const pais = document.querySelector("#pais").value;

  if (ciudad === "" || pais === "") {
    //error
    mostrarError("Ambos campos son necesarios...");
    return;
  } else {
    consultarApi(ciudad, pais);
  }
};

const mostrarError = (mensaje) => {
  const alerta = document.querySelector(".bg-red-100");
  if (!alerta) {
    const alerta = document.createElement("div");
    alerta.classList.add(
      "bg-red-100"
    );
    alerta.innerHTML = `
        <strong><b>Error.</b></strong>
        <span class="block">${mensaje}</span>
    `;
    container.appendChild(alerta);
    //ELIMINAR ALERTA
    setTimeout(() => {
      alerta.remove();
    }, 5000);
  }
};

const consultarApi = (ciudad, pais) => {
  const appId = "336b10f19f846866eefadb1084643f49";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;
  Spinner();
  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      limpiarHTML(); //LIMPIAR HTML
      if (datos.cod === "404") {
        mostrarError("Ciudad No encontrada");
      } else {
        mostrarClima(datos);
      }
    });
};

const mostrarClima = (datos) => {
  const {
    name,
    main: { temp, temp_max, temp_min },
  } = datos;

  //la temperatura viene en kelvins xd
  const centigrados = kelvinToCentigrados(temp);
  const min = kelvinToCentigrados(temp_min);
  const max = kelvinToCentigrados(temp_max);

  const nombreCiudad = document.createElement("p");
  nombreCiudad.textContent = `${name}`;
  nombreCiudad.classList.add("title-clima");

  const actual = document.createElement("p");
  actual.innerHTML = `${centigrados}&#8451;`;
  actual.classList.add("grados");

  const tempMax = document.createElement("p");
  tempMax.innerHTML = `<b class="tomato">Max:</b> ${max}&#8451;`;
  tempMax.classList.add("minmax");

  const tempMin = document.createElement("p");
  tempMin.innerHTML = `<b class="tomato">Min:</b> ${min}&#8451;`;
  tempMin.classList.add("minmax");

  const resultadoDiv = document.createElement("div");

  resultadoDiv.appendChild(nombreCiudad);
  resultadoDiv.appendChild(actual);
  resultadoDiv.appendChild(tempMax);
  resultadoDiv.appendChild(tempMin);

  resultado.appendChild(resultadoDiv);
};
const kelvinToCentigrados = (grados) => parseInt(grados - 273.15);

const limpiarHTML = () => {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
};

const Spinner = () => {
  limpiarHTML();
  const divSpinner = document.createElement("div");
  divSpinner.classList.add("spinner");
  divSpinner.innerHTML = `
  <div class="progress">
  <div class="indeterminate"></div>
  </div>
  `;
  resultado.appendChild(divSpinner);
};
