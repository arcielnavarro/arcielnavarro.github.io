var DataFrame = dfjs.DataFrame;
var preprocessedDF
var selectedYear = 2009;

//Confirmar exit
function confirmarSalida() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Quieres cerrar sesión y salir?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = '/index.html';
        }
    });
}

//Efecto de escritura.
var typed = new Typed(".input" ,{
    strings:["Desarrollador Frontend", "Desarrollador Web"],
    typeSpeed: 20,
    backSpeed: 200,
    loop: true
})

var typed2 = new Typed(".input2" ,{
    strings:["JavaScript", "CSS", "PHP", "Angular", "React"],
    typeSpeed: 20,
    backSpeed: 200,
    loop: true
})

//Efecto Hover al menú de navegación del header
document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll(".navbar a");

    navLinks.forEach(link => {
        link.addEventListener("mouseover", () => {
            link.classList.add("nav-hover-effect");
        });

        link.addEventListener("mouseout", () => {
            link.classList.remove("nav-hover-effect");
        });
    });
});

//Elementos del dragable
const dropArea = document.querySelector(".drop-area");
const dragtext = dropArea.querySelector("h2");
const icon = dropArea.querySelector("img");
const button = dropArea.querySelector('button');
const inputFile = dropArea.querySelector("#inputFile");
const loader = dropArea.querySelector("span")
//Secciones
const seccionPanel = document.getElementById("panel");
const seccionGraficas = document.getElementById("gráficas")
const seccionTablas = document.getElementById("tablas")
//Sliders
yearSliderGrafica = document.getElementById('yearSliderGrafica');

dropArea.addEventListener("mouseover", () => {
    dropArea.classList.add("drop-area-hover");
});

dropArea.addEventListener("mouseout", () => {
    dropArea.classList.remove("drop-area-hover");
});

dropArea.addEventListener("click", () => {
    // Activar animaciones al hacer clic
    dropArea.classList.add("active");
    dragtext.textContent = "Selecciona un archivo";
    button.hidden = true;
    loader.classList.remove("loader-hidden");
    icon.hidden = true;

    inputFile.click(); // Abrir el selector de archivos
    inputFile.addEventListener("change", () => {
        if (inputFile.files.length > 0) {
            // Muestra la animación inicial y el mensaje
            dropArea.classList.add("active");
            dragtext.textContent = "Archivo recibido";
            loader.classList.remove("loader-hidden");
            loader.classList.add("loader-spinning");
            icon.hidden = true;
    
            // Espera 5 segundos antes de cambiar el mensaje
            setTimeout(() => {
                dragtext.textContent = "Archivo procesado";
                loader.classList.remove("loader-spinning");
            }, 5000);
    
            // Espera 6 segundos antes de procesar el archivo y resetear todo
            setTimeout(() => {
                processFile(inputFile.files[0]);
                resetDropArea();
            }, 6000);
        }
    })
})

// Función para restaurar el estado original del dropArea
function resetDropArea() {
    dropArea.classList.remove("active");
    dragtext.textContent = "o arrastra un archivo";
    button.hidden = false;
    icon.hidden = false;
    loader.classList.add("loader-hidden");
    loader.style.animation = "none";
}

let dragCounter = 0;

dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation(); // Detiene la propagación del evento a elementos padres
    if (e.currentTarget === dropArea) {
        dropArea.classList.add("active");
        dragtext.textContent = "Suéltalo aquí";
        button.hidden = true;
        loader.classList.remove("loader-hidden");
        loader.classList.remove("loader-spinning");
        icon.hidden = true;
    }
});

dropArea.addEventListener("dragenter", (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    if (e.currentTarget === dropArea) {
        dragCounter++;
    }
});

dropArea.addEventListener("dragleave", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === dropArea) {
        dragCounter--;
        if (dragCounter === 0) {
            dropArea.classList.remove("active");
            dragtext.textContent = "o arrastra un archivo";
            button.hidden = false;
            icon.hidden = false;
            loader.classList.add("loader-hidden");
            loader.style.animation = "none";
        }
    }
});

dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter = 0; // Resetea el contador

    // Muestra la animación inicial y el mensaje
    dropArea.classList.add("active");
    dragtext.textContent = "Archivo recibido";
    button.hidden = true;
    loader.classList.remove("loader-hidden");
    loader.classList.add("loader-spinning");
    icon.hidden = true;

    const files = e.dataTransfer.files; // Obtiene los archivos que se han arrastrado
    if (files.length > 0) {
        // Espera 5 segundos antes de cambiar el mensaje
        setTimeout(() => {
            dragtext.textContent = "Archivo procesado";
            loader.classList.remove("loader-spinning");
        }, 5000);

        // Espera 6 segundos antes de procesar el archivo y resetear todo
        setTimeout(() => {
            processFile(files[0]);
            resetDropArea();
        }, 6000);
    }

});

// Función para procesar el archivo CSV arrastrado o seleccionado
function processFile(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
        const content = e.target.result;
        desocultarNavegación()
        
        AddEventsOnContainer();

        DataFrame.fromCSV(content).then(df => {
            preprocessedDF = preprocessDF(df);
            
            showPlots();
            showTable();
            
        }).catch(error => {
            console.error("Error al procesar el archivo:", error);
        });
    };
}

function preprocessDF(df) {
    // Conversión de columnas a números y rellenado de valores ausentes
    const columns = ['VentasA', 'VentasB', 'VentasC', 'VentasD'];
    columns.forEach(column => {
        df = df.cast(column, Number);
        const meanValue = df.stat.mean(column);
        df = df.map(row => row.set(column, isNaN(row.get(column)) ? meanValue : row.get(column)));
    });
    return df;
}

function AddEventsOnContainer() {
    // Selección de todos los elementos grid-item
    const gridItems = document.querySelectorAll('.grid-item');

    gridItems.forEach(item => {
        // Añadir evento hover (mouseover)
        item.addEventListener('mouseover', () => {
            item.classList.add('grid-item-hover');
        });

        // Quitar evento hover (mouseout)
        item.addEventListener('mouseout', () => {
            item.classList.remove('grid-item-hover');
        });

        // Añadir eventos de redirección o función según corresponda
        if (item.classList.contains('graf')) {
            item.addEventListener('click', () => window.location.href = '#gráficas');
        } else if (item.classList.contains('tab')) {
            item.addEventListener('click', () => window.location.href = '#tablas');
        } else if (item.classList.contains('about')) {
            item.addEventListener('click', () => window.location.href = '#información');
        } else if (item.classList.contains('exit')) {
            item.addEventListener('click', confirmarSalida);
        }
    });
}

function desocultarNavegación() {

    seccionPanel.style.display = "block";
    seccionGraficas.style.display = "block";
    seccionTablas.style.display = "block";
    
    const navLinks = document.querySelectorAll('.navbar a');

    navLinks.forEach(link => {
        if (link.textContent === 'Panel' || link.textContent === 'Gráficas' || link.textContent === 'Tablas') {
            link.hidden = false;
        }
    });
}

// Función para redondear los valores del DataFrame
function roundDigitsDF(df) {
    return df.map(row => row.map(value => typeof value === 'number' ? parseFloat(value.toFixed(2)) : value));
}

// Función para crear un DataFrame agrupado
function groupedDF(df) {
    const ventasA = df.groupBy("Year")
        .aggregate(group => group.stat.mean("VentasA"))
        .rename("aggregation", "VentasA");

    const ventasB = df.groupBy("Year")
        .aggregate(group => group.stat.mean("VentasB"))
        .rename("aggregation", "VentasB");

    const ventasC = df.groupBy("Year")
        .aggregate(group => group.stat.mean("VentasC"))
        .rename("aggregation", "VentasC");

    const ventasD = df.groupBy("Year")
        .aggregate(group => group.stat.mean("VentasD"))
        .rename("aggregation", "VentasD");

    return ventasA.join(ventasB , ["Year"])
                    .join(ventasC, ["Year"])
                    .join(ventasD, ["Year"])

}

// Objeto para mapear nombres de meses a números
const monthNamesToNumbers = {
    'Enero': 0,
    'Febrero': 1,
    'Marzo': 2,
    'Abril': 3,
    'Mayo': 4,
    'Junio': 5,
    'Julio': 6,
    'Agosto': 7,
    'Septiembre': 8,
    'Octubre': 9,
    'Noviembre': 10,
    'Diciembre': 11
};

// Función para obtener fechas desde el DataFrame
function getDateFromDF(df) {
    let yearMonthPairs = df.select('Year', 'Month').toArray();
    let dates = yearMonthPairs.map(row => {
        let year = row[0];
        let monthName = row[1];
        let monthNumber = monthNamesToNumbers[monthName];
        return new Date(year, monthNumber, 1);
    });

    return dates;
}

yearSliderGrafica.addEventListener('input', function() {
    selectedYear = parseInt(this.value);
    document.getElementById('yearValue').textContent = selectedYear;
    showPlots();
});

function showPlots() {
    // Filtra el DataFrame por el año seleccionado
    let filteredDF = preprocessedDF.filter(row => row.get('Year') >= selectedYear);

    // Obtenemos el array de fechas y el DataFrame agrupado
    let dates = getDateFromDF(filteredDF);
    let groupedDataFrame = groupedDF(filteredDF);

    // Trazas para los datos anuales
    let annualTraces = [];
    ['VentasA', 'VentasB', 'VentasC', 'VentasD'].forEach(column => {
        if (preprocessedDF.listColumns().includes(column)) {
            annualTraces.push({
                x: dates,
                y: filteredDF.select(column).toArray().flat(),
                type: 'scatter',
                name: column
            });
        }
    });

    // Trazas para los datos agrupados por año
    let groupedTraces = [];
    ['VentasA', 'VentasB', 'VentasC', 'VentasD'].forEach(column => {
        groupedTraces.push({
            x: groupedDataFrame.select('Year').toArray().flat(),
            y: groupedDataFrame.select(column).toArray().flat(),
            type: 'scatter',
            mode: 'lines+markers',
            name: `${column} (agr.)`
        });
    });

    // Layout para las gráficas
    let layout = {
        title: 'Ventas Anuales y Agrupadas por Año',
        xaxis: { title: 'Año' },
        yaxis: { title: 'Ventas' }
    };

    let plotDivTotal = "ventasTotalesPlot";
    let plotDivAgrupada = "ventasAgrupadasPlot";

    Plotly.newPlot(plotDivTotal, annualTraces, layout);
    Plotly.newPlot(plotDivAgrupada, groupedTraces, layout);
}

// function updateYearValue(df, value) {
//     // Actualiza el valor mostrado
//     document.getElementById('yearValue').textContent = value;

//     // Filtra el DataFrame por el año seleccionado
//     let filteredDF = df.filter(row => row.get('Year') === parseInt(value));
//     console.log(filteredDF)
//     // Ejecuta showPlots y showTable con el DataFrame filtrado
//     showPlots(filteredDF);
//     showTable(filteredDF);
// }

// // Añade un event listener al slider
// document.getElementById('yearSlider').addEventListener('change', function() {
//     if (preprocessedDF) {
//         updateYearValue(preprocessedDF, this.value);
//     }
// });

// // Función que se llama cuando se mueve el slider
// function sliderChanged(year) {
//     document.getElementById('yearDisplay').textContent = year;
//     const filteredDF = preprocessedDF.filter(row => row.get('Year') == year);
//     showPlots(filteredDF);
//     // showTable(filteredDF);
// }

function showTable(year) {
    // Filtra el DataFrame por el año seleccionado
    var filteredDF = preprocessedDF.filter(row => row.get('Year') == year);

    // Redondea los valores a dos decimales
    var roundedDF = roundDigitsDF(filteredDF);

    // Obtiene el DataFrame agrupado por año
    var grouped = groupedDF(roundedDF);

    // Preparar datos para la tabla Plotly
    const data = [
        {
            type: 'table',
            header: {
                values: [["<b>Año</b>"], ["<b>Ventas A</b>"], ["<b>Ventas B</b>"], ["<b>Ventas C</b>"], ["<b>Ventas D</b>"]],
                align: "center",
                line: {width: 1, color: 'black'},
                fill: {color: "grey"},
                font: {family: "Arial", size: 12, color: "white"}
            },
            cells: {
                values: roundedDF.transpose().toArray(),
                align: "center",
                line: {color: "black", width: 1},
                fill: {color: ["white", "lightgrey"]},
                font: {family: "Arial", size: 11, color: ["black"]}
            }
        }
    ];

    // Configuración del layout de la tabla
    const layout = {
        title: "Ventas por Año"
    };

    // Selecciona el div donde se mostrará la tabla
    let tableDivId = 'myTableDiv';

    // Crea la tabla con Plotly
    Plotly.newPlot(tableDivId, data, layout);
}

