//Points to a div element where user combo will be inserted.
let userDiv;
let addUserResultDiv;

//Set up page when window has loaded
window.setInterval(GroupChat, 2000)


function GroupChat(){
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    //Set up function that is called when reply received from server
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let messages= JSON.parse(xhttp.responseText)
            console.log(messages)
            if(messages.length >0){
                console.log(messages)
                let msgDiv = document.getElementById('UserMessages')
    
                let allMessages = ""
                for(let i = 0; i < messages.length; i++){
                    allMessages += `<div><div style="background: rgb(7, 124, 213);">${messages[i].name}</div><div >${messages[i].Member_Message}</div></div>`
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
    xhttp.open("GET", "/allGroupMessages", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}


function sendingGroupMessage(){
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    //Extract user data
    let newMessage = document.getElementById("newMsg").value;
    //Create object with user data
    let sending = {
        sendMessage: newMessage
    }; 
    //Set up function that is called when reply received from server
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(xhttp.responseText == "User Found"){
                console.log("Sent")
            }
            else{
                document.getElementById("result").innerHTML = xhttp.responseText;
            }
        }
        else{
            document.getElementById("result").innerHTML = "Invalid input.";
        }
    };
    //Send new user data to server
    xhttp.open("POST", "/sendGroupMsg", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send( JSON.stringify(sending) );
}


