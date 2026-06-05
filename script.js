(function () {
    var menuButton = document.querySelector('.nav-toggle');
    var menu = document.getElementById('primary-menu');
    var year = document.getElementById('current-year');
    var form = document.getElementById('contact-form');
    var status = document.getElementById('form-status');

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    function closeMenu() {
        if (!menu || !menuButton) {
            return;
        }

        menu.classList.remove('is-open');
        menu.classList.add('hidden');
        menuButton.setAttribute('aria-expanded', 'false');
    }

    if (menuButton && menu) {
        menuButton.addEventListener('click', function () {
            var isOpen = menuButton.getAttribute('aria-expanded') === 'true';

            menuButton.setAttribute('aria-expanded', String(!isOpen));
            menu.classList.toggle('is-open', !isOpen);
            menu.classList.toggle('hidden', isOpen);
        });

        var links = menu.getElementsByTagName('a');
        for (var i = 0; i < links.length; i += 1) {
            links[i].addEventListener('click', closeMenu);
        }
    }

    if (form && status) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            var endpoint = form.getAttribute('data-endpoint');
            var fields = form.elements;
            var payload = {};

            for (var i = 0; i < fields.length; i += 1) {
                if (fields[i].name) {
                    payload[fields[i].name] = fields[i].value;
                }
            }

            if (!endpoint) {
                status.className = 'form-status error';
                status.textContent = 'Contact endpoint is not configured.';
                return;
            }

            if (!window.fetch) {
                status.className = 'form-status error';
                status.textContent = 'This browser cannot submit the form. Please email directly.';
                return;
            }

            status.className = 'form-status';
            status.textContent = 'Sending message...';

            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error('Request failed');
                    }

                    status.className = 'form-status success';
                    status.textContent = 'Message sent successfully.';
                    form.reset();
                })
                .catch(function () {
                    status.className = 'form-status error';
                    status.textContent = 'Message could not be sent. Please try again or email directly.';
                });
        });
    }
}());
