const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".chatbot-toggler-2");


let userMessage;
const API_KEY = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
const inputInitHeight = chatInput.scrollHeight;

// Create a chat <li> element with passed message and class name
const createChatLi = (message ,className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat",className);
    let chatContent = className === "outgoing" ? `<p></p>` :  `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_URL= " https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p")

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user",content: userMessage}]
        })
    }
    // send POST request to API,get response//
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
        console.log(data);
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong.Please try again";
    }).finally(() => chatbox.scrollTo(0,chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the users message to the chatbox//
    chatbox.appendChild(createChatLi (userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        // display thinking message while waiting for response//
        const incomingChatLi = createChatLi ("Thinking...", "incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
     }, 600);

}

chatInput.addEventListener("input", ()=> {
    // Adjust height
     chatInput.style.height = `${inputInitHeight}px`;
     chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e)=> {
    // if enter key is pressed without shift key and the window//
    // width is greater than 800 handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
        e.preventDefault();
        handleChat();
    }
});    


sendChatBtn.addEventListener("click",handleChat);
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"))
// Assuming chatbotCloseBtn is the close button element
chatbotCloseBtn.addEventListener("click", () => {
    // Close the chatbot by removing the 'show-chatbot' class from the body
    document.body.classList.remove("show-chatbot");
});



