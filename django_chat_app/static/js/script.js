async function sendMessage() {
    let fd = new FormData();
    let token = '{{ csrf_token }}';
    fd.append('textmessage', messageField.value);
    fd.append('csrfmiddlewaretoken', token);
    try {
        chatContainer.innerHTML += `
        <div class="message-date" id="selectMessage">
            <b>{{ request.user }}:</b> ${messageField.value} <span class="message-date">({{ message.created_at }}<span>)
        </div>`;

        let response = await fetch('/chat/', {
            method: 'POST',
            body: fd
        });
        let json = await response.json();
        console.log('json', json);
        let message = JSON.parse(json);
        console.log('Message', message);
        const formattedDate = formatDate(message.fields.created_at);
        document.getElementById('selectMessage').remove();
        chatContainer.innerHTML += `
        <div>
            <b>{{ request.user }}:</b> ${messageField.value} <span class="message-date">(${formattedDate}<span>)
        </div>`;
        console.log('Success!!');
        messageField.value = "";

    } catch (e) {
        console.error('An error occured', e);
    }
}

async function sendlogin() {
    let fd = new FormData();
    let token = '{{ csrf_token }}';
    fd.append('username', usernameField.value);
    fd.append('password', passwordField.value);
    fd.append('csrfmiddlewaretoken', token);
    try {
        usernameField.disable = true;
        passwordField.disable = true;

        loginForm.innerHTML = `<div class="overlay" id="overlay">
                                <div class="mdl-spinner mdl-js-spinner is-active"></div>
                             </div>`

        let response = await fetch('/login/', {
            method: 'POST',
            body: fd
        });

        document.getElementById('selectMessage').remove();
        console.log('Success!!');

    } catch (e) {
        console.error('An error occured', e);
    }
}

async function sendRegister() {
    if (password.value === password_repeat.value) {
        let fd = new FormData();
        let token = '{{ csrf_token }}';
        fd.append('username', username.value);
        fd.append('password', password.value);
        fd.append('email', email.value);
        fd.append('csrfmiddlewaretoken', token);
        try {
            username.disable = true;
            email.disable = true;
            password.disable = true;
            password_repeat.disable = true;

            registerForm.innerHTML = `<div class="overlay" id="overlay">
                                <div class="mdl-spinner mdl-js-spinner is-active"></div>
                             </div>`

            let response = await fetch('/register/', {
                method: 'POST',
                body: fd
            });

            document.getElementById('selectMessage').remove();
            console.log('Success!!');

        } catch (e) {
            console.error('An error occured', e);
        }
    } else {
        alert('Die beiden Input-Felder enthalten unterschiedliche Werte.');
    }
}

function formatDate(inputDate) {
    const months = [
        'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.',
        'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'
    ];

    const parts = inputDate.split('-');
    const year = parts[0];
    const month = months[parseInt(parts[1], 10) - 1];
    const day = parseInt(parts[2], 10);

    return `${month} ${day}, ${year}`;
}