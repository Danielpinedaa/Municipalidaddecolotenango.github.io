// script.js

document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const loginSection = document.getElementById('login-section');
    const contactsSection = document.getElementById('contacts-section');
    const searchBox = document.getElementById('search-box');
    const searchButton = document.getElementById('search-button');
    const contactsList = document.getElementById('contacts-list');

    // Datos de prueba para autenticación
    const validUsername = 'admin';
    const validPassword = 'admin123';

    // Definir contactos directamente en el script
    const contacts = [
        {
            "name": "Juan Pérez",
            "email": "juan.perez@empresa.com",
            "photo": "images/profile/juan_perez.jpg",
            "credential": "images/credentials/juan_perez_credential.png"
        },
        {
            "name": "Ana Gómez",
            "email": "ana.gomez@empresa.com",
            "photo": "images/profile/ana_gomez.jpg",
            "credential": "images/credentials/ana_gomez_credential.png"
        },
        {
            "name": "Luis Fernández",
            "email": "luis.fernandez@empresa.com",
            "photo": "images/profile/luis_fernandez.jpg",
            "credential": "images/credentials/luis_fernandez_credential.png"
        }
    ];

    // Manejo del formulario de inicio de sesión
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (username === validUsername && password === validPassword) {
            loginSection.style.display = 'none';
            contactsSection.style.display = 'block';
            displayContacts(contacts); // Muestra todos los contactos al inicio
        } else {
            loginError.textContent = 'Usuario o contraseña incorrectos.';
        }
    });

    // Mostrar contactos en la página
    function displayContacts(contacts) {
        contactsList.innerHTML = '';
        contacts.forEach(contact => {
            const contactDiv = document.createElement('div');
            contactDiv.classList.add('contact');
            contactDiv.innerHTML = `
                <img src="${contact.photo}" alt="${contact.name}" class="contact-photo">
                <div class="contact-info">
                    <div>
                        <strong>${contact.name}</strong><br>
                        <span>${contact.email}</span>
                    </div>
                </div>
            `;
            contactDiv.setAttribute('data-credential-src', contact.credential);
            contactDiv.addEventListener('click', () => {
                openCredentialModal(contact.credential, contact.name);
            });
            contactsList.appendChild(contactDiv);
        });

        // Agregar evento a cada imagen para abrir en modal
        const images = document.querySelectorAll('.contact img');
        images.forEach(img => {
            img.addEventListener('click', (event) => {
                event.stopPropagation(); // Evita que el clic en la imagen también active el modal de credenciales
                openImageModal(img.src, img.alt);
            });
        });
    }

    // Función para abrir el modal de la foto
    function openImageModal(src, alt) {
        const modal = document.getElementById('image-modal');
        const modalImage = document.getElementById('modal-image');
        const caption = document.getElementById('caption');

        modal.style.display = 'flex';
        modalImage.src = src;
        modalImage.alt = alt;
        caption.textContent = alt;
    }

    // Función para abrir el modal de la credencial
    function openCredentialModal(src, name) {
        const modal = document.getElementById('credential-modal');
        const credentialImage = document.getElementById('credential-image');
        const caption = document.getElementById('credential-caption');

        modal.style.display = 'flex';
        credentialImage.src = src;
        credentialImage.alt = name;
        caption.textContent = `Credencial de ${name}`;
    }

    // Cerrar la ventana modal
    const modalClose = document.querySelectorAll('.modal-close');
    modalClose.forEach(closeButton => {
        closeButton.addEventListener('click', () => {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });

    // Cerrar la ventana modal si se hace clic fuera de la imagen
    window.addEventListener('click', (event) => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Filtrar contactos según la búsqueda
    searchButton.addEventListener('click', () => {
        const query = searchBox.value.toLowerCase().trim();

        if (query === '') {
            // Si la búsqueda está vacía, mostrar todos los contactos
            displayContacts(contacts);
            return;
        }

        const filteredContacts = contacts.filter(contact => 
            contact.name.toLowerCase().includes(query)
        );

        // Mostrar contactos filtrados
        if (filteredContacts.length > 0) {
            displayContacts(filteredContacts);
        } else {
            contactsList.innerHTML = '<p>No se encontraron contactos.</p>';
        }
    });

    // Mostrar modal de políticas de privacidad
    document.getElementById('privacy-policy').addEventListener('click', (e) => {
        e.preventDefault();
        openModal('privacy-modal');
    });

    // Función para abrir el modal
    function openModal(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }

    // Función para cerrar el modal
    function closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }
});
