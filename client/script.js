const socket = io()

const roomButton = document.getElementById('room-button')
const messageInput = document.getElementById('message-input')
const roomInput = document.getElementById('room-input')
const form = document.getElementById('form')




form.addEventListener('submit',e=>{
    e.preventDefault()
    const message = messageInput.value
    const room = roomInput.value
    if(message ==="")return   
    sendMessage(message)
    messageInput.value =""
})

roomButton.addEventListener('click',()=>{
    const room = roomInput.value
    socket.emit('joinRoom',room)
})

function displayMessage(message){
    const li = document.createElement("li")
    li.textContent = message
    document.getElementById("message-container").append(li)
}


function sendMessage(message){
socket.emit('chatMessage',message)
}


socket.on('welcome',message=>{
    console.log(message)
    displayMessage(message.text)
})



socket.on('connects',message=>{
    console.log(message)
    displayMessage(message)
})


socket.on('disconnects',message=>{
    console.log(message)
    displayMessage(message)
})




socket.on('userMessage',message=>{
    console.log(message)
    displayMessage(message)
})