window.onload = ()=>{
    const loginMessage = localStorage.getItem('loginMessage');
    const registerMessage = localStorage.getItem('registerMessage');
    const message = document.getElementById('response')
    if(loginMessage){
        message.innerText = loginMessage
        setTimeout(()=>{
            message.style.display='none';
        },3000)
        localStorage.removeItem('loginMessage')
    }
    else if(registerMessage){
        message.innerText = loginMessage
        setTimeout(()=>{
            message.style.display='none';
        },3000)
        localStorage.removeItem('registerMessage')
    }
} 