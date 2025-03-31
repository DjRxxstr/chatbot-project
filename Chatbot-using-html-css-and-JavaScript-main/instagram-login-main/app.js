let slide_content = document.querySelector('#slide-content')

let signin_form = document.querySelector('#signin-form')

let signin_btn = document.querySelector('#signin-btn')

let darkmode_toggle = document.querySelector('#darkmode-toggle')

let slide_index = 0

slide = () => {
    let slide_items = slide_content.querySelectorAll('img')
    slide_items.forEach(e => e.classList.remove('active'))
    slide_index = slide_index + 1 === slide_items.length ? 0 : slide_index + 1
    slide_items[slide_index].classList.add('active')
}

setInterval(slide, 2000)

// animate input
// ... (other existing code remains unchanged)

// show/hide password functionality
document.querySelectorAll('.animate-input').forEach(e => {
    let input = e.querySelector('input')
    let showButton = e.querySelector('.show-btn')
    let hideButton = e.querySelector('.hide-btn')

    input.addEventListener('keyup', () => {
        if (input.value.trim().length > 0) {
            e.classList.add('active')
        } else {
            e.classList.remove('active')
        }

        if (checkSigninInput()) {
            signin_btn.removeAttribute('disabled')
        } else {
            signin_btn.setAttribute('disabled', 'true')
        }
    })

    // show/hide password buttons functionality
    if (showButton && hideButton) {
        showButton.addEventListener('click', () => {
            input.setAttribute('type', 'text')
            showButton.style.display = 'none'
            hideButton.style.display = 'inline'
        })

        hideButton.addEventListener('click', () => {
            input.setAttribute('type', 'password')
            hideButton.style.display = 'none'
            showButton.style.display = 'inline'
        })
    }
})

// ... (rest of your existing code remains unchanged)


checkSigninInput = () => {
    let inputs = signin_form.querySelectorAll('input')
    return Array.from(inputs).every(input => {
        return input.value.trim().length >= 6
    })
}

// darkmode toggle
darkmode_toggle.onclick = (e) => {
    e.preventDefault()
    let body = document.querySelector('body')
    body.classList.toggle('dark')
    darkmode_toggle.innerHTML = body.classList.contains('dark') ? 'Lightmode' : 'Darkmode'
}
function login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // You can replace this with your own authentication logic
    if (username === "your_username" && password === "your_password") {
        alert("Login successful!");
        // Redirect to another page or perform additional actions
    } else {
        alert("Valid username and password.");
    }
}

