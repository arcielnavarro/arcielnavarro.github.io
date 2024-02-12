/**
 *
 * @autor Arciel Navarro Hernández
 * 
 */

import Utilidades from "./Utilidades.js";
import Point from "./Point.js";
import * as Mino from "./Mino.js"

class Tablero {
    static MINOS_LENGTH = screen.height > 900 ? 32 : 24;
    static COLUMNAS = 10;
    static FILAS = 20;
    static CANVAS_ANCHO = this.MINOS_LENGTH * this.COLUMNAS;
    static CANVAS_ALTO = this.MINOS_LENGTH * this.FILAS;
    static COLOR_VACIO = "#3E3E3E";
    static COLOR_BORDE = "silver";
    static COLOR_FILA_ELIMINADA = "#3E3E3E";
	/*Tiempo de espera desde que una pieza toca el fondo u otra pieza hasta que se decide sacar una nueva pieza o no.
    Te permite acomodar la pieza cuando cae*/
    static TIEMPO_FUERA_PONER_NUEVA_FICHA = 300;
    static VELOCIDAD_INICIAL = 700;
    static FILA_ELIMINADA_ANIMACION = 500;

    constructor(canvasId) {
        this.canvasId = canvasId;
        this.tiempoFuera = false;
        this.tablero = [];
        this.piezasExistentes = [];
        this.globalX = 0;
        this.globalY = 0;
        this.pausado = true;
        this.estabaPausado = false;
        this.piezaActual = null;
        this.siguientePieza = null;
        this.piezaRetenida = null;
        this.piezaRetenidaEsteTurno = false;
        this.filasEliminadas = 0;
        this.puntuacion = 0;
        this.nivel = 1;
        this.velocidadMino = 0;
        this.distanciaDrop = 0;
        this.estaEnAnimacion = false;
        this.mensajesEnCola = [];
        this.ultimoNivelSubido = 0;
        this.esInicio = true;
        this.conteoEnProgreso = false;
        this.puedeJugar = false;
        this.intervalo = null;
        this.velocidadDrop = null;
        this.moverAbajoRapido = false;
        this.hardDropActivado = false;
        this.bolsaDePiezas = [];
        this.ultimoNivelPiezaAleatoria = 1;
        this.inicializar();
    }

    inicializar() {
        this.initElementosDOM();
        this.reiniciarJuego();
        this.dibujar();
        this.initControles();
    }

    reiniciarJuego() {
        this.initTableroYPiezasExistentes();
        this.llenarYBarajarBolsa();
        this.piezaRetenida = null;
        this.siguientePieza = null;
        this.esInicio = true;
        this.resetRetenerPiezaTurno();
        this.resetValores();
        this.actualizarVelocidad();
        this.elegirPiezaAleatoria();
        this.restablecerGlobalXGlobalY();
        this.sincroPiezasExistentesConTablero();
        this.pausarJuego();
    }

    resetValores() {
        this.filasEliminadas = 0;
        this.$filasHechas.textContent = this.filasEliminadas;
    
        this.puntuacion = 0; 
        this.$puntuacionActual.textContent = this.puntuacion;
    
        this.nivel = 1;
        this.$nivelActual.textContent = this.nivel;

        this.ultimoNivelSubido = 0;
        this.ultimoNivelPiezaAleatoria = 1;
    }
    
    mostrarControles() {
        this.estabaPausado = this.pausado;
        this.pausarJuego();
        Swal.fire({
            html: `
                <div class="custom-header">
                    <img src="../img/controles_tetriminos.png" alt="" width="150">
                </div>
                <div class="custom-body">
                    <strong style ="font-size: 30px; color: var(--oscuro)">Controles:</strong>
                    <ul class="list-group">
                        <li class="list-group-item"> <kbd>P</kbd><br>Pausar o reanudar</li>
                        <li class="list-group-item"> <kbd>&uarr;</kbd><br>Rotar la pieza en sentido horario</li>
                        <li class="list-group-item"> <kbd>&larr;</kbd> <kbd>&darr;</kbd> <kbd>&rarr;</kbd><br>Mover la pieza hacia esa dirección</li>
                        <li class="list-group-item"> <kbd>Z</kbd><br>Rotar la pieza en sentido antihorario</li>
                        <li class="list-group-item"> <kbd>C</kbd><br>Retener la pieza</li>
                        <li class="list-group-item"> <kbd>ESPACIO</kbd><br>Caída rápida</li>
                    </ul>
                    <br>
                    <strong style ="font-size: 24px; color: var(--oscuro)">¡Que disfrutes de <span style = "color: var(--claro)">Tetri</span>Minos!</strong>
                </div>
            `,
            showConfirmButton: true,
            confirmButtonColor: 'var(--oscuro)',
            confirmButtonText: 'Entendido',
            allowOutsideClick: false
        }).then((result) => {
            if(result.isConfirmed && !this.estabaPausado) {
                this.reanudarJuego();
            }
        });
    }

    initControles() {
        document.addEventListener("keydown", (e) => {
            const { code } = e;
            if (!this.puedeJugar && code !== "KeyP") {
                return;
            }
            switch (code) {
                case "ArrowRight":
                    this.intentarMoverDerecha();
                    break;
                case "ArrowLeft":
                    this.intentarMoverIzquierda();
                    break;
                case "ArrowDown":
                    this.iniciarMovimientoAbajo();
                    break;
                case "ArrowUp":
                    this.rotarPieza();
                    break;
                case "KeyC": 
                    this.intentarRetenerPieza();
                    break;
                case "Space":
                    this.hardDrop();
                    break;
                case "KeyP":
                    this.pausarOReanudarJuego();
                    break;
                case "KeyZ":
                    this.rotarPiezaAntihorario();
                    break;
            }
            this.sincroPiezasExistentesConTablero();
        });

        document.addEventListener("keyup", (e) => {
            if (e.code === "ArrowDown") {
                this.detenerMovimientoAbajo();
            }
        });

        document.addEventListener("keyup", (e) => {
            if (e.code === "Space") {
                this.hardDropActivado = false;
            }
        });

        [this.$btnPausa, this.$btnReanudar].forEach($btn => $btn.addEventListener("click", () => {
            this.pausarOReanudarJuego();
        }));
    }

    initElementosDOM() {
        this.$canvas = document.querySelector("#" + this.canvasId);
        this.$siguientePiezaCanvas = document.querySelector("#siguientePieza");
        this.$piezaRetenidaCanvas = document.querySelector("#piezaRetenida");
        this.$btnPausa = document.querySelector("#btnPausar");
        this.$btnReanudar = document.querySelector("#btnIniciar");
        this.$filasHechas = document.querySelector("#lineasHechas");
        this.$puntuacionActual = document.querySelector("#puntuacionActual");
        this.$nivelActual = document.querySelector("#nivelActual");
        this.$canvas.setAttribute("width", Tablero.CANVAS_ANCHO + "px");
        this.$canvas.setAttribute("height", Tablero.CANVAS_ALTO + "px");
        this.$siguientePiezaCanvas.setAttribute("width", Tablero.MINOS_LENGTH * 5 + "px");
        this.$siguientePiezaCanvas.setAttribute("height", Tablero.MINOS_LENGTH * 4 + "px");
        this.$piezaRetenidaCanvas.setAttribute("width", Tablero.MINOS_LENGTH * 5 + "px");
        this.$piezaRetenidaCanvas.setAttribute("height", Tablero.MINOS_LENGTH * 4 + "px");
        this.canvasContext = this.$canvas.getContext("2d");
        this.siguientePiezaContext = this.$siguientePiezaCanvas.getContext("2d");
        this.piezaRetenidaContext = this.$piezaRetenidaCanvas.getContext("2d");
    }

    intentarMoverDerecha() {
        if (this.puedeMoverseDerecha()) {
            this.globalX++;
        }
    }

    intentarMoverIzquierda() {
        if (this.puedeMoverseIzquierda()) {
            this.globalX--;
        }
    }

    iniciarMovimientoAbajo() {
        if (this.velocidadDrop) {
            return; // Si ya está en movimiento, no hacemos nada
        }
        this.moverAbajoRapido = true;
        this.velocidadDrop = setInterval(() => {
            if (this.puedeMoverseAbajo()) {
                this.globalY++;
                this.puntuacion += 1;
                this.actualizarPuntuacion();
                this.sincroPiezasExistentesConTablero();
            }
        }, 50); // Velocidad de movimiento hacia abajo
    }
    
    detenerMovimientoAbajo() {
        if (this.velocidadDrop) {
            clearInterval(this.velocidadDrop);
            this.velocidadDrop = null;
        }
        this.moverAbajoRapido = false;
    }

    intentarRetenerPieza() {
        if (this.piezaRetenidaEsteTurno) {
            return;
        }
        this.retenerPieza();

        this.piezaRetenidaEsteTurno = true;
        this.restablecerGlobalXGlobalY();
    }

    retenerPieza() {
        // Si no hay pieza retenida anteriormente
        if (!this.piezaRetenida) {
            this.piezaActual.resetIndiceRotacion();
            this.piezaRetenida = this.piezaActual;
            this.elegirPiezaAleatoria();
        } else {
            // Si ya hay una pieza retenida, intercambiamos la pieza actual con la pieza retenida
            [this.piezaActual, this.piezaRetenida] = [this.piezaRetenida, this.piezaActual];
            this.piezaRetenida.resetIndiceRotacion();
        }
    }

    resetRetenerPiezaTurno() {
        this.piezaRetenidaEsteTurno = false;
    }

    hardDrop() {
        if(!this.hardDropActivado){ //Evitar que el hardDrop se mantenga en la siguiente ficha.
            while (this.puedeMoverseAbajo()) {
                this.globalY++;
                this.distanciaDrop++;
            }
            this.puntuacion += this.distanciaDrop * 2; // 2x puntos por hardDrop
            this.distanciaDrop = 0;
            this.hardDropActivado = true;
            this.actualizarPuntuacion();
            this.procesarColision();
        }
    }

    pausarOReanudarJuego() {
        if (this.pausado) {
            // Si el juego estaba pausado y es el inicio del juego
            if (this.esInicio) {
                this.iniciarJuegoConConteo(this.reanudarJuego.bind(this)); 
                this.esInicio = false; 
            } else {
                this.iniciarJuegoConConteo(this.reanudarJuego.bind(this));
            }
        } else {
            this.pausarJuego();
        }
    }    

    pausarJuego() {
        this.pausado = true;
        this.puedeJugar = false;
        clearInterval(this.intervalo);

        // Cambia el color de todo el tablero
        this.tablero.forEach(fila => {
            fila.forEach(punto => {
                punto.color = Tablero.COLOR_VACIO;
            });
        });
        this.$btnReanudar.hidden = false;
        this.$btnPausa.hidden = true;
        const mensajeContainer = document.getElementById('mensaje-container');
        this.mostrarMensajePausa(mensajeContainer);
    }

    reanudarJuego() {
        clearInterval(this.intervalo); //Limpia el intervalo existente
        // Restaurar el estado previo del tablero.
        this.sincroPiezasExistentesConTablero();
        
        this.pausado = false;
        this.puedeJugar = true;
        this.esInicio = false;
        this.intervalo = setInterval(this.buclePrincipal.bind(this), this.velocidadMino);
        
         // Ocultar mensaje de pausa
        const mensajeContainer = document.getElementById('mensaje-container');
        mensajeContainer.style.display = 'none';
        mensajeContainer.textContent = '';
        this.$btnReanudar.hidden = true;
        this.$btnPausa.hidden = false;

    }

    moverPuntosPiezaAPiezasExistentes() {
        this.puedeJugar = false;
        for (const punto of this.piezaActual.puntos) {
            const x = punto.x + this.globalX;
            const y = punto.y + this.globalY;
            if (x >= 0 && x < Tablero.COLUMNAS && y >= 0 && y < Tablero.FILAS) {
                this.piezasExistentes[y][x] = {
                    tomado: true,
                    color: punto.color,
                };
            }
        }
        this.restablecerGlobalXGlobalY();
        this.puedeJugar = true;
    }    

    jugadorPierde() {
        for (const punto of this.piezasExistentes[0]) {
            if (punto.tomado) {
                return true;
            }
        }
        return false;
    }

    obtenerPuntosABorrar = () => {
        const puntos = [];
        let y = 0;
        for (const fila of this.piezasExistentes) {
            const esFilaLlena = fila.every(punto => punto.tomado);
            if (esFilaLlena) {
                // Solo necesitamos la coordenada Y
                puntos.push(y);
            }
            y++;
        }
        return puntos;
    }

    cambiarColorFilaEliminada(coordenadasY) {
        for (let y of coordenadasY) {
            for (const punto of this.piezasExistentes[y]) {
                punto.color = Tablero.COLOR_FILA_ELIMINADA;
            }
        }
    };

    quitarFilasDePiezasExistentes(coordenadasY) {
        for (let y of coordenadasY) {
            for (const punto of this.piezasExistentes[y]) {
                punto.color = Tablero.COLOR_VACIO;
                punto.tomado = false;
            }
        }
    }

    verificarYBorrarFilasLlenas() {
        const coordenadasY = this.obtenerPuntosABorrar();
        if (coordenadasY.length <= 0) {
            return;
        }
        
        this.estaEnAnimacion = true;
        this.cambiarColorFilaEliminada(coordenadasY);
        this.filasEliminadas += coordenadasY.length; 
        this.$filasHechas.textContent = this.filasEliminadas;
        this.verificarAumentoNivel();
        
        const mensajeContainer = document.getElementById('mensaje-container');
        this.mostrarMensajeDeFilasEliminadas(mensajeContainer, coordenadasY);
        
        setTimeout(() => {
            this.eliminarFilas(coordenadasY);
        }, Tablero.FILA_ELIMINADA_ANIMACION);
    }
    
    verificarAumentoNivel() {
        const nivelActual = Math.floor(this.filasEliminadas / 10);
        if (nivelActual > this.ultimoNivelSubido) {
            this.nivel++;
            this.$nivelActual.textContent = this.nivel;
            this.actualizarVelocidad();
            
            // Añadir la pieza especial al principio de la bolsa si es un nuevo nivel
            if (this.nivel > this.ultimoNivelPiezaAleatoria) {
                this.añadirPiezaEspecialAlPrincipio();
                this.ultimoNivelPiezaAleatoria = this.nivel;
            }
            
            const mensajeContainer = document.getElementById('mensaje-container');
            setTimeout(() => {
                this.mostrarMensajeLevelUp(mensajeContainer);
            }, 600);
    
            this.ultimoNivelSubido = nivelActual;
        }
    }         
    
    eliminarFilas(coordenadasY) {
        this.quitarFilasDePiezasExistentes(coordenadasY);
        this.sincroPiezasExistentesConTablero();
        this.moverPiezasExistentesHaciaAbajo(coordenadasY);
    
        this.estaEnAnimacion = false;
        this.sincroPiezasExistentesConTablero();
    }
    
    moverPiezasExistentesHaciaAbajo(coordenadasY) {
        const coordenadasInvertidas = Array.from(coordenadasY);
        coordenadasInvertidas.reverse();
    
        for (let coordenadaY of coordenadasInvertidas) {
            for (let y = Tablero.FILAS - 1; y >= 0; y--) {
                for (let x = 0; x < this.piezasExistentes[y].length; x++) {
                    if (y < coordenadaY) {
                        let contador = 0;
                        let auxiliarY = y;
                        while (this.esPuntoVacio(x, auxiliarY + 1) && !this.puntoAbsolutoFueraDeLimites(x, auxiliarY + 1) && contador < coordenadasY.length) {
                            this.piezasExistentes[auxiliarY + 1][x] = this.piezasExistentes[auxiliarY][x];
                            this.piezasExistentes[auxiliarY][x] = {
                                color: Tablero.COLOR_VACIO,
                                tomado: false,
                            }
    
                            this.sincroPiezasExistentesConTablero();
                            contador++;
                            auxiliarY++;
                        }
                    }
                }
            }
        }
    }
    
    mostrarMensajeDeFilasEliminadas(mensajeContainer, coordenadasY) {
        const puntuacionTotal = this.calcularPuntuacion(coordenadasY.length);
        let mensaje = '';
        switch (coordenadasY.length) {
            case 1:
                mensaje = `Simple: ${puntuacionTotal}`;
                break;
            case 2:
                mensaje = `Doble: ${puntuacionTotal}`;
                break;
            case 3:
                mensaje = `Triple: ${puntuacionTotal}`;
                break;
            case 4:
                mensaje = `Tetris: ${puntuacionTotal}`;
                break;
        }
        this.mensajesEnCola.push(mensaje);
        this.procesarMensajes(mensajeContainer);
    }

    mostrarMensajeLevelUp(mensajeContainer) {
        this.mensajesEnCola.push('¡Subes Nivel!');
        this.procesarMensajes(mensajeContainer);
    }

    mostrarMensajePausa(mensajeContainer) {
        if (this.pausado) {
            if (this.esInicio) {
                mensajeContainer.innerHTML = "Inicia con <img src='../img/teclaP.png' width = 40px>";
            } else {
                mensajeContainer.innerHTML = "En pausa <img src='../img/pausa.png' width = 45px>";
            }
            mensajeContainer.style.display = 'block';
        } else {
            mensajeContainer.style.display = 'none';
            mensajeContainer.innerHTML = '';
        }
    }
    
    iniciarJuegoConConteo(callback) {
        if (this.conteoEnProgreso) {
            return;  // Si el conteo ya está en progreso, no hagas nada.
        }    
        this.conteoEnProgreso = true;
        const mensajeContainer = document.getElementById('mensaje-container');
        const conteo = [
            "<h1 class = 'conteoRegresivo'>3</h1>", 
            "<h1 class = 'conteoRegresivo'>2</h1>", 
            "<h1 class = 'conteoRegresivo'>1</h1>", 
            "<h1 class = 'conteoRegresivo'>0</h1>"
        ];
    
        const mostrarConteo = () => {
            if (conteo.length > 0) {
                mensajeContainer.innerHTML = conteo.shift();
                setTimeout(mostrarConteo, 800);
            } else {
                mensajeContainer.style.display = 'none';
                this.conteoEnProgreso = false;
                callback();  // Llama al callback después del conteo
            }
        };
    
        mostrarConteo();
    }    

    procesarMensajes(mensajeContainer) {
        if (this.mensajesEnCola.length > 0) {
            mensajeContainer.textContent = this.mensajesEnCola.shift();
            mensajeContainer.style.display = 'block';
            setTimeout(() => {
                mensajeContainer.style.display = 'none';
                // Esto creará un bucle que procesará cada mensaje hasta que la cola esté vacía.
                this.procesarMensajes(mensajeContainer);
            }, 500);
        } else {
            // Si no hay más mensajes en la cola, nos aseguramos de que el mensaje esté oculto.
            mensajeContainer.style.display = 'none';
            mensajeContainer.innerHTML = '';
        }
    }

    buclePrincipal() {
        // Si el juego está pausado o en animación, no hacer nada
        if (!this.puedeJugar && !this.estaEnAnimacion) {
            return;
        }
        // Obtener el tiempo actual
        let tiempoActual = Date.now();
        // Si es la primera vez, establecer el último tiempo actual
        if (!this.ultimoTiempoActual) {
            this.ultimoTiempoActual = tiempoActual;
        }
        // Calcular cuánto tiempo ha pasado desde la última actualización
        let deltaTiempo = tiempoActual - this.ultimoTiempoActual;
        this.ultimoTiempoActual = tiempoActual;
        // Si la pieza puede moverse hacia abajo, hacerlo y resetear el tiempo de procesamiento de colisión
        if (this.puedeMoverseAbajo()) {
            this.globalY++;
            this.tiempoFuera = false;
            this.tiempoAntesDeProcesarColision = Tablero.TIEMPO_FUERA_PONER_NUEVA_FICHA;
        } else if (this.tiempoFuera) {
            // Si el tiempo de espera ha comenzado, reducir el tiempo restante
            this.tiempoAntesDeProcesarColision -= deltaTiempo;
    
            // Si el tiempo para procesar la colisión ha expirado, procesar la colisión
            if (this.tiempoAntesDeProcesarColision <= 0) {
                this.procesarColision();
                this.tiempoFuera = false;
            }
        } else {
            // Si la pieza ha llegado al fondo o a otra pieza, comenzar el tiempo de espera
            this.tiempoFuera = true;
            this.tiempoAntesDeProcesarColision = Tablero.TIEMPO_FUERA_PONER_NUEVA_FICHA;
        }
        // Sincronizar las piezas existentes con el tablero
        this.sincroPiezasExistentesConTablero();
    }       
    
    procesarColision() {
        this.moverPuntosPiezaAPiezasExistentes();
        if (this.jugadorPierde()) {
            this.gameOverAlerta();
            this.puedeJugar = false;
            this.reiniciarJuego();
            return;
        }
        this.verificarYBorrarFilasLlenas();
        this.elegirPiezaAleatoria();
        this.resetRetenerPiezaTurno();
    }    

    gameOverAlerta() {
        Swal.fire({
            html: `
                <div class="custom-header">
                    <img src="../img/game_over.png" alt="Imagen personalizada" width="300">
                </div>
                <div class="custom-body">
                    <strong style="font-size: 24px; color: #D80909">Puntuación: ${this.puntuacion}</strong><br>
                    <strong style="font-size: 24px; color: var(--oscuro)">El éxito está en la perseverancia. ¡No te rindas!</strong>
                </div>
            `,
            showConfirmButton: true,
            confirmButtonColor: "var(--oscuro)",
            allowOutsideClick: false
        });
    }

    sincroPiezasExistentesConTablero() {
        this.limpiarTableroYSuperponerPiezasExistentes();
        this.superponerPiezaActualEnTablero();
    }

    limpiarTableroYSuperponerPiezasExistentes() {
        for (let y = 0; y < Tablero.FILAS; y++) {
            for (let x = 0; x < Tablero.COLUMNAS; x++) {
                this.tablero[y][x] = {
                    color: Tablero.COLOR_VACIO,
                    tomado: false,
                };
                //Superponer la pieza existente, si la hay
                if (this.piezasExistentes[y][x].tomado) {
                    this.tablero[y][x].color = this.piezasExistentes[y][x].color;
                }
            }
        }
    }

    superponerPiezaActualEnTablero() {
        if (!this.piezaActual) 
			return;
        // Dibujar solo las partes de la pieza que están dentro de los límites del tablero
        for (const punto of this.piezaActual.puntos) {
            const yPos = punto.y + this.globalY;
            const xPos = punto.x + this.globalX;

            // Solo dibujar los puntos que están dentro del tablero
            if (yPos >= 0 && yPos < Tablero.FILAS && xPos >= 0 && xPos < Tablero.COLUMNAS) {
                this.tablero[yPos][xPos].color = punto.color;
            }
        }
    }

    dibujar() {
        this.dibujarTablero();
        this.dibujarMiniTableroSiguientePieza(this.siguientePiezaContext, Tablero.MINOS_LENGTH, this.siguientePieza);
        this.dibujarMiniTableroPiezaRetenida(this.piezaRetenidaContext, Tablero.MINOS_LENGTH, this.piezaRetenida);
        
        setTimeout(() => {
            requestAnimationFrame(this.dibujar.bind(this));
        }, 10);
    }

    dibujarTablero() {
        let x = 0, y = 0;
        for (const fila of this.tablero) {
            x = 0;
            for (const punto of fila) {
                if (this.pausado) {
                    this.canvasContext.fillStyle = Tablero.COLOR_VACIO;
                } else if (punto.color !== Tablero.COLOR_VACIO) {
                    this.dibujarCeldaConGradiente(this.canvasContext, x, y, punto.color, Tablero.MINOS_LENGTH);
                } else {
                    this.canvasContext.fillStyle = Tablero.COLOR_VACIO;
                }
                this.canvasContext.fillRect(x, y, Tablero.MINOS_LENGTH, Tablero.MINOS_LENGTH);
                x += Tablero.MINOS_LENGTH;
            }
            y += Tablero.MINOS_LENGTH;
        }
        if (!this.pausado) {
            this.dibujarFantasma();
        }
        // Dibuja los bordes después de dibujar las piezas fantasmas para que no se vean afectados por la transparencia
        x = 0;
        y = 0;
        for (const fila of this.tablero) {
            x = 0;
            for (const punto of fila) {
                this.canvasContext.strokeStyle = Tablero.COLOR_BORDE;
                this.canvasContext.strokeRect(x, y, Tablero.MINOS_LENGTH, Tablero.MINOS_LENGTH);
                x += Tablero.MINOS_LENGTH;
            }
            y += Tablero.MINOS_LENGTH;
        }
    }

    dibujarMiniTableroSiguientePieza(ctx, celdaSize, siguientePieza) {
        const filas = 4;  
        const columnas = 5;  
    
        // Limpia el canvas
        ctx.clearRect(0, 0, columnas * celdaSize, filas * celdaSize);
    
        // Dibuja el fondo y borde del mini tablero
        for (let y = 0; y < filas; y++) {
            for (let x = 0; x < columnas; x++) {
                ctx.fillStyle = Tablero.COLOR_VACIO;
                ctx.fillRect(x * celdaSize, y * celdaSize, celdaSize, celdaSize);
                
                ctx.strokeStyle = Tablero.COLOR_BORDE; 
                ctx.strokeRect(x * celdaSize, y * celdaSize, celdaSize, celdaSize);
            }
        }

        // Dibuja la próxima pieza
        this.dibujarSiguientePieza(ctx, siguientePieza, celdaSize);
    }
    

    dibujarSiguientePieza(ctx, piece, celdaSize) {
        if (!piece || this.pausado) return;
        
        const offsetX = 1;  // Desplazar una casilla a la derecha
        const offsetY = 1;  // Desplazar una casilla hacia abajo
        
        for (const punto of piece.puntos) {
            this.dibujarCeldaConGradiente(ctx, (punto.x + offsetX) * celdaSize, (punto.y + offsetY) * celdaSize, punto.color, celdaSize);
            
            ctx.strokeStyle = Tablero.COLOR_BORDE; 
            ctx.strokeRect((punto.x + offsetX) * celdaSize, (punto.y + offsetY) * celdaSize, celdaSize, celdaSize);
        }
    }        

    dibujarMiniTableroPiezaRetenida(ctx, celdaSize, piezaRetenida) {
        const filas = 4;
        const columnas = 5;
    
        // Limpia el canvas
        ctx.clearRect(0, 0, columnas * celdaSize, filas * celdaSize);
    
        // Dibuja el fondo y borde del mini tablero
        for (let y = 0; y < filas; y++) {
            for (let x = 0; x < columnas; x++) {
                ctx.fillStyle = Tablero.COLOR_VACIO;
                ctx.fillRect(x * celdaSize, y * celdaSize, celdaSize, celdaSize);
                
                ctx.strokeStyle = Tablero.COLOR_BORDE; 
                ctx.strokeRect(x * celdaSize, y * celdaSize, celdaSize, celdaSize);
            }
        }
    
        // Dibuja la pieza retenida
        this.dibujarPiezaRetenida(ctx, piezaRetenida, celdaSize);
    }

    dibujarPiezaRetenida(ctx, piece, celdaSize) {
        if (!piece || this.pausado) return;
        
        const offsetX = 1;  // Desplazar una casilla a la derecha
        const offsetY = 1;  // Desplazar una casilla hacia abajo
        
        for (const punto of piece.puntos) {
            this.dibujarCeldaConGradiente(ctx, (punto.x + offsetX) * celdaSize, (punto.y + offsetY) * celdaSize, punto.color, celdaSize);
            
            ctx.strokeStyle = Tablero.COLOR_BORDE; 
            ctx.strokeRect((punto.x + offsetX) * celdaSize, (punto.y + offsetY) * celdaSize, celdaSize, celdaSize);
        }
    }

    dibujarCeldaConGradiente(ctx, x, y, color, celdaSize) {
        let offsetX = x + 0.25 * celdaSize;
        let offsetY = y + 0.25 * celdaSize;
        let gradient = ctx.createRadialGradient(offsetX, offsetY, 0, offsetX, offsetY, celdaSize);
        gradient.addColorStop(0, '#FFF');
        gradient.addColorStop(0.15, color);
        gradient.addColorStop(1, color);
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, celdaSize, celdaSize);
    }

    dibujarSimboloInterrogacion(x, y) {
        this.canvasContext.fillStyle = "black";
        this.canvasContext.font = `${Tablero.MINOS_LENGTH * 0.7}px Arial`;
        this.canvasContext.textAlign = "center";
        this.canvasContext.textBaseline = "middle";
        const centerX = x + Tablero.MINOS_LENGTH / 2;
        const centerY = y + Tablero.MINOS_LENGTH / 2;
        this.canvasContext.fillText("?", centerX, centerY);
    }

    elegirPiezaAleatoria() {
        if (!this.siguientePieza) {
            // Si no hay una siguientePieza (como en el inicio del juego), genera una.
            this.siguientePieza = this.obtenerPiezaAleatoria();
        }
        this.piezaActual = this.siguientePieza; // La siguiente pieza se convierte en la actual
        this.siguientePieza = this.obtenerPiezaAleatoria(); // Y generamos una nueva siguiente pieza
        this.restablecerGlobalXGlobalY();
    }

    restablecerGlobalXGlobalY() {
        this.globalX = Math.floor(Tablero.COLUMNAS / 2) - 1;
        this.globalY = -1;
    }

    llenarYBarajarBolsa() {
        this.bolsaDePiezas = [
            new Mino.Tetrimino_I(), 
            new Mino.Tetrimino_O(),
            new Mino.Tetrimino_T(),
            new Mino.Tetrimino_S(),
            new Mino.Tetrimino_Z(),
            new Mino.Tetrimino_J(),
            new Mino.Tetrimino_L(),
        ];
        Utilidades.barajar(this.bolsaDePiezas);
    }

    crearPiezaEspecial_Random() {
        const piezas = [Mino.Pentomino_X, Mino.Pentomino_U, Mino.Pentomino_P, Mino.Pentomino_Z, Mino.Pentomino_T, Mino.Pentomino_W, Mino.Pentomino_F, Mino.Pentomino_V];
        const seleccion = Utilidades.obtenerNumeroAleatorio(0, piezas.length - 1);
        return new piezas[seleccion]();
    }

    // Método para añadir una pieza especial al principio de la bolsa
    añadirPiezaEspecialAlPrincipio() {
        const piezaEspecial = this.crearPiezaEspecial_Random();
        this.bolsaDePiezas.unshift(piezaEspecial);
    }

    obtenerPiezaAleatoria() {
        if (this.bolsaDePiezas.length === 0) {
            this.llenarYBarajarBolsa();
        }
        return this.bolsaDePiezas.shift();
    }

    initTableroYPiezasExistentes() {
        this.tablero = [];
        this.piezasExistentes = [];
        for (let y = 0; y < Tablero.FILAS; y++) {
            this.tablero.push([]);
            this.piezasExistentes.push([]);
            for (let x = 0; x < Tablero.COLUMNAS; x++) {
                this.tablero[y].push({
                    color: Tablero.COLOR_VACIO,
                    tomado: false,
                });
                this.piezasExistentes[y].push({
                    tomado: false,
                    color: Tablero.COLOR_VACIO,
                });
            }
        }
    }

    puntoRelativoFueraDeLimites(punto) {
        const absolutoX = punto.x + this.globalX;
        const absolutoY = punto.y + this.globalY;
        return this.puntoAbsolutoFueraDeLimites(absolutoX, absolutoY);
    }

    puntoAbsolutoFueraDeLimites(absolutoX, absolutoY) {
        return absolutoX < 0 || absolutoX > Tablero.COLUMNAS - 1 || absolutoY < 0 || absolutoY > Tablero.FILAS - 1;
    }

    //Devuelve true incluso si el punto no es válido (por ejemplo, si está fuera de los límites, ya que no es responsabilidad de la función)
    esPuntoVacio(x, y) {
        if (!this.piezasExistentes[y]) 
			return true;
        if (!this.piezasExistentes[y][x]) 
			return true;
        if (this.piezasExistentes[y][x].tomado) {
            return false;
        } else {
            return true;
        }
    }

    esPuntoValido(punto, puntos) {
        const puntoVacio = this.esPuntoVacio(this.globalX + punto.x, this.globalY + punto.y);
        const tieneMismaCoordenada = puntos.findIndex(p => {
            return p.x === punto.x && p.y === punto.y;
        }) !== -1;
        const fueraDeLimites = this.puntoRelativoFueraDeLimites(punto);
        if ((puntoVacio || tieneMismaCoordenada) && !fueraDeLimites) {
            return true;
        } else {
            return false;
        }
    }

    esPuntoValidoParaRotar(punto) {
        const absolutoX = punto.x + this.globalX;
        const absolutoY = punto.y + this.globalY;
        
        // Verifica si el punto está fuera de límites
        if (this.puntoAbsolutoFueraDeLimites(absolutoX, absolutoY)) {
            return false;
        }
    
        // Verifica si el punto está ocupado por otra pieza
        return !this.piezasExistentes[absolutoY][absolutoX].tomado;
    }

    puedeMoverseDerecha() {
        if (!this.piezaActual) 
			return false;
        for (const punto of this.piezaActual.puntos) {
            const nuevoPunto = new Point(punto.x + 1, punto.y);
            if (!this.esPuntoValido(nuevoPunto, this.piezaActual.puntos)) {
                return false;
            }
        }
        return true;
    }

    puedeMoverseIzquierda() {
        if (!this.piezaActual) return false;
        for (const punto of this.piezaActual.puntos) {
            const nuevoPunto = new Point(punto.x - 1, punto.y);
            if (!this.esPuntoValido(nuevoPunto, this.piezaActual.puntos)) {
                return false;
            }
        }
        return true;
    }

    puedeMoverseAbajo() {
        if (!this.piezaActual) return false;
        for (const punto of this.piezaActual.puntos) {
            const nuevoPunto = new Point(punto.x, punto.y + 1);
            if (!this.esPuntoValido(nuevoPunto, this.piezaActual.puntos)) {
                return false;
            }
        }
        return true;
    }

    // Método para rotar la pieza en sentido horario
    rotarPieza() {
        let nuevaRotacion = this.piezaActual.siguienteRotacion();
        this.aplicarRotacionSiEsPosible(nuevaRotacion, 'horario');
    }

    // Método para rotar la pieza en sentido antihorario
    rotarPiezaAntihorario() {
        let nuevaRotacion = this.piezaActual.rotacionPrevia();
        this.aplicarRotacionSiEsPosible(nuevaRotacion, 'antihorario');
    }

    // Método común para aplicar la rotación si es posible
    aplicarRotacionSiEsPosible(nuevaRotacion, sentido) {
        // Primero, intentar rotar sin mover la pieza
        if (this.piezaPuedeRotar(nuevaRotacion)) {
            this.actualizarRotacionPieza(nuevaRotacion, sentido);
            return;
        }
    
        // Intentos de ajuste para la rotación Algoritmo "Wall Kick"
        const ajustes = [
            { x: -1, y: 0 }, // Intentar mover a la izquierda
            { x: 1, y: 0 },  // Intentar mover a la derecha
            { x: 0, y: -1 }, // Intentar mover hacia arriba
            { x: 0, y: 1 }   // Intentar mover hacia abajo
        ];

        // Si es Tetrimino_I, añadir ajustes adicionales
        if (this.piezaActual instanceof Tetrimino_I) {
            ajustes.push({ x: -2, y: 0 }); // Intentar mover 2 casillas a la izquierda
            ajustes.push({ x: 2, y: 0 }); // Intentar mover 2 casillas a la derecha
            ajustes.push({ x: 0, y: -2 }); // Intentar mover 2 casillas hacia arriba
            ajustes.push({ x: 0, y: 2 }); // Intentar mover 2 casillas hacia abajo
        }
    
        for (const ajuste of ajustes) {
            this.globalX += ajuste.x;
            this.globalY += ajuste.y;
    
            if (this.piezaPuedeRotar(nuevaRotacion)) {
                this.actualizarRotacionPieza(nuevaRotacion, sentido);
                return;
            }
    
            // Deshacer el ajuste si la rotación aún no es posible
            this.globalX -= ajuste.x;
            this.globalY -= ajuste.y;
        }
    }

    // Método para verificar si la rotación es posible
    piezaPuedeRotar(nuevaRotacion) {
        for (const puntoRotado of nuevaRotacion) {
            if (!this.esPuntoValidoParaRotar(puntoRotado)) {
                return false;
            }
        }
        return true;
    }

    // Método auxiliar para actualizar la rotación de la pieza
    actualizarRotacionPieza(nuevaRotacion, sentido) {
        this.piezaActual.puntos = nuevaRotacion;
        if (sentido === 'horario') {
            this.piezaActual.incrementarIndiceRotacion();
        } else {
            this.piezaActual.decrementarIndiceRotacion();
        }
    }

    calcularPosicionFantasma() {
        let fantasma = this.globalY;
        while (this.puedeMoverseAbajoFantasma(fantasma)) {
            fantasma++;
        }
        return fantasma;
    }
    
    puedeMoverseAbajoFantasma(fantasma) {
        for (const punto of this.piezaActual.puntos) {
            const x = punto.x + this.globalX;
            const y = punto.y + fantasma;
            if (y + 1 === Tablero.FILAS || this.piezasExistentes[y + 1][x].tomado) {
                return false;
            }
        }
        return true;
    }

    dibujarFantasma() {
        const fantasma = this.calcularPosicionFantasma();
    
        this.canvasContext.save();
        const rgbaColor = this.hexToRgba(this.piezaActual.color, 0.35);
        
        for (const punto of this.piezaActual.puntos) {
            const x = (punto.x + this.globalX) * Tablero.MINOS_LENGTH;
            const y = (punto.y + fantasma) * Tablero.MINOS_LENGTH;
            this.dibujarCeldaConGradienteRgba(this.canvasContext, x, y, rgbaColor, Tablero.MINOS_LENGTH);
        }
        this.canvasContext.restore();
    }
    
    dibujarCeldaConGradienteRgba(ctx, x, y, rgbaColor, celdaSize) {
        let offsetX = x + 0.25 * celdaSize;
        let offsetY = y + 0.25 * celdaSize;
        let gradient = ctx.createRadialGradient(offsetX, offsetY, 0, offsetX, offsetY, celdaSize);
        gradient.addColorStop(0, `rgba(255, 255, 255, 0.5)`);
        gradient.addColorStop(0.15, rgbaColor);
        gradient.addColorStop(1, rgbaColor);
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, celdaSize, celdaSize);
    }

    // Método para convertir color hexadecimal a rgba
    hexToRgba(hex, alpha) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    actualizarVelocidad() {
        this.velocidadMino = Tablero.VELOCIDAD_INICIAL - ((this.nivel - 1) * 50);
        if (this.intervalo) {
            clearInterval(this.intervalo);
            this.intervalo = setInterval(this.buclePrincipal.bind(this), this.velocidadMino);
        }
    }

    calcularPuntuacion(filasEliminadas) {
        let puntuacionPorFilas = 0;
    
        switch (filasEliminadas) {
            case 1:
                puntuacionPorFilas = 200;
                break;
            case 2:
                puntuacionPorFilas = 300;
                break;
            case 3:
                puntuacionPorFilas = 500;
                break;
            case 4:
                puntuacionPorFilas = 800;
                break;
            default:
                break;
        }

        // Calculamos el factor de incremento del bonus por nivel del 5% empezando por lvl 2
        const nivelAjustado = Math.max(this.nivel - 1, 0); // Aseguramos que nunca sea negativo
        const factorNivel = 1 + (nivelAjustado * 0.05);

        // Multiplicamos la puntuación por el factor de nivel
        const puntuacionTotal = Math.round(puntuacionPorFilas * factorNivel);
        this.puntuacion += puntuacionTotal;

        this.actualizarPuntuacion();

        return puntuacionTotal;
    }
    
    actualizarPuntuacion() {
        this.$puntuacionActual.textContent = this.puntuacion;
    }
    
    async confirmarReinicioDelJuego() {
        this.estabaPausado = this.pausado;
        this.pausarJuego();
        const resultado = await Swal.fire({
            title: '',
            html: `
                <div class="custom-header">
                    <img src="../img/reset.png" alt="Imagen personalizada" width="150">
                </div>
                <div class="custom-body">
                    <h2><strong style="color: var(--oscuro); font-size: 30px">Reiniciar</strong></h2>
                    <p style="color: var(--oscuro); font-size: 24px"><b>¿Quieres reiniciar el juego?</b></p>
                </div>
            `,
            showCancelButton: true,
            confirmButtonColor: '#15C101',
            cancelButtonColor: '#D80909',
            cancelButtonText: 'No',
            confirmButtonText: 'Sí',
            focusCancel: true,
            allowOutsideClick: false
        });  

        if (resultado.value) {
            this.reiniciarJuego();
        } else if(!this.estabaPausado){
            this.reanudarJuego();
        }
    }
}

document.querySelector("#reset").addEventListener("click", () => {
    game.confirmarReinicioDelJuego();
});

document.querySelector("#controles").addEventListener("click", () => {
    game.mostrarControles();
});

document.getElementById("reset").addEventListener("keydown", function(event) {
    // Verifica si la tecla presionada es la barra espaciadora
    if (event.code === "Space") {
        // Evita el comportamiento predeterminado
        event.preventDefault();
    }
});

document.getElementById("controles").addEventListener("keydown", function(event) {
    // Verifica si la tecla presionada es la barra espaciadora
    if (event.code === "Space") {
        // Evita el comportamiento predeterminado
        event.preventDefault();
    }
});

const game = new Tablero("canvas");