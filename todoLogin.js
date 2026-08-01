'use strict';

import {auth, provider} from "./todoApp.js";
import {
    MainNav as mainNav
} from "./components/main-navigation/main-navigation.js";

const $ = document;
window.customElements.define("main-nav-comp", mainNav);
// ----------------------------------------------------------------------------
// ------------------------------- VISUALS ------------------------------------
// ----------------------------------------------------------------------------
// Background Visuals :
const todoTemplates = [
    {
        id: 1,
        description: 'Take a shower &#x1F6C1',
        date: 'Today',
        time: '09:00-10:00',
        starred: true,
    },
    {
        id: 2,
        description: 'Read The Fall by Camus &#x1f4d6',
        date: '13 Jul 2025',
        time: '09:00-11:00',
        starred: false,
    },
    {
        id: 3,
        description: 'Learn React.js &#x1f4bb',
        date: 'Tomorrow',
        time: 'All day Long',
        starred: true,
    },
    {
        id: 4,
        description: 'Watch Black Swan &#x1F3AC',
        date: 'Today',
        time: '22:00-00:00',
        starred: false,
    },
    {
        id: 5,
        description: 'Go swimming &#x1F3CA',
        date: '16 Jul 2025',
        time: '13:00-15:00',
        starred: true,
    },
    {
        id: 6,
        description: 'Attend the interview session at 10 A.M. &#x1F9D1',
        date: '12 Jul 2025',
        time: '10:00',
        starred: true,
    },
    {
        id: 7,
        description: 'Play The Last of Us &#x1F3AE',
        date: 'Tomorrow',
        time: '20:00-22:00',
        starred: false,
    },
    {
        id: 8,
        description: 'Water the plants &#x1F331',
        date: 'Today',
        time: '09:00',
        starred: true,
    },
];
const todoColors = ['#f3c7c7', '#ffc141', 'rgba(223,69,255,0.5)', '#7affb7', '#c8ebf8', '#ffe9a6', '#fff11e', '#c9f9cd', '#e5e5ff', '#ffc0c0', '#e6beff', '#b4beff']
$.querySelectorAll('.col').forEach((column, index) => {
    let colTop;
    switch (index) {
        case 0:
            colTop = -60;
            break;
        case 1:
            colTop = -80;
            break;
        case 2:
            colTop = -46;
            break;
        case 3:
            colTop = -15;
            break;
    }
    todoTemplates.forEach(todoTemplate => {
        let todoDiv = $.createElement('div');
        const starIcon = '<span><svg class="starIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg></span>'
        todoDiv.innerHTML = `
            <div>
            ${todoTemplate.starred ? starIcon : ''}
            <span>${todoTemplate.date}</span>
            </div>
            <div class="todoDes">${todoTemplate.description}</div>
            <div>${todoTemplate.time}</div>
        `;
        todoDiv.classList.add('todoTemplate');
        todoDiv.style.backgroundColor = todoColors[Math.floor(Math.random() * 12)];
        todoDiv.style.top = colTop + '%';
        colTop += 26;
        column.appendChild(todoDiv);
    });
});

let c1I7Top = parseInt(window.getComputedStyle($.querySelector('#col1 .todoTemplate:last-child')).top);
let c2I0Top = parseInt(window.getComputedStyle($.querySelector('#col2 .todoTemplate:first-child')).top);
let c3I7Top = parseInt(window.getComputedStyle($.querySelector('#col3 .todoTemplate:last-child')).top);
let c4I0Top = parseInt(window.getComputedStyle($.querySelector('#col4 .todoTemplate:first-child')).top);

function move1 () {
    let todos = $.querySelectorAll('#col1 .todoTemplate');
    todos.forEach(function (todo) {
        let todoTop = parseInt(window.getComputedStyle(todo).top);
        let todoHeight = parseInt(window.getComputedStyle(todo).height);
        let newTop = todoTop + 1;
        todo.style.top = `${newTop}px`;
        if (newTop > c1I7Top + todoHeight) {
            todo.style.top = `-61%`;
        }
    });
}
function move2 () {
    let todos = $.querySelectorAll('#col2 .todoTemplate');
    todos.forEach(function (todo) {
        let todoTop = parseInt(window.getComputedStyle(todo).top);
        let todoHeight = parseInt(window.getComputedStyle(todo).height);
        let newTop = todoTop - 1;
        todo.style.top = `${newTop}px`;
        if (newTop < c2I0Top - todoHeight) {
            todo.style.top = `103%`;
        }
    });
}
function move3 () {
    let todos = $.querySelectorAll('#col3 .todoTemplate');
    todos.forEach(function (todo) {
        let todoTop = parseInt(window.getComputedStyle(todo).top);
        let todoHeight = parseInt(window.getComputedStyle(todo).height);
        let newTop = todoTop + 1;
        todo.style.top = `${newTop}px`;
        if (newTop > c3I7Top + todoHeight) {
            todo.style.top = `-47%`;
        }
    });
}
function move4 () {
    let todos = $.querySelectorAll('#col4 .todoTemplate');
    todos.forEach(function (todo) {
        let todoTop = parseInt(window.getComputedStyle(todo).top);
        let todoHeight = parseInt(window.getComputedStyle(todo).height);
        let newTop = todoTop - 1;
        todo.style.top = `${newTop}px`;
        if (newTop < c4I0Top - todoHeight) {
            todo.style.top = `168%`;
        }
    });
}

setInterval(move1, 10);
setInterval(move2, 8);
setInterval(move3, 9);
setInterval(move4, 11);

// Form visuals :
const signupBox = $.getElementById('signupBox');
const f1input1 = $.querySelector('#input1bg input');
const f1input1bg = $.querySelector('#input1bg div');
const f1input2 = $.querySelector('#input2bg input');
const f1input2bg = $.querySelector('#input2bg div');
const f2input1 = $.querySelector('#f2input1bg input');
const f2input1bg = $.querySelector('#f2input1bg div');
const f2input2 = $.querySelector('#f2input2bg input');
const f2input2bg = $.querySelector('#f2input2bg div');
const f2input3 = $.querySelector('#f2input3bg input');
const f2input3bg = $.querySelector('#f2input3bg div');
const modalBox = $.getElementById('modal');
const modalMessage = $.querySelector('#modal p');
const modalTimeBar = $.querySelector('#modal div:last-child');
const f1forgotPass = $.getElementById('forgotPass');
const f1submitBtn1 = $.querySelector('#f1btn1');
const f1submitBtn2 = $.querySelector('#f1btn2');
const f2submitBtn1 = $.querySelector('#f2btn1');
const f2submitBtn2 = $.querySelector('#f2btn2');
const joinBtn = $.querySelector('#loginBox div:last-child a');
const loginBtn = $.querySelector('#signupBox div:last-child a');
let prevBorColor;
const mailRegex = /^[a-zA-Z][a-zA-Z0-9]{0,24}(?:\.[a-zA-Z0-9]{1,24}){0,2}@[a-zA-Z0-9]{1,10}\.[a-zA-Z]{1,5}$/;
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|])[A-Za-z\d!@#$%^&*(),.?":{}|]{8,32}$/;
const emailInputs = [f1input1, f2input1];
const f2PassInputs = [f2input2, f2input3];
const inputs = [
    {
        input: f1input1,
        border: f1input1bg,
        isValid: true,
    },
    {
        input: f1input2,
        border: f1input2bg,
        isValid: true,
    },
    {
        input: f2input1,
        border: f2input1bg,
        isValid: true,
    },
    {
        input: f2input2,
        border: f2input2bg,
        isValid: true,
    },
    {
        input: f2input3,
        border: f2input3bg,
        isValid: true,
    },
];
inputs.forEach(inputSet => {
    inputSet.input.addEventListener('focus', () => {
        if (inputSet.isValid) {
            setBorder([inputSet], 'p');
        }
    });
    inputSet.input.addEventListener('blur', () => {
        if (inputSet.isValid) {
            inputSet.border.classList.remove('animateBorder');
            void inputSet.border.offsetWidth;
            inputSet.border.classList.add('animateBorderRev');
        }
    });
});

emailInputs.forEach((inputField, index) => {
    inputField.addEventListener('keyup', event => {
        if (mailRegex.test(event.target.value)) {
            if (index === 0) {
                let inputSet = [inputs[0]];
                inputSet[0].isValid = true;
                setBorder(inputSet, 'g');
            } else {
                let inputSet = [inputs[2]];
                inputSet[0].isValid = true;
                setBorder(inputSet, 'g');
            }
        } else {
            if (index === 0) {
                let inputSet = [inputs[0]];
                inputSet[0].isValid = false;
                setBorder(inputSet, 'r');
            } else {
                let inputSet = [inputs[2]];
                inputSet[0].isValid = false;
                setBorder(inputSet, 'r');
            }
        }
    });
});

f2PassInputs.forEach((passField, index) => {
    passField.addEventListener('keyup', event => {
        if (passRegex.test(event.target.value)) {
            // We didn't need to validate passwords in login form.
            if (index === 0) {
                let inputSet = [inputs[3]];
                inputSet[0].isValid = true;
                setBorder(inputSet, 'g');
            } else {
                let inputSet = [inputs[4]];
                if (inputSet[0].input.value === f2input2.value) {
                    inputSet[0].isValid = true;
                    setBorder(inputSet, 'g');
                } else {
                    inputSet[0].isValid = false;
                    setBorder(inputSet, 'r');
                }
            }
        } else {
            if (index === 0) {
                let inputSet = [inputs[3]];
                inputSet[0].isValid = false;
                setBorder(inputSet, 'r');
            } else {
                let inputSet = [inputs[4]];
                inputSet[0].isValid = false;
                setBorder(inputSet, 'r');
            }
        }
    });
});

function setBorder(inputSet, color) {
    if (color === prevBorColor && color !== 'p') return;
    let colorCode;
    switch (color) {
        case 'p':
            colorCode = 'rgba(77, 77, 201, 0.67)';
            break;
        case 'r':
            colorCode = 'rgba(201, 77, 77, 1)';
            break;
        case 'g':
            colorCode = 'rgba(85, 197, 29, 1)';
            break;
    }
    if (!inputSet.length) return;
    inputSet.forEach(input => {
        input.border.classList.remove('animateBorder');
        input.border.classList.remove('animateBorderRev');
        input.border.style.backgroundColor = colorCode;
        prevBorColor = color;
        void input.border.offsetWidth;
        input.border.classList.add('animateBorder');
    })
}

joinBtn.addEventListener('click', e => {
    e.preventDefault();
    signupBox.style.top = '0';
});
loginBtn.addEventListener('click', e => {
    e.preventDefault();
    signupBox.style.top = '-120%';
});

// ----------------------------------------------------------------------------
// ---------------------------- Functionality ---------------------------------
// ----------------------------------------------------------------------------
// Login Form:
f1forgotPass.addEventListener('click', () => {
    const emailVal = inputs[0].input.value;
    if (mailRegex.test(emailVal)) {
        auth.sendPasswordResetEmail(emailVal)
            .then(() => {
                setModal('41%', 'rgba(85, 197, 29, 1)', "An email with password reset link has been sent to your provided address.\n*Note that you'll need to continue the process using a computer.", [], 'r');
            })
            .catch(error => {
                errorHandler(error.code, error.message, []);
            });
    } else {
        setModal('41%', 'rgba(201, 77, 77, 1)', 'Please provide your e-mail address to get the password reset link.', [inputs[0]], 'r');
    }

});
f1submitBtn1.addEventListener('click', e => {
    e.preventDefault();
    const emailVal = inputs[0].input.value;
    const passVal = inputs[1].input.value;
    if (mailRegex.test(emailVal) && passVal) {
        auth.signInWithEmailAndPassword(emailVal, passVal)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('Sign In Successful.');
                console.log(user);
                setLoginCookie(user);
                location.href = './todoDashboard.html';
            }).catch((error) => {
            errorHandler(error.code, error.message, [inputs[0], inputs[1]]);
        });
    } else if (!mailRegex.test(emailVal)) {
        setModal('41%', 'rgba(201, 77, 77, 1)', 'Please provide a valid e-mail address to proceed.', [inputs[0]], 'r');
    } else if (!passVal) {
        setModal('53%', 'rgba(201, 77, 77, 1)', 'Please provide a valid password to proceed.', [inputs[1]], 'r');
    }
});
f2submitBtn1.addEventListener('click', e => {
    e.preventDefault();
    const emailVal = inputs[2].input.value;
    const passVal = inputs[3].input.value;
    const repeatPass = inputs[4].input.value;
    if (mailRegex.test(emailVal) && passRegex.test(passVal) && passVal === repeatPass) {
        auth.createUserWithEmailAndPassword(emailVal, passVal)
            .then((userCredential) => {
                // Signed up
                const user = userCredential.user;
                console.log('Sign Up successful!');
                setLoginCookie(user);
                location.href = './todoDashboard.html';
            })
            .catch((error) => {
                errorHandler(error.code, error.message, [inputs[2], inputs[3], inputs[4]]);
            });
    } else if (!mailRegex.test(emailVal)) {
        setModal('37%', 'rgba(201, 77, 77, 1)', 'Please provide a valid e-mail address to proceed.', [inputs[2]], 'r');
    } else if (!passRegex.test(passVal)) {
        setModal('49%', 'rgba(201, 77, 77, 1)', 'Passwords must be 8-32 characters long and contain:\nlowercase and UPPERCASE letters, numbers, and symbols.', [inputs[3]], 'r');
    } else {
        setModal('61%', 'rgba(201, 77, 77, 1)', 'You must enter the same password as in the password field.', [inputs[4]], 'r');
    }
});
[f1submitBtn2, f2submitBtn2].forEach((btn, index) => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        auth.signInWithPopup(provider)
            .then(result => {
                let user = result.user;
                //console.log('IdP data: ', result.additionalUserInfo.profile);
                setLoginCookie(user);
                location.href = './todoDashboard.html';
            })
            .catch(error => {
                /*// The email of the user's account used.
                let email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                let credential = error.credential;*/
                if (index === 0) {
                    errorHandler(error.code, error.message, [inputs[0], inputs[1]]);
                } else {
                    errorHandler(error.code, error.message, [inputs[2], inputs[3], inputs[4]]);
                }
            })
    });
});
/*setTimeout(() => {
    auth.signOut()
        .then(() => {
            // Sign-out successful.
            console.log('Sign-out successful: ');
        })
        .catch(error => {
            // An error happened.
            console.log('An error happened.', error);
        });
}, 500);*/

function setModal(modalTop, modalBG, modalText, inputSet, inputBorderColor) {
    let modalCloseTimeout;
    modalBox.style.top = modalTop;
    $.documentElement.style.setProperty('--modalColor', modalBG);
    modalMessage.innerText = modalText;
    modalBox.style.display = 'block';
    setTimeout(() => {
        modalBox.style.opacity = '100%';
        modalTimeBar.style.width = '0';
        setTimeout(() => {
            $.body.addEventListener('click', modalCloseEvt);
        }, 500);
    }, 5);
    modalCloseTimeout = setTimeout(() => {
        modalBox.style.opacity = '0';
        setTimeout(() => {
            modalBox.style.display = 'none';
            modalTimeBar.style.width = '86%';
            $.body.removeEventListener('click', modalCloseEvt);
        }, 210);
    }, 4000);
    setBorder(inputSet, inputBorderColor);
    function modalCloseEvt(e) {
        if (e.target.closest('#modal') !== modalBox) {
            modalBox.style.opacity = '0';
            clearTimeout(modalCloseTimeout);
            setTimeout(() => {
                modalBox.style.display = 'none';
                modalTimeBar.style.width = '86%';
                $.body.removeEventListener('click', modalCloseEvt);
            }, 210);
        }
    }
}

function setLoginCookie(user) {
    let now = new Date();
    now = now.getTime();
    let expireDate = now + (2 * 7 * 24 * 60 * 60 * 1000); // We'll
    // require login every two weeks.
    expireDate = new Date(expireDate);
    $.cookie = `loginInfo={${user.uid},${user.email},${user.displayName},${user.photoURL}};expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;secure=true;`;
    $.cookie = `loginInfo={${user.uid},${user.email},${user.displayName},${user.photoURL}};expires=${expireDate};path=/;secure=true;`;
    console.log($.cookie);
}

function errorHandler(errorCode, errorMessage, inputSet) {
    if (errorCode === 'auth/network-request-failed') {
        setModal('60%', 'rgba(201, 77, 77, 1)', 'A network error has occurred. Please check your connection and try again.', [], 'r');
    } else if (errorCode === 'auth/invalid-credential') {
        setModal('60%', 'rgba(201, 77, 77, 1)',
            'Invalid email or password. Please try again.',
            inputSet, 'r');
    } else {
        setModal('60%', 'rgba(201, 77, 77, 1)', errorMessage, inputSet, 'r');
    }
}