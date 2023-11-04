//Import the express and body-parser modules
const express = require('express');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
//Import the mysql module
const mysql = require('mysql');
const { json } = require('express/lib/response');

//Create a connection pool with the user details
const connectionPool = mysql.createPool({
    connectionLimit: 50,
    host: "localhost",
    user: "root",
    password: "",
    database: "demo",
    debug: false
});




//Create express app and configure it with body-parser
const app = express();
app.use(bodyParser.json());

//Set up express to serve static files from the directory called 'public'
app.use(express.static('public'));

app.use(
    expressSession({
        secret: 'cst2120 secret',
        cookie: { maxAge: 7200000 },
        resave: false,
        saveUninitialized: false
    })
);
//Data structure that will be accessed using the web service
let userArray = [];

//Set up application to handle GET requests sent to the user path

app.get('/register', getRegisterPage);
app.get('/users/*', handleGetRequest);//Returns user with specified ID
app.get('/users', handleGetRequest);//Returns all users
app.get('/profile',viewProfile)
app.get('/search',Searching)
app.get('/userGroupSearch',groupSearching)
app.get('/allMessages',showMsg)
app.get('/chattingNow',chatSection)
app.get('/GroupChatting',GroupChatSection)
app.get('/showChats',getChats)
app.get('/showGroupChats',getGroupChats)

app.get('/Chats',usersChats)
app.get('/Groups',Groups)
app.get('/allGroupMessages',showGroupMsg)
app.get('/makeGroup',createGroup)


//Set up application to handle POST requests sent to the user path
app.post('/users', handlePostRequest);//Adds a new user
app.post('/registerUser',postRegister);
app.post('/registerGroup',postGroup);
app.post('/LoginUser', login);
app.post('/logout', logout);//Logs user out
app.post('/userSearch',storeSearch)
app.post('/MsgID',storeMsgID)
app.post('/twoChat',twoUserChat)
app.post('/makeChat',createChat)
app.post('/sendTheMsg',userMessageSent)
app.post('/sendGroupMsg',GroupMessageSent)

//app.post('/logged',viewProfile)


//Start the app listening on port 8080
app.listen(8080);

//Handles GET requests to our web service
function handleGetRequest(request, response){
    //Split the path of the request into its components
    var pathArray = request.url.split("/");

    //Get the last part of the path
    var pathEnd = pathArray[pathArray.length - 1];

    //If path ends with 'users' we return all users
    if(pathEnd === 'users'){
        response.send(userArray);
    }

    //If the last part of the path is a valid user id, return data about that user
    else if(pathEnd in userArray){
        response.send(userArray[pathEnd]);
    }

    //The path is not recognized. Return an error message
    else
        response.send("{error: 'Path not recognized'}");
}

//Handles POST requests to our web service
function handlePostRequest(request, response){
    //Output the data sent to the server
    let newUser = request.body;
    console.log("Data received: " + JSON.stringify(newUser.name) + ", mail: " + JSON.stringify(newUser.email)+", phone: " + JSON.stringify(newUser.phone)+", address: " + JSON.stringify(newUser.address)+", about: " + JSON.stringify(newUser.about)+", password: " + JSON.stringify(newUser.password));
    let sqlAddUser= `INSERT INTO customer (email,address,NAME,about,PASSWORD,phone)VALUES(${newUser.email},${newUser.address},${newUser.name},${newUser.about},${newUser.password},${newUser.phone})`
    connectionPool.query(sqlAddUser, (err, result) => {
        if (err){//Check for errors
            console.error("Error executing query: " + JSON.stringify(err));
        }
        else{
            console.log(JSON.stringify(result.length));
        }
    });
    //Add user to our data structure
    userArray.push(newUser);
    console.log(userArray);
    //Finish off the interaction.
    response.send("User added successfully.");
}

async function getCustomers(email,name){
    //Build query
    let sql = `SELECT id FROM customer WHERE (email="${email}" OR name="${name}")`;
    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(sql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                resolve(result);
            }
        });
    });
}

async function VerifyGroup(name){
    //Build query
    let sql = ` SELECT group_details.GroupName FROM group_details WHERE group_details.GroupName = "${name}"`;
    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(sql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                resolve(result);
            }
        });
    });
}

async function insertMSGID(idOne,idTwo){
    //Build query
    let sql = `INSERT INTO chat_details (user_one_ID,user_two_ID)VALUES(${idOne},${idTwo})`;
    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(sql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                resolve(result);
            }
        });
    });
}


async function sendMsg(chatID,message,senderID){
    //Build query
    let sql = `INSERT INTO messages (Chat_ID,Message,SenderID,Date)VALUES(${chatID},"${message}","${senderID}",NOW())`;
    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(sql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                resolve(result);
            }
        });
    });
}

async function sendGroupMsg(memberID,groupsID,message){
    //Build query
    let sql = `INSERT INTO group_messages (group_id,Member_id,Member_Message,Date)VALUES(${groupsID},${memberID},"${message}",NOW())`;
    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(sql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                resolve(result);
            }
        });
    });
}

async function FindLogin(email,userPassword){
    //Build query
    let sql = `SELECT id FROM customer WHERE (email="${email}" AND password="${userPassword}")`
    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(sql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                resolve(result);
            }
        });
    });
}

async function getAbout(sessionID){
    //Build query
    let sql = `SELECT name,about FROM customer WHERE id=${sessionID}`
    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(sql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                resolve(result);
            }
        });
    });
}

async function SearchForUser(usersName){
    //Build query
    
    let sql = `SELECT id,name FROM customer WHERE name ="${usersName}"`
    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(sql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                resolve(result);
            }
        });
    });
}

async function SearchForGroup(groupName){
    //Build query
  
    let sql = `SELECT id,GroupName FROM group_details WHERE GroupName ="${groupName}"`
    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(sql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                resolve(result);
            }
        });
    });
}

async function FindGroup(groupsID){
    //Build query
   
    let sql = `
    SELECT customer.name, group_messages.Member_Message FROM group_details 
    INNER JOIN group_messages ON group_details.id = group_messages.group_id
    INNER JOIN customer ON customer.id = group_messages.Member_id 
    WHERE(group_messages.group_id=${groupsID}) 
    `
    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(sql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                resolve(result);
            }
        });
    });
}

async function FindMsg(chatID){
    //Build query
   
    let sql = `
    SELECT customer.name, messages.Message FROM chat_details 
    INNER JOIN messages ON chat_details.Chat_ID = messages.Chat_ID
    INNER JOIN customer ON customer.id = messages.SenderID 
    WHERE(messages.Chat_ID=${chatID}) 
    `
    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(sql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                resolve(result);
            }
        });
    });
}



function showGroupMsg(request, response){
    console.log("SHOW GROUP MSG REACHED")
    console.log(request.session.userChat)
    if(!("userid" in request.session)){
        console.log(`login false`)
        response.redirect("/")
    }
    else{
        FindGroup(request.session.usersMsg).then ( result => {
            let allMsgs = JSON.stringify(result)
            if(allMsgs.length>0){
                response.send(JSON.stringify(result))
            }

            else{
                response.send(JSON.stringify([]))
            }
            
         
        }).catch( err => {//Handle the error
            console.error(JSON.stringify(err));
        });
    }
}


async function chatTitle(chatID,userID){
    //Build query
    let sql=`
    SELECT customer.name FROM chat_details 
    INNER JOIN customer ON customer.id = chat_details.user_one_ID OR customer.id = chat_details.user_two_ID
    WHERE(chat_details.Chat_ID=${chatID} AND (customer.id<>${userID} OR customer.id<>${userID})) 
    `
    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(sql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                resolve(result);
            }
        });
    });
}

async function GroupTitle(groupId){
    //Build query
    let sql=`SELECT group_details.GroupName FROM group_details WHERE(group_details.id=${groupId}) `
    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(sql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                resolve(result);
            }
        });
    });
}


async function FindMessages(userOne,userTwo){
    //Build query
    let sql = `SELECT chat_details.Chat_ID FROM chat_details WHERE((chat_details.user_one_ID=${userOne} AND chat_details.user_two_ID=${userTwo}) OR (chat_details.user_one_ID=${userTwo} AND chat_details.user_two_ID=${userOne}))`
    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(sql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                resolve(result);
            }
        });
    });
}

async function showChats(usersID){
    //Build query
    let sql = `
    SELECT chat_details.Chat_ID,customer.name,customer.id FROM chat_details
    INNER JOIN customer ON 
    (customer.id = chat_details.user_one_ID OR customer.id = chat_details.user_two_ID)
    WHERE (chat_details.user_one_ID=${usersID} OR chat_details.user_two_ID=${usersID})
    AND customer.id<>${usersID}
    `
    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(sql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                resolve(result);
            }
        });
    });
}

async function showGroupChats(usersID){
    //Build query
    let sql = `
    SELECT DISTINCT group_details.id ,group_details.GroupName FROM group_messages
    INNER JOIN group_details ON group_details.id = group_messages.group_id
    WHERE group_messages.Member_id=${usersID}    
    `
    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(sql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                resolve(result);
            }
        });
    });
}

function getChats(request, response){
    console.log("GET CHATS REACHED")    
    if(!("userid" in request.session)){
        console.log(`login false`)
        response.redirect("/")
    }
    else{
        showChats(request.session.userid).then ( result => {
            response.send(JSON.stringify(result))
        }).catch( err => {//Handle the error
            console.error(JSON.stringify(err));
        });
    }
}

function getGroupChats(request, response){
    console.log("GET CHATS REACHED")    
    if(!("userid" in request.session)){
        console.log(`login false`)
        response.redirect("/")
    }
    else{
        showGroupChats(request.session.userid).then ( result => {
            response.send(JSON.stringify(result))
        }).catch( err => {//Handle the error
            console.error(JSON.stringify(err));
        });
    }
}


function userMessageSent(request, response){
    let usrlogin = request.body;
    let convertDetails = JSON.stringify(usrlogin);
    let usrMsg = JSON.parse(convertDetails);
    let theMessage = usrMsg.sendMessage
    console.log("SHOW MSG REACHED")
    console.log(request.session.userChat)
    if(!("userid" in request.session)){
        console.log(`login false`)
        response.redirect("/")
    }
    else{
        sendMsg(request.session.userChat,theMessage,request.session.userid).then ( result => {
            response.send(JSON.stringify(result))
        }).catch( err => {//Handle the error
            console.error(JSON.stringify(err));
        });
    }
}

function GroupMessageSent(request, response){
    let usrlogin = request.body;
    let convertDetails = JSON.stringify(usrlogin);
    let usrMsg = JSON.parse(convertDetails);
    let theMessage = usrMsg.sendMessage
    console.log("SHOW MSG REACHED")
    console.log(request.session.userChat)
    if(!("userid" in request.session)){
        console.log(`login false`)
        response.redirect("/")
    }
    else{
        sendGroupMsg(request.session.userid,request.session.usersMsg,theMessage).then ( result => {
            response.send(JSON.stringify(result))
        }).catch( err => {//Handle the error
            console.error(JSON.stringify(err));
        });
    }
}

function showMsg(request, response){
    console.log("SHOW MSG REACHED")
    console.log(request.session.userChat)
    if(!("userid" in request.session)){
        console.log(`login false`)
        response.redirect("/")
    }
    else{
        FindMsg(request.session.userChat).then ( result => {
            let allMsgs = JSON.stringify(result)
            if(allMsgs.length>0){
                response.send(JSON.stringify(result))
            }

            else{
                response.send(JSON.stringify([]))
            }
            
        }).catch( err => {//Handle the error
            console.error(JSON.stringify(err));
        });
    }
}


function createChat(request, response){
    console.log('CREATE CHAT REACHED')
    console.log(request.session.userid)
    console.log(request.session.usersMsg)
    if(!("userid" in request.session)){
        console.log(`login false`)
        response.redirect("/")
    }
    else{
        console.log("rrr")
        insertMSGID(request.session.userid,request.session.usersMsg).then ( result => {
            response.send("created")
        }).catch( err => {//Handle the error
            console.error(JSON.stringify(err));
        });
    }
}

function twoUserChat(request, response){
    console.log('TWO USER REACHED')
    console.log(request.session.userid)
    console.log(request.session.usersMsg)
    if(!("userid" in request.session)){
        
        console.log(`login false`)
        response.redirect("/")
    }
    else{
        console.log("rrr")
        FindMessages(request.session.userid,request.session.usersMsg).then ( result => {
            //Output employees.

 
            if(result.length > 0){
                console.log(result[0])
                let convertResult=JSON.stringify(result[0])
                let parsResult = JSON.parse(convertResult)
                let ChatRequest = parsResult.Chat_ID
                request.session.userChat = ChatRequest
                console.log(parsResult)
                console.log(request.session.userChat)
                response.send("done")
            }
            else{
                response.send("Not found")
            }
        
        }).catch( err => {//Handle the error
            console.error(JSON.stringify(err));
        });
    }
}



function login(request, response){
    let usrlogin = request.body;
    let loginChecker=0;
    let convertDetails = JSON.stringify(usrlogin);
    let loginDetails = JSON.parse(convertDetails);

    console.log("Name: " + loginDetails.email + " password: " + loginDetails.password);

    //Look to see if we have a matching user
    let userfound = false;
    FindLogin(loginDetails.email,loginDetails.password).then ( result => {
        //Output employees.
        console.log(JSON.stringify(result));
        let convertFinding = JSON.stringify(result)
        let setFinding = JSON.parse(convertFinding)
        let FinalConversion =setFinding[0].id
        loginChecker=result.length
        //Do something else
        console.log("Do something else");
        
        loginChecker=result.length
        if(loginChecker==0){
            //Add user to our data structure
    
            //Finish off the interaction.
            response.send("User Not Found.");
            console.log(loginChecker)
            console.log(FinalConversion)
        }
        if(loginChecker>0){
            request.session.userid = FinalConversion;
            response.send("User Found")

        }
    
    }).catch( err => {//Handle the error
        console.error(JSON.stringify(err));
    });

}

function logout(request, response){
    //Destroy session.
    request.session.destroy( err => {
        if(err)
            response.send('{"error": '+ JSON.stringify(err) + '}');
        else
        response.redirect("/")
        
    });
}


function postRegister(request, response){
    //Output the data sent to the server
    let checker=0;
    let registeringUser=request.body;
    let convertRegister = JSON.stringify(registeringUser);
    let newUser = JSON.parse(convertRegister);

    getCustomers(newUser.email,newUser.name).then ( result => {
        //Output employees.
        console.log(JSON.stringify(result));
        checker=result.length
        //Do something else
        console.log("Do something else");
        console.log(result.length)
        console.log(checker)
        checker=result.length
        if(checker==0){
            
            let sqlAddUser= `INSERT INTO customer (email,address,NAME,about,PASSWORD,phone)VALUES("${newUser.email}","${newUser.address}","${newUser.name}","${newUser.about}","${newUser.password}",${parseInt(newUser.phone)})`
            connectionPool.query(sqlAddUser, (err, result) => {
                if (err){//Check for errors
                    console.error("Error executing query: " + JSON.stringify(err));
                }
                else{
                    console.log(JSON.stringify(result.length));
                }
            });
            //Add user to our data structure
            //Finish off the interaction.
            response.send("User added successfully.");
            console.log(checker)
        }
        if(checker>0){
            response.send("Details are already used")
            console.log(checker)
        }
    
    }).catch( err => {//Handle the error
        console.error(JSON.stringify(err));
    });
}

function postGroup(request, response){
    //Output the data sent to the server
    let checker=0;
    let registeringUser=request.body;
    let convertRegister = JSON.stringify(registeringUser);
    let newGroup = JSON.parse(convertRegister);
    VerifyGroup(newGroup.name).then ( result => {
        //Output employees.
        console.log(JSON.stringify(result));
        checker=result.length
        //Do something else
        console.log("Do something else");
        console.log(result.length)
        console.log(checker)
        checker=result.length
        if(checker==0){
            let sqlAddUser= `INSERT INTO group_details (GroupName)VALUES("${newGroup.name}")`
            connectionPool.query(sqlAddUser, (err, result) => {
                if (err){//Check for errors
                    console.error("Error executing query: " + JSON.stringify(err));
                }
                else{
                    console.log(JSON.stringify(result.length));
                }
            });
            //Add user to our data structure
            //Finish off the interaction.
            response.send("User added successfully.");
            console.log(checker)
        }
        if(checker>0){
            response.send("Details are already used")
            console.log(checker)
        }
    
    }).catch( err => {//Handle the error
        console.error(JSON.stringify(err));
    });
}


function viewProfile(request, response){
    //Split the path of the request into its components
    profileFinder=0
    if(!("userid" in request.session)){
        
        console.log(`login false`)
        response.redirect("/")
    }
    else{
        getAbout(request.session.userid).then ( result => {
            //Output employees.
            console.log(JSON.stringify(result));
            let convertFinding = JSON.stringify(result)
            let setFinding = JSON.parse(convertFinding)
            let profileName = setFinding[0].name
            let profileAbout = setFinding[0].about
            console.log(profileName)
            console.log(profileAbout)
            
            //Do something else
            console.log("Do something else");
            response.send(`
            <!DOCTYPE html>
            <html>
                <head>
                    <link rel="stylesheet" href="styling.css">
                    <script src="client.js"></script>
                </head>
                <body>
                    <div><header><img class="logo" src='img/chath.png')></img>Let's Chat</header></div>
                    
                    <div class="sidenav" >
                        <input type="text" id="search" placeholder="Find user....."><button class="searchbtn" onclick="SendSearch()"><img src="img/searchIcon.png" ></img></button></input>
                        <a href="/profile"><img src="img/head.png">PROFILE</img></a>
                        <a href="/Chats"><img src="img/chati.png">CHAT</img></a>
                        <a href="/Groups"><img src="img/group.png"> GROUP CHAT</img></a>
                        <a onclick="logoff()"><img src="img/logout.png"> LOG OUT</img></a>
                    </div>
                    <div class="title">PROFILE</div>
                    <div class="chatname"></div>
                    
                    <div class="contain">
                        <p id="demo" hidden></p>
                        <div class="innerpage">
                            <div class="profileStyle">
                                <div><img src="img/profilec.png" class="profileIMG"></img></div>
                                <div>NAME: ${profileName}</div>
                                <div style="background: rgb(0, 72, 255); color: white;">ABOUT</div>
                                <div style="border: 2px solid rgb(0, 72, 255);">${profileAbout}</div>
                            </div>
                            
            
                        </div>
                        
                    </div>
            
                    <footer></footer>
                </body>
            </html>`)
        
        }).catch( err => {//Handle the error
            console.error(JSON.stringify(err));
        });
    }
    
}

function storeSearch(request, response){
    if(!("userid" in request.session)){
        
        console.log(`login false`)
        response.redirect("/")
    }
    else{
        let registeringUser=request.body;
        let convertSearch = JSON.stringify(registeringUser);
        let userSearch = JSON.parse(convertSearch);
        console.log(userSearch)
        let FinalSearch =userSearch.searchQuery
        request.session.userSearch = FinalSearch
        response.send("User Found")
    }
}

function storeMsgID(request, response){
    if(!("userid" in request.session)){
        
        console.log(`login false`)
        response.redirect("/")
    }
    else{
        let MessageEntered=request.body;
        let otherUserID = MessageEntered.MessageSent
        request.session.usersMsg = otherUserID
        response.send("Stored")
    }
}

async function chatSection(request, response){
    //Split the path of the request into its components
    if(!("userid" in request.session)){
        
        console.log(`login false`)
        response.redirect("/")
    }
    else{
        chatTitle(request.session.userChat,request.session.userid).then ( result => {
            let namefound =JSON.stringify(result[0])
            let convertName =JSON.parse(namefound)
            let FinalName = convertName.name
            console.log(FinalName)
            response.send(`
            <!DOCTYPE html>
            <html>
                <head>
                    <link rel="stylesheet" href="styling.css">
                    <script src="client.js"></script>
                    <script src="chat.js"></script>
                </head>
                <body>
                    <div id="changePage">
                        <div>
                        <div><header><img class="logo" src='img/chath.png')></img>Let's Chat</header></div>
                        <div class="sidenav" >
                            <a href="/profile"><img src="img/head.png">PROFILE</img></a>
                            <a href="/Chats"><img src="img/chati.png">CHAT</img></a>
                            <a href="/Groups"><img src="img/group.png"> GROUP CHAT</img></a>
                            <a onclick="logoff()"><img src="img/logout.png"> LOG OUT</img></a>
                        </div>
                        <div class="title">CHAT</div>
                        <div class="chatname">${FinalName}</div>
                        <p id="demo" hidden></p>
                        <div class="contain">
                            <div class="innerpage">
                                <div class="msgdesign" id="UserMessages">                        
                                </div>
                            </div>
                            <div class="sendingMsg">
                                <span><input type="text" id="newMsg"></input><span>
                                <span><button onclick="sendingMessage()">SEND</button></span>
                            </div>
                        </div>
                        <footer></footer>
                    </div>
                </body>
            </html>
            `)
            
        }).catch( err => {//Handle the error
            console.error(JSON.stringify(err));
        });
    }
}

async function GroupChatSection(request, response){
    //Split the path of the request into its components
    if(!("userid" in request.session)){
        
        console.log(`login false`)
        response.redirect("/")
    }
    else{
        GroupTitle(request.session.usersMsg).then ( result => {
            let GroupsNamefound =JSON.stringify(result[0])
            let convertGroupsName =JSON.parse(GroupsNamefound)
            let GroupsName = convertGroupsName.GroupName
            console.log(GroupsName)
            response.send(`
            <!DOCTYPE html>
            <html>
                <head>
                    <link rel="stylesheet" href="styling.css">
                    <script src="client.js"></script>
                    <script src="groupchat.js"></script>
                </head>
                <body>
                    <div id="changePage">
                        <div>
                        <div><header><img class="logo" src='img/chath.png')></img>Let's Chat</header></div>
                        <div class="sidenav" >
                            <a href="/profile"><img src="img/head.png">PROFILE</img></a>
                            <a href="/Chats"><img src="img/chati.png">CHAT</img></a>
                            <a href="/Groups"><img src="img/group.png"> GROUP CHAT</img></a>
                            <a onclick="logoff()"><img src="img/logout.png"> LOG OUT</img></a>
                        </div>
                        <div class="title">GROUP CHAT</div>
                        <div class="chatname">${GroupsName}</div>
                        <p id="demo" hidden></p>
                        <div class="contain">
                            <div class="innerpage">
                                <div class="msgdesign" id="UserMessages">                        
                                </div>
                            </div>
                            <div class="sendingMsg">
                                <span><input type="text" id="newMsg"></input><span>
                                <span><button onclick=" sendingGroupMessage()">SEND</button></span>
                            </div>
                        </div>
                        <footer></footer>
                    </div>
                </body>
            </html>
            `)
        }).catch( err => {//Handle the error
                console.error(JSON.stringify(err));
            });
    }
}

function usersChats(request, response){
    //Split the path of the request into its components
    if(!("userid" in request.session)){
        
        console.log(`login false`)
        response.redirect("/")
    }
    else{
        response.send(`
        <!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="styling.css">
        <script src="client.js"></script>
        <script src="allchat.js"></script>
    </head>
    <body>
        <div id="changePage">
            <div>
            <div><header><img class="logo" src='img/log.png')></img>Let's Chat</header></div>
            <div class="sidenav" >
                <input type="text" placeholder="Find user..." id="search"><button class="searchbtn" ><img src="img/searchIcon.png" ></img></button></input>
                <a href="/profile"><img src="img/head.png">PROFILE</img></a>
                <a href="/Chats"><img src="img/chati.png">CHAT</img></a>
                <a href="/Groups"><img src="img/group.png"> GROUP CHAT</img></a>
                <a onclick="logoff()"><img src="img/logout.png"> LOG OUT</img></a>
            </div>
            <div class="title">ALL CHATS</div>
            <div class="chatname"></div>
            <p id="demo" hidden></p>
            <div class="contain">
                
                <div class="innerpage">
                    <div class="searchDesign" >
                        <div class="SearchFound" id="allChats">
                        </div>
                    </div>

                </div>
            </div>

            <footer></footer>
        </div>
    </body>
</html>
        `)
    }
}

function groupSearching(request, response){
    //Split the path of the request into its components
    if(!("userid" in request.session)){
        
        console.log(`login false`)
        response.redirect("/")
    }
    else{
        console.log(request.session.userSearch)
        SearchForGroup(request.session.userSearch).then ( result => {
            //Do something else
                console.log(JSON.stringify(result));
                console.log(JSON.stringify(result));
                let convertGroupFinding = JSON.stringify(result)
                let setGroupFinding = JSON.parse(convertGroupFinding)
                groupChecker =setGroupFinding.length
                console.log("gchecker: "+ groupChecker)
                console.log("Do something else");
                console.log(request.session.userSearch)

                if(groupChecker>0){
                    
                    let NameofGroup = setGroupFinding[0].GroupName
                    let Groups_ID = setGroupFinding[0].id
                    response.send(`<!DOCTYPE html>
                    <html>
                        <head>
                            <link rel="stylesheet" href="styling.css">
                            <script src="client.js"></script>
                        </head>
                        <body>
                            <div><header><img class="logo" src='img/chath.png')></img>Let's Chat</header></div>
                            <div class="sidenav" >
                                <input type="text" id="search" placeholder="Find user....."><button class="searchbtn" onclick="SendSearch()"><img src="img/searchIcon.png" ></img></button></input>
                                <a href="/profile"><img src="img/head.png">PROFILE</img></a>
                                <a href="/Chats"><img src="img/chati.png">CHAT</img></a>
                                <a href="/Groups"><img src="img/group.png"> GROUP CHAT</img></a>
                                <a onclick="logoff()"><img src="img/logout.png"> LOG OUT</img></a>
                            </div>
                            <div class="title">SEARCH RESULTS</div>
                            <div class="chatname"></div>
                            <div class="contain">
                                <p id="demo" hidden></p>
                                <div class="innerpage">
                                    <div class="searchDesign" id = "searchResults">
                                        <div class="SearchFound">
                                            <div style="background: rgb(7, 124, 213); font-weight: 800; font-family:Georgia, 'Times New Roman', Times, serif;" ><img src="img/user.png" style="height: 30px;"></img>${NameofGroup}</div>
                                            <div><button style="border: 10px;border-color: blue; font-weight: 800; text-align: center; height: 33px" onclick='startGroupMessage(${Groups_ID})'>START CHAT</button></div>
                                        </div>
                                        <script>
                                            let ourArray =[]
                                        </script>             
                                    </div>
                                </div>
                            </div>
                            <footer></footer>
                        </body>
                    </html>`)
                }
                if(groupChecker<1){
                    response.send(`<!DOCTYPE html>
                    <html>
                        <head>
                            <link rel="stylesheet" href="styling.css">
                            <script src="client.js"></script>
                        </head>
                        <body>
                            <div><header><img class="logo" src='img/chath.png')></img>Let's Chat</header></div>
                            <div class="sidenav" >
                                <input type="text" id="search" placeholder="Find user....."><button class="searchbtn" onclick="SendSearch()"><img src="img/searchIcon.png" ></img></button></input>
                                <a href="/profile"><img src="img/head.png">PROFILE</img></a>
                                <a href="/Chats"><img src="img/chati.png">CHAT</img></a>
                                <a href="/Groups"><img src="img/group.png"> GROUP CHAT</img></a>
                                <a onclick="logoff()"><img src="img/logout.png"> LOG OUT</img></a>
                            </div>
                            <div class="title">SEARCH RESULTS</div>
                            <div class="chatname"></div>
                            <div class="contain">
                                <p id="demo" hidden></p>
                                <div class="innerpage">
                                    <div class="searchDesign" id = "searchResults">
                                        <div class="SearchFound">
                                            <h1>Result Not Found :(</h1>
                                        </div>
                                        <script>
                                            let ourArray =[]
                                        </script>             
                                    </div>
                                </div>
                            </div>
                            <footer></footer>
                        </body>
                    </html>`)
                }

            }).catch( err => {//Handle the error
                console.error(JSON.stringify(err));
            });
    }
}

function Groups(request, response){
    //Split the path of the request into its components
    if(!("userid" in request.session)){
        
        console.log(`login false`)
        response.redirect("/")
    }
    else{
        response.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <link rel="stylesheet" href="styling.css">
                <script src="client.js"></script>
                <script src="allGroupChats.js"></script>
            </head>
            <body>
                <div><header><img class="logo" src='img/log.png')></img>Let's Chat</header></div>
                <div class="sidenav" >
                    <input type="text" id="search" placeholder="Find user....."><button class="searchbtn" onclick="SendSearch()"><img src="img/searchIcon.png" ></img></button></input>
                    <a href="/profile"><img src="img/head.png">PROFILE</img></a>
                    <a href="/Chats"><img src="img/chati.png">CHAT</img></a>
                    <a href="/Groups"><img src="img/group.png"> GROUP CHAT</img></a>
                    <a onclick="logoff()"><img src="img/logout.png"> LOG OUT</img></a>
                </div>
                <div class="title">GROUPS</div>
                <div class="chatname">
                    <span><a href="/makeGroup"><button class="btn2">MAKE GROUP</button></a></span>
                    <span class="searchhh"><input type="text" id="groupsearch" class="findgroup" placeholder="Search For group"><button class="searchbtn" onclick="SendGroupSearch()"><img src="img/searchIcon.png" ></img></button></input></span>
                </div>
                <div class="contain">
                    <p id="demo" hidden></p>
                    <div class="innerpage">
                        <div class="searchDesign" id = "searchResults">
                            <div class="SearchFound" id="allGroupChats">
                            </div>
                 
                        </div>
                    </div>
                </div>
                <footer></footer>
            </body>
        </html>
        `)
    }
}


function Searching(request, response){
    //Split the path of the request into its components
    if(!("userid" in request.session)){
        
        console.log(`login false`)
        response.redirect("/")
    }
    else{
        SearchForUser(request.session.userSearch).then ( result => {
            console.log(JSON.stringify(result));
            console.log(JSON.stringify(result));
            let convertFinding = JSON.stringify(result)
            let setFinding = JSON.parse(convertFinding)
            checker =setFinding.length
            console.log("setl: "+setFinding.length)

            if(checker>0){

                let profileName = setFinding[0].name
                let profileID = setFinding[0].id
                response.send(`<!DOCTYPE html>
                <html>
                    <head>
                        <link rel="stylesheet" href="styling.css">
                        <script src="client.js"></script>
                    </head>
                    <body>
                        <div><header><img class="logo" src='img/chath.png')></img>Let's Chat</header></div>
                        <div class="sidenav" >
                            <input type="text" id="search" placeholder="Find user....."><button class="searchbtn" onclick="SendSearch()"><img src="img/searchIcon.png" ></img></button></input>
                            <a href="/profile"><img src="img/head.png">PROFILE</img></a>
                            <a href="/Chats"><img src="img/chati.png">CHAT</img></a>
                            <a href="/Groups"><img src="img/group.png"> GROUP CHAT</img></a>
                            <a onclick="logoff()"><img src="img/logout.png"> LOG OUT</img></a>
                        </div>
                        <div class="title">SEARCH RESULTS</div>
                        <div class="chatname"></div>
                        <div class="contain">
                            <p id="demo" hidden></p>
                            <div class="innerpage">
                                <div class="searchDesign" id = "searchResults">
                                    <div class="SearchFound">
                                        <div style="background: rgb(7, 124, 213); font-weight: 800; font-family:Georgia, 'Times New Roman', Times, serif;" ><img src="img/user.png" style="height: 30px;"></img>${profileName}</div>
                                        <div><button style="border: 10px;border-color: blue; font-weight: 800; text-align: center; height: 33px" onclick='startMessage(${profileID})'>START CHAT</button></div>
                                    </div>
                                    <script>
                                        let ourArray =[]
                                    </script>             
                                </div>
                            </div>
                        </div>
                        <footer></footer>
                    </body>
                </html>`)
            }

            if(checker<1){
                response.send(`<!DOCTYPE html>
                <html>
                    <head>
                        <link rel="stylesheet" href="styling.css">
                        <script src="client.js"></script>
                    </head>
                    <body>
                        <div><header><img class="logo" src='img/chath.png')></img>Let's Chat</header></div>
                        <div class="sidenav" >
                            <input type="text" id="search" placeholder="Find user....."><button class="searchbtn" onclick="SendSearch()"><img src="img/searchIcon.png" ></img></button></input>
                            <a href="/profile"><img src="img/head.png">PROFILE</img></a>
                            <a href="/Chats"><img src="img/chati.png">CHAT</img></a>
                            <a href="/Groups"><img src="img/group.png"> GROUP CHAT</img></a>
                            <a onclick="logoff()"><img src="img/logout.png"> LOG OUT</img></a>
                        </div>
                        <div class="title">SEARCH RESULTS</div>
                        <div class="chatname"></div>
                        <div class="contain">
                            <p id="demo" hidden></p>
                            <div class="innerpage">
                                <div class="searchDesign" id = "searchResults">
                                    <div class="SearchFound">
                                        <h1>Result Not Found :(</h1>
                                    </div>
                                    <script>
                                        let ourArray =[]
                                    </script>             
                                </div>
                            </div>
                        </div>
                        <footer></footer>
                    </body>
                </html>`)
            }
        
        }).catch( err => {//Handle the error
            console.error(JSON.stringify(err));
        });
    }
}

function createGroup(request, response){
    //Split the path of the request into its components
    if(!("userid" in request.session)){
        
        console.log(`login false`)
        response.redirect("/")
    }
    else{
        response.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <link rel="stylesheet" href="styling.css">
                <script src="client.js"></script>
            </head>
            <body id="bod">
                <div><header><img class="logo" src='img/chath.png')></img>Let's Chat</header></div>            
                <div class="sidenav" >
                    <input type="text" id="search" placeholder="Find user....."><button class="searchbtn" onclick="SendSearch()"><img src="img/searchIcon.png" ></img></button></input>
                    <a href="/profile"><img src="img/head.png">PROFILE</img></a>
                    <a href="/Chats"><img src="img/chati.png">CHAT</img></a>
                    <a href="/Groups"><img src="img/group.png"> GROUP CHAT</img></a>
                    <a onclick="logoff()"><img src="img/logout.png"> LOG OUT</img></a>
                </div>
                <div class="title">MAKE GROUP</div>
                <p id="demo" hidden></p>
                <div class="contain" id="contain">
                    <img class="msg" src='img/msg .png')></img>
                    <div class="makeGroup"> 
                        <div class="item2">
                            <div><b>MAKE GROUP</b></div>
                        </div>
                        <div class="innerGroup">
                            <div><b>GROUP NAME</b></div>
                            <div><input id="groupName"></input></div>
                        </div>
                        <div class="item8">
                            <button class="btn1" onclick="GroupRegister()">Enter</button>
                            <div id="outcome" style="color: red;"></div>
                        </div>
                    </div>
                </div>
        
                <footer></footer>
            </body>
        </html>
        `)
    }
}


function getRegisterPage(request, response){
    //Split the path of the request into its components
    response.send(`
    <!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="styling.css">
        <script src="client.js"></script>
    </head>
    <body>
        <div><header><img class="logo" src="img/chath.png")></img>Let's Chat</header></div>
        <div class="sidenav" hidden>
            <a >About</a>
            <a >Services</a>
            <a >Clients</a>
            <a >Contact</a>
        </div>
        <div class="contain">
            <div>
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
                    <div><b>USERNAME</b></div>
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
                    <div class="item4">Already have an account?<a href="/">Login</a></div>
                    <div id="result" style="color: red;"></div>
                </div>
            </div>
        </div>

        <footer></footer>
    </body>
</html>
    `)
}

