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
    const requestUserButton = document.getElementById('request-user-button');
    const requestModal = document.getElementById('request-modal');
    const requestForm = document.getElementById('request-form');
    const requestClose = document.getElementById('request-close');

    // Datos de prueba para autenticación
    const validUsername = 'admin';
    const validPassword = 'admin123';

    // Definir contactos directamente en el script
    const contacts = [
        {
            "name": "Juan Pérez",
            "address": "Calle Falsa 123, Ciudad",
            "phone": "555-1234",
            "photo": "images/profile/juan_perez.jpg",
            "credential": "images/credentials/juan_perez_credential.png"
        },
        {
            "name": "Ana Gómez",
            "address": "Avenida Siempre Viva 742, Ciudad",
            "phone": "555-5678",
            "photo": "images/profile/ana_gomez.jpg",
            "credential": "images/credentials/ana_gomez_credential.png"
        },
        {
            "name": "Luis Fernández",
            "address": "Boulevard de los Sueños 456, Ciudad",
            "phone": "555-9012",
            "photo": "images/profile/luis_fernandez.jpg",
            "credential": "images/credentials/luis_fernandez_credential.png"
        },
        {
            "name": "Luis Ferdez",
            "address": "CASERÍO LOS REGADILLOS",
            "phone": "555-9012",
            "photo": "images/profile/luis_fernandez.jpg",
            "credential": "images/credentials/luis_fernandez_credential.png"
        },
        {
            "name": "Luis Ferdez",
            "address": "CASERÍO LOS REGADILLOS",
            "phone": "555-9012",
            "photo": "images/profile/luis_fernandez.jpg",
            "credential": "images/credentials/luis_fernandez_credential.png"
        },
        {
            "name": "Luis Ferdez",
            "address": "CASERÍO LOS REGADILLOS",
            "phone": "555-9012",
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
                        <span>${contact.address}</span><br>
                        <span>${contact.phone}</span>
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

    // Mostrar modal para solicitar usuario
    requestUserButton.addEventListener('click', () => {
        openModal('request-modal');
    });

    // Manejar el envío del formulario de solicitud de usuario
    requestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('request-name').value;
        const cui = document.getElementById('request-cui').value;
        const nit = document.getElementById('request-nit').value;
        const company = document.getElementById('request-company').value;
        const reason = document.getElementById('request-reason').value;

        // Cerrar el modal
        closeModal('request-modal');

        // Crear el mensaje para enviar por WhatsApp
        const message = `Solicitud de Usuario:\nNombre: ${name}\nCUI/DPI: ${cui}\nNIT: ${nit}\nEmpresa/Institución: ${company}\nMotivo: ${reason}`;
        const whatsappUrl = `https://wa.me/50250410543?text=${encodeURIComponent(message)}`;
        
        // Abrir WhatsApp con el mensaje prellenado
        window.open(whatsappUrl, '_blank');
    });

    // Función para abrir modal
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'flex';
    }

    // Función para cerrar modal
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'none';
    }
});

