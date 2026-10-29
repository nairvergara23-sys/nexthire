"use strict";

// ==========================================
// BÚSQUEDA DE EMPLEOS Y PASANTÍAS
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("jobSearch");
    const jobType = document.getElementById("jobType");
    const searchButton = document.getElementById("searchButton");
    const jobCards = document.querySelectorAll(".job-card");
    const resultCount = document.getElementById("resultCount");
    const emptyMessage = document.getElementById("emptyMessage");

    function searchJobs() {
        if (!searchInput || !jobType) return;

        const keyword = searchInput.value.trim().toLowerCase();
        const selectedType = jobType.value;

        let visibleCount = 0;

        jobCards.forEach(function (card) {
            const cardText = card.dataset.search || "";
            const cardType = card.dataset.type || "";

            const matchesKeyword = cardText.includes(keyword);

            const matchesType =
                selectedType === "todos" ||
                cardType === selectedType;

            const isVisible = matchesKeyword && matchesType;

            card.hidden = !isVisible;

            if (isVisible) {
                visibleCount++;
            }
        });

        if (resultCount) {
            resultCount.textContent =
                visibleCount +
                (visibleCount === 1
                    ? " oportunidad"
                    : " oportunidades");
        }

        if (emptyMessage) {
            emptyMessage.hidden = visibleCount !== 0;
        }
    }

    if (searchButton) {
        searchButton.addEventListener("click", searchJobs);
    }

    if (searchInput) {
        searchInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                searchJobs();
            }
        });
    }

    if (jobType) {
        jobType.addEventListener("change", searchJobs);
    }

    // ==========================================
    // VENTANA DE DETALLES DE OPORTUNIDADES
    // ==========================================

    const detailsButtons = document.querySelectorAll(".details-button");
    const modal = document.getElementById("detailsModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalDescription = document.getElementById("modalDescription");
    const closeModal = document.getElementById("closeModal");
    const modalDone = document.getElementById("modalDone");

    function hideModal() {
        if (modal) {
            modal.hidden = true;
        }
    }

    detailsButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            if (!modal || !modalTitle || !modalDescription) return;

            modalTitle.textContent =
                button.dataset.title || "Oportunidad laboral";

            modalDescription.textContent =
                button.dataset.description || "";

            modal.hidden = false;

            if (closeModal) {
                closeModal.focus();
            }
        });
    });

    if (closeModal) {
        closeModal.addEventListener("click", hideModal);
    }

    if (modalDone) {
        modalDone.addEventListener("click", hideModal);
    }

    if (modal) {
        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                hideModal();
            }
        });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            hideModal();
        }
    });

});


// ==========================================
// REGISTRO DE PERSONAS Y EMPRESAS
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ------------------------------------------
    // REGISTRO DE PERSONAS
    // ------------------------------------------

    function configurarRegistroPersona() {
        const formulario = document.getElementById("personForm");

        if (!formulario) return;

        formulario.addEventListener("submit", function (evento) {
            evento.preventDefault();

            const nombre = document.getElementById("fullName");
            const correo = document.getElementById("personEmail");
            const contrasena = document.getElementById("personPassword");
            const confirmar = document.getElementById("confirmPassword");
            const mensaje = document.getElementById("personMessage");

            if (
                !nombre ||
                !correo ||
                !contrasena ||
                !confirmar ||
                !mensaje
            ) {
                return;
            }

            mensaje.textContent = "";
            mensaje.style.color = "";

            if (contrasena.value !== confirmar.value) {
                mensaje.textContent =
                    "Las contraseñas no coinciden. Volvé a intentarlo.";

                mensaje.style.color = "#c62828";
                confirmar.focus();
                return;
            }

            if (contrasena.value.length < 8) {
                mensaje.textContent =
                    "La contraseña debe tener al menos 8 caracteres.";

                mensaje.style.color = "#c62828";
                contrasena.focus();
                return;
            }

            // Guardamos únicamente los datos básicos de demostración.
            // No guardamos la contraseña.

            const persona = {
                nombre: nombre.value.trim(),
                correo: correo.value.trim()
            };

            try {
                localStorage.setItem(
                    "nexthire_person_profile_v1",
                    JSON.stringify(persona)
                );

                mensaje.textContent =
                    "¡Registro completado! Abriendo tu panel...";

                mensaje.style.color = "#287a48";

                window.setTimeout(function () {
                    window.location.href = "panel-persona.html";
                }, 500);

            } catch (error) {
                mensaje.textContent =
                    "No se pudieron guardar los datos en este navegador.";

                mensaje.style.color = "#c62828";
            }
        });
    }

    // ------------------------------------------
    // REGISTRO DE EMPRESAS
    // ------------------------------------------

    function configurarRegistroEmpresa() {
        const formulario = document.getElementById("companyForm");

        if (!formulario) return;

        formulario.addEventListener("submit", function (evento) {
            evento.preventDefault();

            const nombreEmpresa =
                document.getElementById("companyName");

            const responsable =
                document.getElementById("responsibleName");

            const correo =
                document.getElementById("companyEmail");

            const contrasena =
                document.getElementById("companyPassword");

            const confirmar =
                document.getElementById("companyConfirmPassword");

            const mensaje =
                document.getElementById("companyMessage");

            if (
                !nombreEmpresa ||
                !responsable ||
                !correo ||
                !contrasena ||
                !confirmar ||
                !mensaje
            ) {
                return;
            }

            mensaje.textContent = "";
            mensaje.style.color = "";

            // Comprobar que las contraseñas coincidan.

            if (contrasena.value !== confirmar.value) {
                mensaje.textContent =
                    "Las contraseñas no coinciden. Volvé a intentarlo.";

                mensaje.style.color = "#c62828";
                confirmar.focus();
                return;
            }

            // Comprobar la longitud de la contraseña.

            if (contrasena.value.length < 8) {
                mensaje.textContent =
                    "La contraseña debe tener al menos 8 caracteres.";

                mensaje.style.color = "#c62828";
                contrasena.focus();
                return;
            }

            // Preparar los datos de demostración.
            // Por seguridad, no guardamos la contraseña.

            const empresa = {
                companyName: nombreEmpresa.value.trim(),
                responsibleName: responsable.value.trim(),
                companyEmail: correo.value.trim(),

                // Campos adicionales para facilitar
                // su lectura desde el panel de empresa.
                name: nombreEmpresa.value.trim(),
                responsible: responsable.value.trim(),
                email: correo.value.trim()
            };

            try {
                localStorage.setItem(
                    "nexthire_company_profile_v1",
                    JSON.stringify(empresa)
                );

                mensaje.textContent =
                    "¡Registro completado! Abriendo el panel de tu empresa...";

                mensaje.style.color = "#287a48";

                // Abrir el panel de la empresa.

                window.setTimeout(function () {
                    window.location.href = "panel-empresa.html";
                }, 700);

            } catch (error) {
                mensaje.textContent =
                    "No se pudieron guardar los datos. Revisá la configuración del navegador.";

                mensaje.style.color = "#c62828";
            }
        });
    }

    configurarRegistroPersona();
    configurarRegistroEmpresa();

});