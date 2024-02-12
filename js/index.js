
// let cubos_colores = document.getElementById("cubos_colores")

let titulo = document.getElementById("titulo")
// let cubos_transparentes_abajo = document.getElementById("cubos_transparentes_abajo")
// let cubos_transparentes_derecha = document.getElementById("cubos_transparentes_derecha")
// let cubos_transparentes_arriba = document.getElementById("cubos_transparentes_arriba")
// let cubos_transparentes_izquierda = document.getElementById("cubos_transparentes_izquierda")
// let cubos_colores_abajo = document.getElementById("cubos_colores_abajo")
// let cubos_colores_izquierda = document.getElementById("cubos_colores_izquierda")
// let cubos_colores_izquierda_arriba = document.getElementById("cubos_colores_izquierda_arriba")


window.addEventListener("scroll", (e) => {
    let value = window.scrollY;
    let alturaParallax = document.querySelector('.parallax').offsetHeight;
    let porcentajeScroll = Math.min(value / alturaParallax, 1);
    
    // Calcula la nueva posición del título basándose en el porcentaje de scroll
    let nuevaPosicionTitulo = 50 - (porcentajeScroll ** 0.5) * 45;

    titulo.style.top = `${nuevaPosicionTitulo}%`; // Actualiza la posición del título
    titulo.style.transform = `translate(-50%, -${nuevaPosicionTitulo}%)`;

    // //Mueve en diagonal hacia arriba y a la izquierda.
    // cubos_transparentes_izquierda.style.transform = `translateX(${value * -0.7}px) translateY(${value * -0.7}px)`;
    
    // //Mueve en diagonal hacia abajo y a la izquierda.
    // cubos_transparentes_abajo.style.transform = `translateX(${value * -0.3}px) translateY(${value * 0.5}px)`;

    // //Mueve en diagonal hacia la izquierda y hacia abajo mientras rota en sentido antihorario.
    // cubos_colores_abajo.style.transform = `translateX(${value * -0.5}px) translateY(${value * 1.5}px) rotate(${value * -0.09}deg)`;

    // //Mueve en diagonal hacia la izquierda y hacia abajo mientras rota en sentido horario.
    // cubos_colores_izquierda.style.transform = `translateX(${value * -1}px) translateY(${value * 2}px) rotate(${value * 0.09}deg)`; 

    // // Mueve en diagonal hacia abajo y a la derecha.
    // cubos_transparentes_derecha.style.transform = `translateX(${value * 0.7}px) translateY(${value * 0.7}px)`;

    // //Mueve en diagonal hacia arriba y a la derecha.
    // cubos_transparentes_arriba.style.transform = `translateX(${value * 0.3}px) translateY(${value * -0.3}px)`;

    // cubos_transparentes_abajo.style.opacity = 1 - porcentajeScroll * 20;
    // cubos_transparentes_derecha.style.opacity = 1 - porcentajeScroll * 10;
    // cubos_colores_izquierda.style.opacity = 1 - porcentajeScroll * 5;
    // cubos_transparentes_arriba.style.opacity = 1 - porcentajeScroll * 5;
    // cubos_transparentes_izquierda.style.opacity = 1 - porcentajeScroll * 2;
    // cubos_colores_abajo.style.opacity = 1 - porcentajeScroll * 2;

});