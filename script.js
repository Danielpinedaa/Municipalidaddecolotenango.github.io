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
    const adminDashboard = document.getElementById('admin-dashboard');

    const API_URL = 'fetch_contacts.php';  // Nuevo script PHP para obtener los contactos

    // Obtener contactos del backend
    async function fetchContacts() {
        try {
            const response = await fetch(API_URL);
            const contacts = await response.json();
            displayContacts(contacts);
        } catch (error) {
            console.error('Error al obtener contactos:', error);
        }
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (username === 'admin' && password === 'admin3348') {
            loginSection.style.display = 'none';
            adminDashboard.style.display = 'block';
        } else if (username === 'user' && password === 'user3348') {
            loginSection.style.display = 'none';
            contactsSection.style.display = 'block';
            fetchContacts();
        } else {
            loginError.textContent = 'Usuario o contraseña incorrectos.';
        }
    });

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
                    <button class="call-button">Llamar</button>
                    <button class="share-button">Compartir</button>
                </div>
            `;

            contactDiv.querySelector('.call-button').addEventListener('click', () => {
                window.location.href = `tel:${contact.phone}`;
            });

            contactDiv.querySelector('.share-button').addEventListener('click', () => {
                const message = `Contacto: ${contact.name}%0ADirección: ${contact.address}%0ATeléfono: ${contact.phone}`;
                const whatsappUrl = `https://api.whatsapp.com/send?text=${message}`;
                window.open(whatsappUrl, '_blank');
            });

            contactDiv.addEventListener('click', () => {
                openCredentialModal(contact.credential, contact.name);
            });

            contactsList.appendChild(contactDiv);
        });
    }

    function openCredentialModal(src, name) {
        const modal = document.getElementById('credential-modal');
        const credentialImage = document.getElementById('credential-image');
        const caption = document.getElementById('credential-caption');

        modal.style.display = 'flex';
        credentialImage.src = src;
        credentialImage.alt = name;
        caption.textContent = `Credencial de ${name}`;
    }

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

    searchButton.addEventListener('click', () => {
        const query = searchBox.value.toLowerCase().trim();
        if (query === '') {
            fetchContacts();
            return;
        }

        fetchContacts().then(contacts => {
            const filteredContacts = contacts.filter(contact => 
                contact.address.toLowerCase().includes(query)
            );
            displayContacts(filteredContacts);
        });
    });

    // Manejo de solicitudes de usuario (el botón de solicitar usuario)
    requestUserButton.addEventListener('click', () => {
        openModal('request-modal');
    });

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'flex';
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'none';
    }

    // Mostrar el anuncio emergente
    function showAnnouncement(message) {
        const announcement = document.getElementById('announcement');
        announcement.textContent = message;
        announcement.style.display = 'block';
        setTimeout(() => {
            announcement.style.display = 'none';
        }, 5000);
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
    }

    window.addEventListener('load', checkAnnouncement);
    fetchContacts();  // Cargar contactos al iniciar
});
