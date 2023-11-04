window.onload = showChats

function showChats(){
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    //Set up function that is called when reply received from server
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let chats= JSON.parse(xhttp.responseText)
            if(chats.length >0){
                let msgDiv = document.getElementById('allChats')
                let allMessages = ""
                for(let i = 0; i < chats.length; i++){
                    allMessages+=`<div style="background: rgb(7, 124, 213); font-weight: 800; font-family:Georgia, 'Times New Roman', Times, serif;" ><img src="img/user.png" style="height: 30px;"></img>${chats[i].name}</div>`
                    allMessages+=`<div><button style="border: 10px;border-color: blue; font-weight: 800; text-align: center; height: 33px" onclick='startMessage(${chats[i].id})'>START CHAT</button></div>`
                }
                //Add users to page.
                msgDiv.innerHTML = allMessages;
            }
        }
        else{
            console.log("error")
        }
    };
    //Send new user data to server
    xhttp.open("GET", "/showChats", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

