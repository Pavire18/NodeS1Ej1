const fs = require("fs");
const prompt = require("prompt-sync")();

const convertJsonToCsv = (jsonData) => {
  let csv = "";

  // Encabezados
  csv = csv + "Nombre;Nota media; \n";

  // Datos

  // Recorremos cada fila
  const notasMapa = new Map();
  const asignaturas = [];
  jsonData.forEach((item) => {
    if (notasMapa.has(item.name)) {
      notasMapa.set(item.name, notasMapa.get(item.name) + item.mark);
    } else {
      notasMapa.set(item.name, item.mark);
    }
    if (!asignaturas.includes(item.test)) {
      asignaturas.push(item.test);
    }
  });
  ordenarMapPorValor(notasMapa).forEach(function (valor, clave) {
    csv = csv + clave + ";" + (valor / asignaturas.length) + ";";
    csv = csv + "\n";
  });

  console.log(notasMapa);

  return csv;
};

const filePath = prompt("Introduce la ruta de un fichero JSON: ");

fs.readFile(filePath, (readError, data) => {
  if (readError) {
    console.log("Ha ocurrido un error leyendo el fichero");
  } else {
    try {
      const parsedData = JSON.parse(data);
      const csv = convertJsonToCsv(parsedData);

      const filePathOutput = prompt("Introduce la ruta del fichero a generar: ");
      fs.writeFile(filePathOutput, csv, (error) => {
        if (error) {
          console.log("Ha ocurrido un error escribiendo el fichero");
        } else {
          console.log("Fichero guardado correctamente!");
        }
      });
    } catch (parseError) {
      console.log("Ha ocurrido un error PARSEANDO el fichero");
    }
  }
});

function ordenarMapPorValor(map) {
  const entradas = [...map.entries()];
  entradas.sort((a, b) => b[1] - a[1]);
  const mapaOrdenado = new Map(entradas);
  return mapaOrdenado;
}
