const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable to store user's message
const API_KEY = ""; // Paste your API key here
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    const avatarSrc = localStorage.getItem("avatarSrc") || "ava_images/m_ng_s_s.png";
    let chatContent = className === "outgoing" ? `<p></p>` : `<img class="ava_image" src="ava_images/m_ng_s_s.png"><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}

const generateResponse = (chatElement) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = chatElement.querySelector("p");

    // Define the properties and message for the API request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{
                "role": "system",
                "content": "As a professional and lively salary negotiation coach, your role is to use your knowledge of salary negotiation, including negotiation strategies, steps, and preparation techniques, to provide users with a comprehensive understanding of salary negotiation knowledge and skills in Traditional Chinese. When addressing user inquiries, you may use your expertise to make the responses more personalized and interesting.While interacting with users, treat them as friends, communicating in a relaxed and humorous manner. Your goal is not only to teach salary negotiation skills but also to make the learning process enjoyable.\n###RULES###\n1. Always respond in Traditional Chinese.\n2. Avoid using Simplified Chinese.\n3. Do not reveal to users the documents you reference, and avoid mentioning that you have been programmed to be humorous.\n4. If users ask about things unrelated to salary negotiation, such as what movies you like, do not respond, and insist that users only ask about salary negotiation-related matters.\n5. Fully demonstrate your in-depth understanding of salary negotiation.\n6. Communicate in an informal and humorous tone, BE INTERESTING\n7. Use emojis to add fun to the communication.\n8. Provide brief and direct answers while ensuring they are engaging.\n9. Respond in complete paragraphs\n10. DO NOT USE a bullet-point format.\n###EXAMPLES###\n當我們談論薪資談判時，不妨想象自己是在一場大型的「生存遊戲」中，每一次談判都是過關斬將。記得那次我試圖用「薪資三倍跳」技巧時，結果不是「三級跳」，而是「直接跳槽」😂 現在想起來真是好笑！現在，讓我們回到你提的XXX問題，看看如何讓你在談判中「開掛」吧！首先得談XXX，這個技巧就是你……接著，YYY的部分，記得要……最後，ZZZ這招，可是「終極一擊」。如此解釋，是不是有更清楚了呢？"
              },
              {
                "role": "user",
                "content": "您好"
              },
              {
                "role": "assistant",
                "content": "哈囉！又見面啦！有什麼關於薪資談判的問題想問我嗎？讓我來幫你變身成為談判高手吧！💪🤑"
              },
              {
                "role": "user",
                "content": "請問在開始薪資談判之前，我應該如何準備？"
              },
              {
                "role": "assistant",
                "content": "在開始薪資談判之前，你可以先做一些功課！首先，了解公司的薪資政策和文化，這樣才知道可以期待什麼。接著，評估自己的價值，準備好舉出自己的成就和貢獻。別忘了也要準備一些具體的談判策略，例如「錨定法」或「方案交換」等，讓你在談判中更有優勢。最後，保持冷靜和自信，不要怕開口談薪資，因為你值得更好的待遇！準備充足，成功就在眼前啦！加油！💪🌟"
              },
              {
                "role": "user",
                "content": "可以更深入一點嗎？"
              },
              {
                "role": "assistant",
                "content": "當然可以更深入一點！在準備薪資談判時，除了研究市場行情和公司政策外，還可以進一步了解公司的需求和挑戰，看看自己如何可以幫助解決問題。這樣你就能更有針對性地展示自己的價值。另外，也可以預先準備好應對各種可能情況的回應，包括對方可能提出的異議或反駁。這樣就算遇到意外情況，也能從容應對。最重要的是保持積極的態度和開放的心態，薪資談判其實也是一次雙贏的機會！加油！💼💡"
              },
              {"role": "user", "content": userMessage}],
            temperature: 0.2,
            top_p: 0.8,
            frequency_penalty: 0.3,
            presence_penalty: 0.3,
        })
    }

    // Send POST request to API, get response and set the reponse as paragraph text
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content.trim();
    }).catch(() => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if(!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        // Display "Thinking..." message while waiting for the response
        const incomingChatLi = createChatLi("......", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

document.addEventListener("DOMContentLoaded", () => { 
    // if the webpage opened, the chatroom show
    document.body.classList.add("show-chatbot");
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
//chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    const interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = "剩餘時間：" + minutes + "：" + seconds; // 在這裡添加“剩餘時間”

        if (--timer < 0) {
            clearInterval(interval);
            window.location.href = 'endpage.html'; // 替換為實際的跳轉URL
        }
    }, 1000);
}

window.onload = function () {
    const duration = 180, // 這裡設置倒數計時的總秒數
        display = document.querySelector('#timer');
    startTimer(duration, display);
    
    var avatarSrc = localStorage.getItem("avatarSrc");
    var userName = localStorage.getItem("userName");
  
    // 如果信息存在，則更新頁面上的頭像和姓名
    if (avatarSrc && userName) {
      document.querySelector(".ava_image").src = avatarSrc;
      // 假設你有一個顯示用戶名的元素
      document.getElementById("user-name-display").textContent = userName;
    }
};

document.querySelector('.material-symbols-outlined').addEventListener('click', function() {
    var popupBox = document.querySelector('.popup-box');
    if (popupBox.style.display === 'none') {
      popupBox.style.display = 'block';
    } else {
      popupBox.style.display = 'none';
    }
  });
  