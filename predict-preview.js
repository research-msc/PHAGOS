
/* ========================================
   PHAGOS PREDICT INTERFACE
   Frontend preview only.
   ======================================== */

(() => {

    "use strict";

    const form = document.getElementById("preview-form");
    const status = document.getElementById("status");

    const menu = document.querySelector(".predict-menu");
    const links = document.getElementById("predict-links");

    const fields = [
        {
            text: "cds",
            file: "cds-file",
            name: "cds-file-name",
            check: "dna-check"
        },
        {
            text: "protein",
            file: "protein-file",
            name: "protein-file-name",
            check: "protein-check"
        }
    ];

    const byId = id => document.getElementById(id);

    /* RESET INPUT CHECK INDICATORS */

    function clearChecks() {

        for (const field of fields) {

            const check = byId(field.check);

            check.textContent = "Not checked";

            delete check.dataset.state;

        }

        status.textContent = "Awaiting interface test.";

    }

    /* FILE SELECTION EVENTS */

    for (const field of fields) {

        byId(field.file).addEventListener("change", () => {

            const file = byId(field.file).files[0];

            byId(field.name).textContent = file
                ? file.name
                : "No file selected";

            clearChecks();

        });

        byId(field.text).addEventListener("input", clearChecks);

    }

    /* MODEL SELECTION EVENT */

    byId("model").addEventListener("change", clearChecks);

    /* RUN INTERFACE PREVIEW */

    form.addEventListener("submit", event => {

        event.preventDefault();

        let allPresent = true;

        for (const field of fields) {

            const present = Boolean(
                byId(field.text).value.trim() ||
                byId(field.file).files.length
            );

            const check = byId(field.check);

            check.textContent = present
                ? "Provided — not validated"
                : "Missing";

            check.dataset.state = present
                ? "present"
                : "missing";

            allPresent = allPresent && present;

        }

        const modelName =
            byId("model").selectedOptions[0].textContent;

        if (allPresent) {

            status.textContent =
                `Interface check complete. Selected model: ${modelName}. ` +
                "No biological validation or prediction performed.";

        } else {

            status.textContent =
                "Provide a demonstration input or select a file for each field.";

        }

    });

    /* CLEAR BUTTON */

    form.addEventListener("reset", () => {

        for (const field of fields) {

            byId(field.name).textContent = "No file selected";

        }

        clearChecks();

    });

    /* MOBILE NAVIGATION */

    menu.addEventListener("click", () => {

        const open = links.classList.toggle("open");

        menu.setAttribute("aria-expanded", String(open));

    });

    links.addEventListener("click", event => {

        if (event.target.closest("a")) {

            links.classList.remove("open");

            menu.setAttribute("aria-expanded", "false");

        }

    });

})();
