var DataFrame = dfjs.DataFrame;
var preprocessedDF

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
const loader = dropArea.querySelector("span");
//Secciones
const seccionPanel = document.getElementById("panel");
const seccionGraficas = document.getElementById("gráficas");
const seccionTablas = document.getElementById("tablas");
//Sliders
sliderGráfica = document.getElementById('sliderGráfica');
sliderTabla = document.getElementById('sliderTabla');
//Span Se llenan con el valor mínimo y máximo dinámicamente
var valueGráfica = document.getElementById('valueGráfica');
valueGráfica.textContent = sliderGráfica.min;
var valueTabla = document.getElementById('valueTabla');
valueTabla.textContent = sliderGráfica.min
var maxG = document.getElementById('maxG');
maxG.textContent = sliderGráfica.max;
var maxT = document.getElementById('maxT');
maxT.textContent = sliderTabla.max;

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
    
            // Espera 3 segundos antes de cambiar el mensaje
            setTimeout(() => {
                dragtext.textContent = "Archivo procesado";
                loader.classList.remove("loader-spinning");
            }, 3000);
    
            // Espera 4 segundos antes de procesar el archivo y resetear todo
            setTimeout(() => {
                processFile(inputFile.files[0]);
                resetDropArea();
            }, 4000);
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

sliderGráfica.addEventListener('change', function() {
    valueGráfica.textContent = sliderGráfica.value
    showPlots();
});

sliderTabla.addEventListener('change', function() {
    valueTabla.textContent = sliderTabla.value
    showTable();
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
        // Espera 3 segundos antes de cambiar el mensaje
        setTimeout(() => {
            dragtext.textContent = "Archivo procesado";
            loader.classList.remove("loader-spinning");
        }, 3000);

        // Espera 4 segundos antes de procesar el archivo y resetear todo
        setTimeout(() => {
            processFile(files[0]);
            resetDropArea();
        }, 4000);
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
    // Aplicamos el redondeo a cada columna de ventas por separado
    let ventasARounded = df.map(row => row.set("VentasA", parseFloat(row.get("VentasA").toFixed(2))));
    let ventasBRounded = ventasARounded.map(row => row.set("VentasB", parseFloat(row.get("VentasB").toFixed(2))));
    let ventasCRounded = ventasBRounded.map(row => row.set("VentasC", parseFloat(row.get("VentasC").toFixed(2))));
    let ventasDRounded = ventasCRounded.map(row => row.set("VentasD", parseFloat(row.get("VentasD").toFixed(2))));

    // Devolvemos el DataFrame con los valores redondeados
    return ventasDRounded;
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

function showPlots() {
    // Filtra el DataFrame por el año seleccionado
    selectedYearGraficas = sliderGráfica.value
    let filteredDF = preprocessedDF.filter(row => row.get('Year') >= selectedYearGraficas);

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
            name: `${column}`
        });
    });

    let layoutAnual = {
        title: 'Ventas en total',
        xaxis: { title: 'Año' },
        yaxis: { title: 'Ventas' }
    };

    let layoutAgrupado = {
        title: 'Ventas agrupadas por año',
        xaxis: { title: 'Año' },
        yaxis: { title: 'Ventas' }
    };

    let plotDivTotal = "ventasTotalesPlot";
    let plotDivAgrupada = "ventasAgrupadasPlot";

    Plotly.newPlot(plotDivTotal, annualTraces, layoutAnual);
    Plotly.newPlot(plotDivAgrupada, groupedTraces, layoutAgrupado);
}

function showTable() {
    // Filtra el DataFrame por el año seleccionado
    selectedYearTablas = sliderTabla.value
    let filteredDF = preprocessedDF.filter(row => row.get('Year') >= selectedYearTablas);

    // Obtiene el DataFrame agrupado por año
    var grouped = groupedDF(filteredDF);

    // Redondea los valores a dos decimales del dataframe agrupado
    var roundedDF = roundDigitsDF(grouped);

    // Redondea los valores a dos decimales del dataframe total
    var totalDF = roundDigitsDF(filteredDF)

    // Preparar datos para la tabla Plotly Total
    const dataTotal = [
        {
            type: 'table',
            header: {
                values: [["<b>Año</b>"], ["<b>Mes</b>"], ["<b>Ventas A</b>"], ["<b>Ventas B</b>"], ["<b>Ventas C</b>"], ["<b>Ventas D</b>"]],
                align: "center",
                line: {width: 2, color: 'black'},
                fill: {color: "#c03562"},
                font: {family: "Arial", size: 12, color: "white"}
            },
            cells: {
                values: totalDF.transpose().toArray(),
                align: "center",
                line: {color: "black", width: 2},
                fill: {color: ["#c03562", "#e5e5e5"]},
                font: {family: "Arial", size: 12, color: ["#e5e5e5", "black"]}
            }
        }
    ];

    // Preparar datos para la tabla Plotly agrupada
    const dataAgrupada = [
        {
            type: 'table',
            header: {
                values: [["<b>Año</b>"], ["<b>Ventas A</b>"], ["<b>Ventas B</b>"], ["<b>Ventas C</b>"], ["<b>Ventas D</b>"]],
                align: "center",
                line: {width: 2, color: 'black'},
                fill: {color: "#c03562"},
                font: {family: "Arial", size: 12, color: "white"}
            },
            cells: {
                values: roundedDF.transpose().toArray(),
                align: "center",
                line: {color: "black", width: 2},
                fill: {color: ["#c03562", "#e5e5e5"]},
                font: {family: "Arial", size: 12, color: ["#e5e5e5", "black"]}
            }
        }
    ];

    // Configuración del layout de las tablas
    const layoutTotal = {
        title: "Tabla de datos",
    };

    const layoutAgrupado = {
        title: "Tabla de datos agrupados",
    };

    // Selecciona el div donde se mostrará la tabla
    let tableDivTotal = 'myTableTotal';
    let tableDivAgrupada = 'myTableAgrupada';

    // Crea la tabla con Plotly
    Plotly.newPlot(tableDivTotal, dataTotal, layoutTotal);

    Plotly.newPlot(tableDivAgrupada, dataAgrupada, layoutAgrupado);    
}

