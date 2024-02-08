// Definición de usuarios registrados en formato JSON
const jsonRegistrados = `[
    {
        "nombre": "juan",
        "apellidos": "garcía",
        "edad": 23,
        "sexo": "Masculino",
        "email": "juan.garcia@gmail.com",
        "contraseña": "abcde"
    },  
    {
        "nombre": "lucia",
        "apellidos": "martinez",
        "edad": 25,
        "sexo": "Femenino",
        "email": "lucia.martinez@gmail.com",
        "contraseña":"1234"
    },
    {
        "nombre": "Arciel",
        "apellidos": "Navarro",
        "edad": 25,
        "sexo": "Masculino",
        "email": "arciel@gmail.com",
        "contraseña":"0000"
    }
]`;

// Parseo de la cadena JSON a un array de objetos de usuarios
const registrados = JSON.parse(jsonRegistrados);

// Definición de la clase Registrado para representar a un usuario
class Registrado {

    #nombre;
    #apellidos;
    #edad;
    #sexo;
    #email;
    #contraseña;

    constructor(nombre, apellidos, edad, sexo, email, contraseña) {
        this.#nombre = nombre;
        this.#apellidos = apellidos;
        this.#edad = edad;
        this.#sexo = sexo;
        this.#email = email;
        this.#contraseña = contraseña;
    }

    // Getters
    get nombre() {
        return this.#nombre;
    }

    get apellidos() {
        return this.#apellidos;
    }

    get edad() {
        return this.#edad;
    }

    get sexo() {
        return this.#sexo;
    }

    get email() {
        return this.#email;
    }

    get contraseña() {
        return this.#contraseña;
    }

    // Setters
    set nombre(nuevoNombre) {
        this.#nombre = nuevoNombre;
    }

    set apellidos(nuevosApellidos) {
        this.#apellidos = nuevosApellidos;
    }

    set edad(nuevaEdad) {
        this.#edad = nuevaEdad;
    }

    set sexo(nuevoSexo) {
        this.#sexo = nuevoSexo;
    }

    set email(nuevoEmail) {
        this.#email = nuevoEmail;
    }

    set contraseña(nuevaContraseña) {
        this.#contraseña = nuevaContraseña;
    }

}

// Creación de una colección de objetos 'Registrado' a partir del array de usuarios registrados
const coleccion_registrados = registrados.map(usuario => new Registrado(
    usuario.nombre,
    usuario.apellidos,
    usuario.edad,
    usuario.sexo,
    usuario.email,
    usuario.contraseña
));

// Función para filtrar usuarios de la colección según los valores del formulario
const filter_user_from_collection = () => {
    const filtroNombre = document.getElementById('nombre').value.trim().toLowerCase();
    const filtroApellidos = document.getElementById('apellidos').value.trim().toLowerCase();
    const filtroEdad = document.getElementById('edad').value.trim();
    const filtroSexo = document.getElementById('sexo').value.toLowerCase();
    const filtroEmail = document.getElementById('email').value.trim().toLowerCase();
    const filtroContraseña = document.getElementById('contraseña').value;

    return coleccion_registrados.filter(registrado => 
        (filtroNombre ? registrado.nombre.toLowerCase() === filtroNombre : true) &&
        (filtroApellidos ? registrado.apellidos.toLowerCase() === filtroApellidos : true) &&
        (filtroEdad ? registrado.edad == filtroEdad : true) &&  // == para conversión de tipo
        (filtroSexo ? registrado.sexo.toLowerCase() === filtroSexo : true) &&
        (filtroEmail ? registrado.email.toLowerCase() === filtroEmail : true) &&
        (filtroContraseña ? registrado.contraseña === filtroContraseña : true)
    );
};

// Función para comprobar si los campos del formulario están rellenos
const comprobarCamposRellenos = function() {
    const campos = ['nombre', 'apellidos', 'edad', 'sexo', 'email', 'contraseña'];
    let todosLosCamposRellenos = true;
    for (const campo of campos) {
        const elemento = document.getElementById(campo);
        const valor = elemento.value;

        if (!valor) {
            var errorcase = document.getElementById('errorcase');
            errorcase.textContent = `El campo ${campo} no puede estar vacío`;
            // Aplicar animación al input y verificar si existen el label y la línea
            elemento.classList.add('campo-error');
            const formGroup = elemento.closest('.form_group');
            const label = formGroup.querySelector('.form_label');
            const line = formGroup.querySelector('.form_line');

            if (label) {
                label.classList.add('campo-error-label');
            }
            if (line) {
                line.classList.add('campo-error-linea');
            }

            // Remover la animación después de que termine
            setTimeout(() => {
                elemento.classList.remove('campo-error');
                if (label) {
                    label.classList.remove('campo-error-label');
                }
                if (line) {
                    line.classList.remove('campo-error-linea');
                }
            }, 1000);

            setTimeout(()=>{
                errorcase.textContent = "";
            }, 1500);

            elemento.focus();
            todosLosCamposRellenos = false;
            break; // Detiene la verificación en el primer campo vacío
        }
    }
    return todosLosCamposRellenos;
};

// Función para borrar los campos del formulario 
const borrarCampos = function() {
    const campos = ['nombre', 'apellidos', 'edad', 'sexo', 'email', 'contraseña'];
    campos.forEach(campoId => {
        const elemento = document.getElementById(campoId);
        elemento.value = '';

        // Eliminar la clase 'option-selected' si es un select
        if (campoId === 'sexo') {
            elemento.classList.remove('option-selected');
        }
        // Restablecer a tipo contraseña
        if (campoId === 'contraseña') {
            elemento.type = 'password';
        }
    });
    // Desmarcar el checkbox de mostrar contraseña
    document.getElementById('togglePassword').checked = false;

};

// Función principal de validación
const validar = function() {
    if (comprobarCamposRellenos()) {
        const usuariosFiltrados = filter_user_from_collection();
        if (usuariosFiltrados.length === 0) {
            usuarioNoRegistrado();
        } else {
            usuarioRegistrado();
        }
    }
};

function usuarioNoRegistrado() {
    return Swal.fire({
        title: '¡Error!',
        text: 'Usuario no registrado',
        icon: 'error',
        confirmButtonText: 'Aceptar',
    }).then(() => {
        borrarCampos();
    });
}

function usuarioRegistrado() {
    Swal.fire({
        title: 'Bienvenido',
        text: '...unos segundos por favor!',
        icon: 'success',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
        willClose: () => {
            window.location.href = "src/dashboard.html";
        }
    }).then(()=>{
        borrarCampos();
    });
}

// Validación al pulsar Enter y flechas arriba y abajo para cambiar de campo
document.addEventListener('keydown', function(event) {
    // Selecciona todos los inputs
    const inputs = Array.from(document.querySelectorAll('.form_input'));
    const activeElement = document.activeElement;
    const currentIndex = inputs.indexOf(activeElement);

    if (event.key === 'Enter') {
        // Si se presiona Enter, ejecuta validar()
        validar();
        event.preventDefault(); // Prevenir el comportamiento predeterminado de la tecla Enter
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        // Navegación con flechas
        if (currentIndex !== -1) {
            let nextIndex = currentIndex + (event.key === 'ArrowDown' ? 1 : -1);
            nextIndex = (nextIndex + inputs.length) % inputs.length; // Ciclar si alcanza los límites
            inputs[nextIndex].focus();
        }
        event.preventDefault(); // Prevenir el desplazamiento de la página
    }
});

// Cambio de color del botón al pasar el ratón por encima
const boton = document.querySelector(".form_submit");

boton.addEventListener('mouseover', () => {
    boton.style.backgroundColor = "#EB652D";
});

// Devuelvo el color original al botón al quitar el ratón
boton.addEventListener('mouseout', () => {
    boton.style.backgroundColor = "#c03562";
});

document.addEventListener('DOMContentLoaded', function () {
    const selectElement = document.getElementById('sexo');
    selectElement.addEventListener('change', function () {
        if (this.value) {
            this.classList.add('option-selected');
        } else {
            this.classList.remove('option-selected');
        }
    });
});

document.getElementById("togglePassword").addEventListener("change", function() {
    var inputContraseña = document.getElementById("contraseña");
    if (this.checked) {
        inputContraseña.type = "text";
    } else {
        inputContraseña.type = "password";
    }
});