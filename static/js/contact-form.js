// Posts the contact form to a Google Form endpoint. mode: 'no-cors' means the
// response is opaque, so a resolved promise only tells us the request left the
// browser — it cannot confirm the form recorded it.
(function () {
    var FORM_ENDPOINT = 'https://docs.google.com/forms/d/e/1FAIpQLSfjjd0slqYgPp5lssr1wdYn0_Ryr-ZRS07vaGvV621HSJg0_g/formResponse';
    var FIELDS = {
        name: 'entry.1042344079',
        email: 'entry.979343976',
        message: 'entry.1793433401'
    };

    var form = document.getElementById('contact-form');
    if (!form) return;

    var btn = document.getElementById('submit-btn');
    var success = document.getElementById('form-success');
    var error = document.getElementById('form-error');
    var label = btn ? btn.textContent : '';

    function settle(ok) {
        if (success) success.style.display = ok ? 'block' : 'none';
        if (error) error.style.display = ok ? 'none' : 'block';
        if (btn) {
            btn.textContent = label;
            btn.disabled = false;
        }
        if (ok) form.reset();
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (btn) {
            btn.textContent = 'Sending...';
            btn.disabled = true;
        }

        var data = new URLSearchParams();
        for (var field in FIELDS) data.append(FIELDS[field], form[field].value);

        fetch(FORM_ENDPOINT, { method: 'POST', body: data, mode: 'no-cors' })
            .then(function () { settle(true); })
            .catch(function () { settle(false); });
    });
})();
