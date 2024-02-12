/**
 *
 * @autor Arciel Navarro Hernández
 * 
 */

export default class Utilidades {
    static obtenerNumeroAleatorio = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    static barajar(arreglo) {
        for (let i = arreglo.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arreglo[i], arreglo[j]] = [arreglo[j], arreglo[i]]; // Intercambia elementos con el algoritmo de Fisher-Yates
        }
        return arreglo;
    }
}