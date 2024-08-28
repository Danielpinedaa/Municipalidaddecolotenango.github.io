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

    const validUsername = 'admin';
    const validPassword = 'admin123';

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
        }
    ];

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (username === validUsername && password === validPassword) {
            loginSection.style.display = 'none';
            contactsSection.style.display = 'block';
            displayContacts(contacts);
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
                        <span>${contact.phone}</span><br>
                    </div>
                    <button class="call-button">Llamar</button>
                    <button class="share-button">Compartir</button>
                </div>
            `;
            contactDiv.setAttribute('data-credential-src', contact.credential);

            // Evitar propagación al hacer clic en botones
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

        const images = document.querySelectorAll('.contact img');
        images.forEach(img => {
            img.addEventListener('click', (event) => {
                event.stopPropagation();
                openImageModal(img.src, img.alt);
            });
        });
    }

    function makeCall(phone) {
        window.location.href = `tel:${phone}`;
    }

    function shareContact(name, address, phone) {
        const message = `Contacto: ${name}%0A` +
                        `Dirección: ${address}%0A` +
                        `Teléfono: ${phone}`;
        const whatsappUrl = `https://api.whatsapp.com/send?text=${message}`;
        window.open(whatsappUrl, '_blank');
    }

    function openImageModal(src, alt) {
        const modal = document.getElementById('image-modal');
        const modalImage = document.getElementById('modal-image');
        const caption = document.getElementById('caption');

        modal.style.display = 'flex';
        modalImage.src = src;
        modalImage.alt = alt;
        caption.textContent = alt;
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
            displayContacts(contacts);
            return;
        }

        const filteredContacts = contacts.filter(contact => 
            contact.name.toLowerCase().includes(query)
        );

        if (filteredContacts.length > 0) {
            displayContacts(filteredContacts);
        } else {
            contactsList.innerHTML = '<p>No se encontraron contactos.</p>';
        }
    });

    document.getElementById('privacy-policy').addEventListener('click', (e) => {
        e.preventDefault();
        openModal('privacy-modal');
    });

    requestUserButton.addEventListener('click', () => {
        openModal('request-modal');
    });

    requestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('request-name').value;
        const cui = document.getElementById('request-cui').value;
        const nit = document.getElementById('request-nit').value;
        const company = document.getElementById('request-company').value;
        const reason = document.getElementById('request-reason').value;

        closeModal('request-modal');

        const subject = encodeURIComponent('Solicitud de Usuario');
        const body = encodeURIComponent(`Nombre: ${name}\nCUI/DPI: ${cui}\nNIT: ${nit}\nEmpresa/Institución: ${company}\nMotivo: ${reason}`);
        const mailtoUrl = `mailto:dpdanielpineda59@gmail.com?subject=${subject}&body=${body}`;

        window.open(mailtoUrl, '_blank');
    });

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'flex';
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'none';
    }

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

        if (month === 7) {
            message = 'La próxima reunión de COMUDE es el jueves 29-08-2024.';
        } else if (month === 8) {
            message = 'La próxima reunión de COMUDE es el jueves 26-09-2024.';
        } else {
            return;
        }

        function displayAnnouncement() {
            showAnnouncement(message);
            setTimeout(hideAnnouncement, 5000);
            setTimeout(displayAnnouncement, 15000);
        }

        displayAnnouncement();
    }

    window.addEventListener('load', checkAnnouncement);
});
