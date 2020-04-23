import { isValid, createModal } from './utils'
import { getAuthForm, authWithEmailAndPassword } from './auth'
import { Question } from './question'
import './style.css'

const form = document.getElementById('form')
const input = form.querySelector('#question-input')
const submitBtn = form.querySelector('#submit')
const modalBtn = document.getElementById('modal-btn')

window.addEventListener('load', Question.renderList)
form.addEventListener('submit', submitFormHandler)
modalBtn.addEventListener('click', openModal)
input.addEventListener('input', () => {
    submitBtn.disabled = !isValid(input.value)
})


function submitFormHandler(event) {
    event.preventDefault()

    if (isValid(input.value)) {
        const question = {
            text: input.value.trim(),
            date: new Date().toJSON()
        }

        submitBtn.disabled = true
        //Async request
        Question.create(question).then(() => {
            input.value = ''
            input.className = ''
            submitBtn.disabled = false
        })
    }
}


function openModal() {
    createModal('Authentication', getAuthForm())
    document
        .getElementById('auth-form')
        .addEventListener('submit', authFormHandler, { once: true })
}


function authFormHandler(event) {
    event.preventDefault()

    const btn = event.target.querySelector('button')
    const email = event.target.querySelector('#email').value
    const password = event.target.querySelector('#password').value


    btn.disabled = true
    authWithEmailAndPassword(email, password)
        .then(token => {
            return Question.fetch(token)                            // or simply .then(Question.fetch)

        })
        .then(renderModalAfterAuth)
        .then(() => btn.disabled = false)
}


function renderModalAfterAuth(content) {
    if (typeof content === 'string') {
        createModal('Error', content)
    } else {
        createModal('Questioon List', Question.listToHTML(content))
    }
}