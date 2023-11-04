var i = 0;
var txt = 'The Chat Zone ';
var speed = 175;

window.onload = typeWriter;
let currenturl =window.location.href
let oururl = currenturl.split("/")


function typeWriter() {
    if (i < txt.length) {
      document.getElementById("demo").innerHTML += txt.charAt(i);
      i++;
      if (i == txt.length) {
        document.getElementById("demo").innerHTML = "";
        i=0;
        clearTimeout(typeWriter);
      }
      setTimeout(typeWriter, speed);
    }
  
}


function registerUser(){
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();

    //Extract user data
    let usrName = document.getElementById("name").value;
    let usrEmail = document.getElementById("mail").value;
    let usrPhone = document.getElementById("phone").value;
    let usrAddress = document.getElementById("address").value;
    let usrAbout = document.getElementById("about").value;
    let usrPassword = document.getElementById("password").value;

    //Create object with user data
    let usrObj = {
        name: usrName,
        email: usrEmail,
        phone:usrPhone,
        address:usrAddress,
        about:usrAbout,
        password:usrPassword
    };
    
    //Set up function that is called when reply received from server
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("result").innerHTML = xhttp.responseText;
        }
        else{
            document.getElementById("result").innerHTML = "Invalid input.";
        }
    };

    //Send new user data to server
    xhttp.open("POST", "/registerUser", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send( JSON.stringify(usrObj) );
}

function GroupRegister(){
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();

    //Extract user data
    let groupName = document.getElementById("groupName").value;


    //Create object with user data
    let usrObj = {
        name: groupName,
    };
    
    //Set up function that is called when reply received from server
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("outcome").innerHTML = xhttp.responseText;
        }
        else{
            document.getElementById("outcome").innerHTML = "Invalid input.";
        }
    };

    //Send new user data to server
    xhttp.open("POST", "/registerGroup", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send( JSON.stringify(usrObj) );
}




function userProfile(){
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();    
    //Set up function that is called when reply received from server
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(xhttp.responseText == "User Found"){
                console.log("SUCCESS !")
            }
        }
        else{
            document.getElementById("result").innerHTML = "Invalid input.";
        }
    };

    //Send new user data to server
    xhttp.open("POST", "/logged", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}


function LoginUser(){
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();

    //Extract user data
    let LoginEmail = document.getElementById("loginMail").value;
    let LoginPassword = document.getElementById("loginPassword").value;

    //Create object with user data
    let LoginObj = {
        email: LoginEmail,
        password:LoginPassword
    };
    
    //Set up function that is called when reply received from server
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(xhttp.responseText == "User Found"){
                
                window.location.href ="/profile"
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
    xhttp.open("POST", "/LoginUser", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send( JSON.stringify(LoginObj) );
}



function logoff(){
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    
    //Set up function that is called when reply received from server
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("logged off")
            window.location.href ="/"
        }
        else{
            console.log("Error")
        }
    };

    //Send new user data to server
    xhttp.open("POST", "/logout", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}


function SendSearch(){
        //Set up XMLHttpRequest
        let xhttp = new XMLHttpRequest();
        //Extract user data
        let searchInput = document.getElementById("search").value;
        
    
        //Create object with user data
        let searchObj = {
            searchQuery: searchInput,
        };
        
        //Set up function that is called when reply received from server
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if(xhttp.responseText == "User Found"){
                    window.location.href ="/search"
                }
                
            }
            else{
                document.getElementById("result").innerHTML = "Page Error.";
            }
        };
    
        //Send new user data to server
        xhttp.open("POST", "/userSearch", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send( JSON.stringify(searchObj) );
}

function SendGroupSearch(){
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    //Extract user data
    let searchInput = document.getElementById("groupsearch").value;
    console.log(searchInput)

    //Create object with user data
    let searchObj = {
        searchQuery: searchInput,
    };
    
    //Set up function that is called when reply received from server
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(xhttp.responseText == "User Found"){
                window.location.href ="/userGroupSearch"
            }
            
        }
        else{
            document.getElementById("result").innerHTML = "Page Error.";
        }
    };

    //Send new user data to server
    xhttp.open("POST", "/userSearch", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send( JSON.stringify(searchObj) );
}

function startMessage(numb){
    console.log(numb)
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    //Create object with user data
    let MessageObj = {
        MessageSent: numb,
    };
    //Set up function that is called when reply received from server
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(xhttp.responseText == "Stored"){
                loadMsg()
                console.log("reach")
            }
        }
        else{
            console.log("done")
        }
    };
    //Send new user data to server
    xhttp.open("POST", "/MsgID", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send( JSON.stringify(MessageObj) );
}

function startGroupMessage(numb){
    console.log(numb)
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    //Create object with user data
    let MessageObj = {
        MessageSent: numb,
    };
    //Set up function that is called when reply received from server
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(xhttp.responseText == "Stored"){
                window.location.href ="/GroupChatting"
                console.log("reach")
            }
        }
        else{
            console.log("done")
         
        }
    };
    //Send new user data to server
    xhttp.open("POST", "/MsgID", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send( JSON.stringify(MessageObj) );
}

function loadMsg(){
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    //Set up function that is called when reply received from server
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Successfull")
            if(xhttp.responseText == "done"){
                window.location.href ="/chattingNow"
            }
                
            if(xhttp.responseText == "Not found"){
                MakeChat()
            }
 
        }
        else{
            console.log("done")
            
        }
    };
    //Send new user data to server
    xhttp.open("POST", "/twoChat", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

function MakeChat(){
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    //Set up function that is called when reply received from server
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(xhttp.responseText == "created"){
                loadMsg()
            }   
        }
        else{
            console.log("error")
        }
    };
    //Send new user data to server
    xhttp.open("POST", "/makeChat", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}










function registerPage(){
    document.getElementById("contain").innerHTML=`<div>
    <img class="phone" src="img/phone.png")></img>
    <p id="demo"></p>
  </div>
  
  <img class="msg" src="img/msg.png")></img>
  <div class="Register"> 
    <div class="item2">
        <div><img class="logo" src="img/chath.png")></img></div>
        <div><b>LOGIN</b></div>
    </div>
    <div class="item3">
        <div><b>USERNAME </b></div>
    </div>
    <div class="item3">
        <input id="name"></input>
    </div>
    <div class="item3">
        <div><b>EMAIL</b></div>
    </div>
    <div class="item3">
        <input id="mail"></input>
    </div>
    <div class="item3">
        <div><b>PHONE</b></div>
    </div>
    <div class="item3">
        <input id="phone"></input>
    </div>
    <div class="item3">
        <div><b>ADDRESS</b></div>
    </div>
    <div class="item3">
        <input id="address"></input>
    </div>
    <div class="item3">
        <div><b>ABOUT</b></div>
    </div>
    <div class="item3">
        <input id="about"></input>
    </div>
    <div class="item3">
        <b>PASSWORD</b>
    </div>
    <div class="item3">
        <input id="password"></input>
    </div>
    <div class="item8">
   
        <button class="btn1" onclick="registerUser()">Enter</button>
        <div class="item4">Don't have an account?Register</div>
        <div id="result" style="color: red;"></div>
    </div>
  </div>`
  
  }
  