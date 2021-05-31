// express app and socket app
const app = require('express')();                                                   // import the express server
const httpServer = require("http").createServer(app);                               // create httpServer that listens on specified port

// firebase authentication
const firebase = require("./firebase/firebase");                                    // import firebase from firebase instance
const authMiddleware = require('./firebase/authMiddleware/authMiddleware');         // import the authentication middleware
// mongo database configs
const db = require('./dbConfig');                                                   // import the DB Schema
// modules for express function extensibility
const cors = require('cors');                                                       // import cors
const bodyParser = require('body-parser');                                          // import body parser to parse json body in post request
const axios = require('axios');                                                     // import axios to make http requests


// Functions that Express app can make use of
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

const port = process.env.PORT || 3000;

// for every requests that approaching '/api', need to pass the authMiddleware
app.use("/api", authMiddleware);


// Route Configurations

// Endpoints without authMiddleware
app.get('/', (request, response) => {
    response.send("Hello, Friend.")
})

app.post('/loginFormValidate', (request, response) => {
    const loginData = request.body;
    var email = loginData.username;
    var password = loginData.password;

    const emailRegex = /[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}/;
    const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,20}/;

    if(emailRegex.test(email)==true){
        if(passwordRegex.test(password)==true){
            response.status(200).send({ formValidation: true , message: 'form validation success'})
        }else{
            response.status(422).send({ formValidation: false, message: 'password validation error' })
        }
    }else{
        response.status(422).send({ formValidation: false, message: 'email validation error' })
    }
})

app.post('/regFormValidate', (request, response) => {
    const registrationData = request.body;
    var username = registrationData.username;
    var email = registrationData.email;
    var password = registrationData.password;
    var confirmPassword = registrationData.confirmPassword;

    const unameRegex = /[A-Za-z0-9 ]{8,20}/;
    const emailRegex = /[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}/;
    const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,20}/;

    if(unameRegex.test(username)==true){
        if(emailRegex.test(email)==true){
            if(password==confirmPassword){
                if(passwordRegex.test(password)==true){
                    response.status(200).send({ formValidation: true , message: 'form validation success'})
                }else{
                    //password wrong
                    response.status(422).send({ formValidation: false, message: 'password validation error' })
                }
            }else{
                // password not match
                response.status(422).send({ formValidation: false, message: 'passwords mismatch' })
            }
        }else{
            // email wrong
            response.status(422).send({ formValidation: false, message: 'email validation error' })
        }
    }else{
        // username wrong
        response.status(422).send({ formValidation: false, message: 'username validation error' })
    }
})

app.post('/verifyLoggedInUser', (request, response) => {

    const token = request.headers.authorization;

    if (!token) {
        return response.send({ login : false });
    }

    if (token && token.split(" ")[0] !== "Bearer") {
        return response.send({ login : false });
    }
    
      const authToken = token.split(" ")[1];
      firebase
        .auth()
        .verifyIdToken(authToken)
        .then(() => {
            response.send({ login : true });
        })
        .catch(() => {
            response.send({ login : false })
        });
})

// API Root
// Endpoints with authMiddleware
app.get('/api', (request, response) => {
    response.send("An API that isn't comprehensible isn't usable.")
})

// Endpoint to create a user object in the mongoDB document
app.post('/api/register', (request, response) => {

    let token = request.headers.authorization.split(' ')[1];

    // authenticate the user token with firebase, to create document
    // for a firebase User in the mongoDB
    firebase
    .auth()
    .verifyIdToken(token)
    .then((userObj) => {
        // If the user exists
        if(userObj){
            // If the user document already exists
            User.findOne({uid: {$eq:userObj.uid}}, (error, user)=> {
                if(error){
                    return;
                }
                // check if user is already exist in the database
                if(!user){

                    let tagnameList = [ 
                        'Master Procrastinator',
                        'Master Procrastinator', 
                        'Dreamwalker', 
                        'Productive Bee',
                        'Productive Bee', 
                        'Dopamine Maniac',
                        'Dopamine Maniac', 
                        'Overthinker', 
                        'Over Achiever' 
                    ]

                    let welcomeTodo = [
                        {
                            todo: "Hey, I'm a Todo",
                            priority: 3,
                            completed: false,
                            date: 'Fri Jun 18 2021 00:00:00 GMT+0530 (India Standard Time)',
                            trashed: false
                        },
                        {
                            todo: "Click me, and I'll get completed",
                            priority: 2,
                            completed: false,
                            date: 'Mon May 31 2021 00:00:00 GMT+0530 (India Standard Time)',
                            trashed: false
                        },
                        {
                            todo: "Say 'Love you' to your Mom <3",
                            priority: 1,
                            completed: false,
                            date: 'Tue Sep 07 2021 00:00:00 GMT+0530 (India Standard Time)',
                            trashed: false
                        },
                        {
                            todo: "Say 'you're the best' to your Dad <3",
                            priority: 1,
                            completed: false,
                            date: 'Wed Sep 08 2021 00:00:00 GMT+0530 (India Standard Time)',
                            trashed: false
                        },
                        {
                            todo: "Love yourself",
                            priority: 2,
                            completed: false,
                            date: 'Sun Oct 10 2021 00:00:00 GMT+0530 (India Standard Time)',
                            trashed: false
                        },
                        {
                            todo: "Hey, I'm completed",
                            priority: 2,
                            completed: true,
                            date: 'Thu Feb 18 2021 00:00:00 GMT+0530 (India Standard Time)',
                            trashed: false
                        },
                        {
                            todo: "Watch Breaking Bad",
                            priority: 1,
                            completed: true,
                            date: 'Wed Nov 17 2021 00:00:00 GMT+0530 (India Standard Time)',
                            trashed: false
                        },
                        {
                            todo: "Complete wireframes for Panda101",
                            priority: 3,
                            completed: true,
                            date: 'Sun Nov 10 2021 00:00:00 GMT+0530 (India Standard Time)',
                            trashed: false
                        },
                        {
                            todo: "Buy Groceries",
                            priority: 2,
                            completed: true,
                            date: 'Fri Dec 31 2021 00:00:00 GMT+0530 (India Standard Time)',
                            trashed: false
                        },
                        {
                            todo: "Invest in Dogecoin",
                            priority: 1,
                            completed: true,
                            date: 'Wed Aug 04 2021 00:00:00 GMT+0530 (India Standard Time)',
                            trashed: false
                        },
                        {
                            todo: "I'm a dumb task, so obviously trashed",
                            priority: 1,
                            completed: false,
                            date: 'Wed Nov 03 2021 00:00:00 GMT+0530 (India Standard Time)',
                            trashed: true
                        },
                        {
                            todo: "You know what others can be",
                            priority: 3,
                            completed: false,
                            date: 'Sat May 15 2021 00:00:00 GMT+0530 (India Standard Time)',
                            trashed: true
                        },
                        {
                            todo: "trashed too? ...",
                            priority: 2,
                            completed: true,
                            date: 'Sun May 09 2021 00:00:00 GMT+0530 (India Standard Time)',
                            trashed: true
                        },
                        {
                            todo: "Your dumb ideas when you poop",
                            priority: 1,
                            completed: true,
                            date: 'Thu May 20 2021 00:00:00 GMT+0530 (India Standard Time)',
                            trashed: true
                        },
                        {
                            todo: "Send <3 to the app's developer",
                            priority: 3,
                            completed: true,
                            date: 'Mon May 24 2021 00:00:00 GMT+0530 (India Standard Time)',
                            trashed: true
                        }
                    ]

                    const user = {
                        uid: userObj.uid,
                        username: userObj.name,
                        email: userObj.email,
                        tagname: tagnameList[Math.floor(Math.random() * tagnameList.length)],
                        todo: welcomeTodo
                    }
                    let newUser = new User(user);
                    newUser.save((error, registeredUser) => {
                        if(error){
                            console.log("[-] Error saving new User to the database : ", error);
                            return;
                        }
                        console.log("[+] Registering new User to database is successful.", registeredUser)
                    })
                    response.send({'registered': true})
                    return
                }
                response.send({'registered': true})
            })
        }
    })
    .catch((error) => {
        console.log(">> Error validating user on firebase")
    });
})

// Endpoint to retrieve all the todos for a specific user
app.get('/api/getTodo', (request, response) => {
    let user = response.locals.user;

    User.find({uid:{$eq:user.uid}}, (error, foundUser) => {
        if(error){
            console.log("[-] Error retrieving todo from mongo")
            return;
        }

        if(foundUser) {
            response.send(foundUser[0])
        }else{
            response.send("unknown error")
        }
    })
})

// Endpoint to add new todo
app.post('/api/addTodo', (request, response) => {
    let user = response.locals.user;

    const changeStream = User.watch();

    const filter = { uid: user.uid }
    const newTodo = {
        todo: request.body.todo,
        priority: request.body.priority,
        completed: false,
        date: request.body.date,
        trashed: false, 
    }

    User.findOneAndUpdate(filter, { $push: { todo: newTodo } }, (error, resultB4Update) => {
        if(error){
            console.log("[-] error adding todo")
            response.send({ status: 'error', message: 'error adding todo' })
            return
        }

        changeStream.on('change', (change) => {
            User.find(filter, (error, foundUser) => {
                if(foundUser) {
                    // io.emit("allTodos", foundUser[0])
                }
            })
        })

        response.send({ status: 'success', message: 'New Todo added successfully' })
    })
})

// Endpoint to change the ToDo status
app.post('/api/changeTodoStatus', (request, response) => {
    
    let user = response.locals.user;
    const completedStatus = request.body.completed;

    if(typeof completedStatus == "boolean") {
        User.updateOne(
            {
                uid: user.uid, 'todo._id': request.body._id
            },
            {
                $set: { 'todo.$.completed': completedStatus }
            },
            (error, result) => {
                if(error) {
                    response.send({ status: 'error', message: 'Task status change failed' })
                    return
                }
                if(result.nModified==1) {
                    response.send({ status: 'success', message: 'Task status change success' })
                }
            }
        )
    }else{
        response.send({ status: 'error', message: 'Task status change failed' })
    }  
})

// Endpoint to update todo
app.post('/api/editTodo', (request, response) => {
    let user = response.locals.user;

    var todoID = request.body._id;
    var todoName = request.body.todo;
    var todoPriority = request.body.priority;
    var todoCompleted = request.body.completed;
    var todoDate = request.body.date;
    var todoTrashed = request.body.trashed;
    
    if(typeof todoCompleted == "boolean") {
        User.updateOne(
            {
                uid: user.uid, 'todo._id': todoID
            },
            {
                $set: { 
                    'todo.$.todo': todoName, 
                    'todo.$.priority': todoPriority, 
                    'todo.$.completed': todoCompleted, 
                    'todo.$.date': todoDate, 
                    'todo.$.trashed': todoTrashed 
                }
            },
            (error, result) => {
                if(error) {
                    response.send({ status: 'error', message: 'edit task failed' })
                    return
                }
                if(result.nModified==1) {
                    response.send({ status: 'success', message: 'edit task success' })
                }else if(result.nModified==0){
                    response.send({ status: 'failed', message: 'none changed' })
                }
            }
        )
    }else{
        response.send({ status: 'error', message: 'edit task failed' })
    }
})

// Endpoint to change the delete status
app.post('/api/changeDeleteStatus', (request, response) => {
    let user = response.locals.user;
    const deletedStatus = !request.body.trashed;

    if(typeof deletedStatus == "boolean") {
        User.updateOne(
            {
                uid: user.uid, 'todo._id': request.body._id
            },
            {
                $set: { 'todo.$.trashed': deletedStatus }
            },
            (error, result) => {
                if(error) {
                    response.send({ status: 'error', message: 'Delete status change failed' })
                    return
                }
                if(result.nModified==1) {
                    response.send({ status: 'success', message: 'Delete status change success' })
                }else if(result.mModified==0){
                    response.send({ status: 'error', message: 'Delete status change failed' })
                }
            }
        )
    }else{
        response.send({ status: 'error', message: 'Delete status change failed' })
    }
})

// Endpoint to edit the profile info
app.post('/api/editProfile', (request, response) => {
    let user = response.locals.user;

    var username = request.body.username;
    var tagname = request.body.tagname;

    User.updateOne(
        {
            uid: user.uid
        },
        {
            $set: { 
                'username': username,
                'tagname': tagname
            }
        },
        (error, result) => {
            if(error) {
                response.send({ status: 'error', message: 'edit profile failed' })
                return
            }
            if(result.nModified==1) {
                response.send({ status: 'success', message: 'edit profile success' })
            }else if(result.nModified==0){
                response.send({ status: 'failed', message: 'none changed' })
            }
        }
    )
})

// Endpoint to clear all the todos
app.get('/api/clearTrash', (request, response) => {
    let user = response.locals.user;

    User.updateOne(
        {
            uid: user.uid
        },
        { $pull: { todo: { 'trashed': true } } },
        (error, result) => {
            if(error) {
                response.send({ status: 'error', message: 'clearing trash failed' })
                return
            }
            if(result.nModified==1) {
                response.send({ status: 'success', message: 'clearing trash success' })
            }else{
                response.send({ status: 'error', message: 'clearing trash failed' })
            }
        }
    )
})

// Endpoint to get weather data
app.post('/api/weather', (request, response) => {
    const weatherAPI = "openweathermap quiery string"
    let reqURL = weatherAPI;

    axios.get(reqURL)
         .then(res => {
    const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
    // console.log('Status Code:', res.status);
    // console.log('Date in Response header:', headerDate);

    const weatherData = res.data;
    response.send({ weather : weatherData.weather[0], degree : weatherData.main.temp });
    })
    .catch(err => {
        console.log('Error retrieving Weather: ', err.message);
    });
})


// Function to start the server on specified port
httpServer.listen(port, () => {
    console.log(`[+] Server started at port ${port}`)
})