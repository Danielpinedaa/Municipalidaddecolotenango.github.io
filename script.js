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
    const adminForm = document.getElementById('admin-form');
    const adminDashboard = document.getElementById('admin-dashboard');

    // Definición de contactos simulados
    let contacts = [
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
        }
    ];

    // Definición de usuarios y contraseñas
    const users = {
        admin: 'admin123',
        user: 'user123'
    };

    // Manejar el inicio de sesión
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (users[username] && users[username] === password) {
            loginSection.style.display = 'none';
            if (username === 'admin') {
                adminDashboard.style.display = 'block';
            } else {
                contactsSection.style.display = 'block';
                displayContacts(); 
            }
        } else {
            loginError.textContent = 'Usuario o contraseña incorrectos.';
        }
    });

    // Función para mostrar los contactos
    function displayContacts() {
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
                    <button class="call-button">Llamar</button>
                    <button class="share-button">Compartir</button>
                </div>
            `;
            contactDiv.setAttribute('data-credential-src', contact.credential);

            contactDiv.querySelector('.call-button').addEventListener('click', (event) => {
                event.stopPropagation();
                makeCall(contact.phone);
            });

            contactDiv.querySelector('.share-button').addEventListener('click', (event) => {
                event.stopPropagation();
                shareContact(contact.name, contact.address, contact.phone);
            });

            contactDiv.addEventListener('click', () => {
                openCredentialModal(contact.credential, contact.name);
            });

            contactsList.appendChild(contactDiv);
        });
    }

    // Función para hacer llamadas
    function makeCall(phone) {
        window.location.href = `tel:${phone}`;
    }

    // Función para compartir contactos
    function shareContact(name, address, phone) {
        const message = `Contacto: ${name}%0A` +
                        `Dirección: ${address}%0A` +
                        `Teléfono: ${phone}`;
        const whatsappUrl = `https://api.whatsapp.com/send?text=${message}`;
        window.open(whatsappUrl, '_blank');
    }

    // Función para abrir la ventana modal de credenciales
    function openCredentialModal(src, name) {
        const modal = document.getElementById('credential-modal');
        const credentialImage = document.getElementById('credential-image');
        const caption = document.getElementById('credential-caption');

        modal.style.display = 'flex';
        credentialImage.src = src;
        credentialImage.alt = name;
        caption.textContent = `Credencial de ${name}`;
    }

    // Cerrar modales
    const modalClose = document.querySelectorAll('.modal-close');
    modalClose.forEach(closeButton => {
        closeButton.addEventListener('click', () => {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });

    window.addEventListener('click', (event) => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Búsqueda de contactos
    searchButton.addEventListener('click', () => {
        const query = searchBox.value.toLowerCase().trim();

        if (query === '') {
            displayContacts();
            return;
        }

        const filteredContacts = contacts.filter(contact => 
            contact.address.toLowerCase().includes(query)
        );

        if (filteredContacts.length > 0) {
            displayContacts(filteredContacts);
        } else {
            contactsList.innerHTML = '<p>No se encontraron contactos.</p>';
        }
    });

    // Manejar la solicitud de usuario
    requestUserButton.addEventListener('click', () => {
        openModal('request-modal');
    });

    // Agregar contacto desde el panel de administración
    adminForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('admin-name').value;
        const address = document.getElementById('admin-address').value;
        const phone = document.getElementById('admin-phone').value;
        const photoFile = document.getElementById('admin-photo').files[0];
        const credentialFile = document.getElementById('admin-credential').files[0];

        if (photoFile && credentialFile) {
            const reader = new FileReader();
            const credentialReader = new FileReader();

            reader.onload = function (e) {
                const photoDataUrl = e.target.result;

                credentialReader.onload = function (e) {
                    const credentialDataUrl = e.target.result;

                    const newContact = {
                        name,
                        address,
                        phone,
                        photo: photoDataUrl,
                        credential: credentialDataUrl
                    };

                    contacts.push(newContact);

                    // Mostrar la lista de contactos y ocultar el dashboard
                    adminDashboard.style.display = 'none';
                    contactsSection.style.display = 'block';
                    displayContacts();

                    adminForm.reset(); 
                };

                credentialReader.readAsDataURL(credentialFile);
            };

            reader.readAsDataURL(photoFile);
        } else {
            alert("Por favor, carga tanto la foto del contacto como la credencial.");
        }
    });

    // Función para abrir modales
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'flex';
    }

    // Función para cerrar modales
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'none';
    }

    // Anuncio emergente
    function showAnnouncement(message) {
        const announcement = document.getElementById('announcement');
        announcement.textContent = message;
        announcement.style.display = 'block';
    }

    function hideAnnouncement() {
        const announcement = document.getElementById('announcement');
        announcement.style.display = 'none';
    }

    function checkAnnouncement() {
        const today = new Date();
        const month = today.getMonth();
        const day = today.getDate();

        let message = '';

        if (month === 7 && day === 29) {
            message = 'La próxima reunión de COMUDE es el jueves 29-08-2024.';
        } else if (month === 8 && day === 26) {
            message = 'La próxima reunión de COMUDE es el jueves 26-09-2024.';
        } else {
            return; // No mostrar anuncio si no es la fecha específica
        }

        showAnnouncement(message);
        setTimeout(hideAnnouncement, 5000);
    }

    window.addEventListener('load', checkAnnouncement);
});
