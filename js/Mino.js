/**
 *
 * @autor Arciel Navarro Hernández
 * 
 */

import Point from "./Point.js";

export default class Mino {
    #rotaciones
    #rotacionIndex
    #puntos
    #color

    constructor(rotaciones, color) {
        this.#rotaciones = rotaciones;
        this.#rotacionIndex = 0;
        this.#puntos = this.#rotaciones[this.#rotacionIndex];
        this.#color = color;
        this.#rotaciones.forEach(puntos => {
            puntos.forEach(punto => {
                punto.color = this.#color;
            });
        });
    }

    get puntos() {
        return this.#puntos;
    }

    get color() {
        return this.#color;
    }

    get rotaciones() {
        return this.#rotaciones;
    }

    set puntos(nuevosPuntos) {
        this.#puntos = nuevosPuntos;
    }

    set color(nuevoColor) {
        this.#color = nuevoColor;
    }

    rotacionPrevia() {
        const indiceAnterior = (this.#rotacionIndex - 1 + this.#rotaciones.length) % this.#rotaciones.length;
        return this.#rotaciones[indiceAnterior];
    }

    siguienteRotacion() {
        const siguienteIndice = (this.#rotacionIndex + 1) % this.#rotaciones.length;
        return this.#rotaciones[siguienteIndice];
    }

    incrementarIndiceRotacion() {
        if (this.#rotaciones.length > 0) {
            this.#rotacionIndex = (this.#rotacionIndex + 1) % this.#rotaciones.length;
        }
    }

    decrementarIndiceRotacion() {
        if (this.#rotaciones.length > 0) {
            this.#rotacionIndex = (this.#rotacionIndex - 1 + this.#rotaciones.length) % this.#rotaciones.length;
            this.#puntos = this.#rotaciones[this.#rotacionIndex];
        }
    }

    resetIndiceRotacion() {
        this.#rotacionIndex = 0;
        this.#puntos = this.#rotaciones[this.#rotacionIndex];
        this.incrementarIndiceRotacion();
    }    
}

export class Tetrimino_I extends Mino {
    constructor() {
        super([
            [new Point(0, 1), new Point(1, 1), new Point(2, 1), new Point(3, 1)],
            [new Point(2, 0), new Point(2, 1), new Point(2, 2), new Point(2, 3)],
            [new Point(0, 2), new Point(1, 2), new Point(2, 2), new Point(3, 2)],
            [new Point(1, 0), new Point(1, 1), new Point(1, 2), new Point(1, 3)],
        ], "#00DBFE");
    }
}

export class Tetrimino_O extends Mino {
    constructor() {
        super([
            [new Point(0, 0), new Point(1, 0), new Point(0, 1), new Point(1, 1)]
        ], "#EB00CF");
    }
}

export class Tetrimino_T extends Mino {
    constructor() {
        super([
            [new Point(0, 1), new Point(1, 0), new Point(1, 1), new Point(2, 1)],
            [new Point(1, 0), new Point(1, 1), new Point(1, 2), new Point(2, 1)],
            [new Point(0, 1), new Point(1, 1), new Point(2, 1), new Point(1, 2)],
            [new Point(0, 1), new Point(1, 0), new Point(1, 1), new Point(1, 2)],
        ], "#8300FF");
    }
}

export class Tetrimino_S extends Mino {
    constructor() {
        super([
            [new Point(0, 1), new Point(1, 1), new Point(1, 0), new Point(2, 0)],
            [new Point(1, 0), new Point(1, 1), new Point(2, 1), new Point(2, 2)],
            [new Point(1, 1), new Point(2, 1), new Point(0, 2), new Point(1, 2)],
            [new Point(0, 0), new Point(0, 1), new Point(1, 1), new Point(1, 2)],
        ], "#10EB00");
    }
}

export class Tetrimino_Z extends Mino {
    constructor() {
        super([
            [new Point(0, 0), new Point(1, 0), new Point(1, 1), new Point(2, 1)],
            [new Point(2, 0), new Point(2, 1), new Point(1, 1), new Point(1, 2)],
            [new Point(0, 1), new Point(1, 1), new Point(1, 2), new Point(2, 2)],
            [new Point(1, 0), new Point(1, 1), new Point(0, 1), new Point(0, 2)],
        ], "#E71313");
    }
}

export class Tetrimino_J extends Mino {
    constructor() {
        super([
            [new Point(0, 0), new Point(0, 1), new Point(1, 1), new Point(2, 1)],
            [new Point(1, 0), new Point(2, 0), new Point(1, 1), new Point(1, 2)],
            [new Point(0, 1), new Point(1, 1), new Point(2, 1), new Point(2, 2)],
            [new Point(0, 2), new Point(1, 0), new Point(1, 1), new Point(1, 2)],
        ], "#0000FF");
    }
}

export class Tetrimino_L extends Mino {
    constructor() {
        super([
            [new Point(0, 1), new Point(1, 1), new Point(2, 1), new Point(2, 0)],
            [new Point(1, 0), new Point(1, 1), new Point(1, 2), new Point(2, 2)],
            [new Point(0, 1), new Point(0, 2), new Point(1, 1), new Point(2, 1)],
            [new Point(0, 0), new Point(1, 0), new Point(1, 1), new Point(1, 2)],
        ], "#FF7B00");
    }
}

export class Pentomino_X extends Mino {
    constructor() {
        super([
            [new Point(1, 0), new Point(0, 1), new Point(1, 1), new Point(2, 1), new Point(1, 2)]
        ], "#C69725");
    }
}

export class Pentomino_U extends Mino {
    constructor() {
        super([
            [new Point(0, 0), new Point(2, 0), new Point(0, 1), new Point(1, 1), new Point(2, 1)],
            [new Point(1, 0), new Point(2, 0), new Point(1, 1), new Point(1, 2), new Point(2, 2)],
            [new Point(0, 1), new Point(1, 1), new Point(2, 1), new Point(0, 2), new Point(2, 2)],
            [new Point(0, 0), new Point(1, 0), new Point(1, 1), new Point(1, 2), new Point(0, 2)]
        ], "#AD2550");
    }
}

export class Pentomino_P extends Mino {
    constructor() {
        super([
            [new Point(0, 0), new Point(1, 0), new Point(0, 1), new Point(1, 1), new Point(0, 2)],
            [new Point(0, 0), new Point(1, 0), new Point(2, 0), new Point(1, 1), new Point(2, 1)],
            [new Point(2, 0), new Point(2, 1), new Point(1, 1), new Point(2, 2), new Point(1, 2)],
            [new Point(0, 1), new Point(1, 2), new Point(0, 2), new Point(1, 1), new Point(2, 2)]
        ], "#640590");
    }
}

export class Pentomino_Z extends Mino {
    constructor() {
        super([
            [new Point(0, 0), new Point(1, 0), new Point(1, 1), new Point(1, 2), new Point(2, 2)],
            [new Point(2, 0), new Point(2, 1), new Point(1, 1), new Point(0, 1), new Point(0, 2)],
        ], "#377A16")
    }
}

export class Pentomino_T extends Mino {
    constructor() {
        super([
            [new Point(0, 2), new Point(1, 1), new Point(1, 0), new Point(1, 2), new Point(2, 2)],
            [new Point(0, 0), new Point(0, 1), new Point(0, 2), new Point(1, 1), new Point(2, 1)],
            [new Point(0, 0), new Point(1, 0), new Point(2, 0), new Point(1, 1), new Point(1, 2)],
            [new Point(2, 1), new Point(0, 1), new Point(1, 1), new Point(2, 0), new Point(2, 2)]
        ], "#26FCAE");
    }
}

export class Pentomino_W extends Mino {
    constructor() {
        super([
            [new Point(0, 0), new Point(0, 1), new Point(1, 1), new Point(1, 2), new Point(2, 2)],
            [new Point(0, 1), new Point(0, 2), new Point(1, 0), new Point(1, 1), new Point(2, 0)],
            [new Point(0, 0), new Point(1, 0), new Point(1, 1), new Point(2, 2), new Point(2, 1)],
            [new Point(0, 2), new Point(1, 2), new Point(1, 1), new Point(2, 1), new Point(2, 0)],
        ], "#DEDB23");
    }
}

export class Pentomino_F extends Mino {
    constructor() {
        super([
            [new Point(1, 0), new Point(2, 0), new Point(0, 1), new Point(1, 1), new Point(1, 2)],
            [new Point(1, 0), new Point(0, 1), new Point(1, 1), new Point(2, 1), new Point(2, 2)],
            [new Point(0, 2), new Point(1, 0), new Point(1, 1), new Point(1, 2), new Point(2, 1)],
            [new Point(0, 0), new Point(0, 1), new Point(1, 1), new Point(2, 1), new Point(1, 2)]
        ], "#CA3610")
    }
}

export class Pentomino_V extends Mino {
    constructor() {
        super([
            [new Point(0, 0), new Point(0, 1), new Point(0, 2), new Point(1, 2), new Point(2, 2)],
            [new Point(0, 0), new Point(1, 0), new Point(2, 0), new Point(0, 1), new Point(0, 2)],
            [new Point(0, 0), new Point(1, 0), new Point(2, 0), new Point(2, 2), new Point(2, 1)],
            [new Point(2, 0), new Point(2, 1), new Point(2, 2), new Point(0, 2), new Point(1, 2)]
        ], "#A56BEE")
    }
}