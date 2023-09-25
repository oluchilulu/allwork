const express = require('express')
// connect with th model
const connectDB = require('./utils/connectDB')
const path = require('path')
const app = express()
app.use(express.json())

app.use(express.urlencoded({extended:true}))
// const users =require('./data')
const result = require('./views/data')

//to hash password
const bcrypt = require('bcrypt')
const User = require('./model/registerationSchema') // with model
const Admin = require('./model/adminReg')
// console.log(user)
//connecting to a database

const session = require('express-session')
const flash = require('connect-flash')
const mongoDbSession = require('connect-mongodb-session')(session);

connectDB()

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'/views'))

app.use(express.static(path.join(__dirname,'public')))


//setup flash with session
app.use(session({
secret: 'keyboard cat', //gives u a unique id in the session
saveUninitialized:true,
resave:true        
}))

app.use(flash());



const rand = Math.floor(Math.random()*10)+1
const username = 'JosephDev'
const allCourses =['WDD','AutoCad','Graphics Design']
const datas = {
    allCourses: allCourses,
    username: username,
    rand:rand
}


//creating the mongodb session
const store = new mongoDbSession({
    uri:'mongodb+srv://judeoluchi:Cherechi_1@cluster0.bvn952f.mongodb.net/test', // creates aa section and stores it inside the uri
    collection:"mySession"
})

//setting up flash with session
app.use(session({
secret : 'keyboard cat',
saveUninitialized:true,
resave:true,
store:store

}))


const Authentication = (req, res,next) =>{
    if(req.session.Authentication){
        next()
    }else{
        res.redirect("/login")
    }
}

app.get('/',(req,res)=>{
    res.render('index.ejs')

})

app.get('/adminReg',(req, res) =>{
  res.render('adminReg.ejs',{ messages: req.flash('info')})

})
// when you use await, u use async
app.get('/adminDashboard', async(req, res) =>{
     const allUsers = await User.find()
     console.log(allUsers)
    // res.render('adminDashboard.ejs',{ messages: req.flash('info')}) //when u aredealing with just adi reg
    res.render('adminDashboard.ejs',{allUsers})
  
  })

app.get('/register',(req, res)=>{
    console.log(req.session)
    res.render('register.ejs',{ messages: req.flash('info')})
})
// app.get('/users',(req,res)=>{
//     res.render('users.ejs',user)
// })

//git add .
//git commit -m"reason"
//git push -u origin main

 //vercel.com    thi gives app for freehosting
 //onrender.com
app.get('/',(req,res)=>{
    res.render('index.ejs')
})
app.get('/courses',(req,res)=>{
    res.render('courses.ejs', {datas})
})

// app.get('/dashboard',(req,res)=>{
//     res.render('dashboard.ejs')
// })


app.get('/weather', (req, res) =>{
    res.render('weather.ejs')
})

app.get('/login', (req, res) =>{
    res.render('login.ejs',{ messages: req.flash('info')})
})

app.get('/forgetpassword', (req, res) =>{
    res.render('forgetpassword.ejs',{ messages: req.flash('info')})
})



// const result = require('./views/data')
// app.get('/allUsers',(req,res)=>{
    //     res.render('allUsers.ejs', {result})
// })
// app.get('/:username',(req,res)=>{
//     const{username} = req.params
//     console.log(username)
//     const userInfo = result.find((el)=>{
//         return el.username === username
//     })
//     console.log(userInfo)
//     res.render('userData.ejs',{...userInfo})
// })
app.get('/about.ejs',(req,res)=>{
    res.render('/about.ejs')
})

//deleting user by admin
     app.get('/delete/:id',async(req,res) =>{
     const{id} = req.params

     await User.findByIdAndDelete({_id:id})   // find this person and delete
     res.redirect('/adminDashboard')
})


app.get('/dashboard',(req,res)=>{
    console.log(foundUser)
    res.render('dashboard.ejs',{foundUser})
})



app.post('/adminregistration',async(req,res) => {
    try{
        const {username, password} = req.body
        console.log({username, password})

        const foundAdmin = await Admin.findOne({username:username})

        if(foundAdmin){
            req.flash('info', 'user already exist')
            res.redirect('/register')
        }
    
        //add this part to hack password
        // th higher the number, the more time it takes
        const hashedPassword = await bcrypt.hash(password,12)


        const user = new Admin({
            username:username,
            password:hashedPassword,
            role:'Admin',
            active:true
        })
        await user.save()
        console.log({username, hashedPassword})
        res.redirect('/login')
    }catch (error) {
        console.log(error)
    }
    }) 




app.post('/registration',async(req,res) => {
    try{
        const {username, password, fullname, passport, phone} = req.body
        console.log({username, password, fullname, phone})

        const foundUser = await User.findOne({username:username})

        if(foundUser){
            req.flash('info', 'user already exist')
            res.redirect('/register')
        }
    
        //add this part to hack password
        // th higher the number, the more time it takes
        const hashedPassword = await bcrypt.hash(password,12)


        const user = new User({
            username:username,
            password:hashedPassword,
            fullname:fullname,
            passport:passport,
            phone:phone,
            role:'User',
            active:true
        })
        await user.save()
        console.log({username, hashedPassword})
        res.redirect('/login')
    }catch (error) {
        console.log(error)
    }
    }) 



    let foundUser

    app.post('/login', async (req, res) => {
        const {username, password} = req.body
            // console.log({username, password})
             foundUser = await User.findOne({username:username})

         //console.log(foundUser)
    if (foundUser){
        const user = await bcrypt.compare(password, foundUser.password)
        if(user){

            req.session.Authentication = true
            res.redirect('/dashboard')
        }else{
            req.flash('info', 'username or password incorrect')
            res.redirect('/login')
        }
    }else{
    const foundAdmin = await Admin.findOne({username:username})
     if(foundAdmin){
        const user = await bcrypt.compare(password, foundAdmin.password)
        if(user){
            res.redirect('/adminDashboard')
        }else{
            req.flash('info', 'username or password incorrect')
            res.redirect('/login')
        }
     }
    }
    
    })

 

    // app.post('/adminregistration',async(req,res) => {
    // try{
    //     const {username, password} = req.body
    //     console.log({username, password})

    //     const foundUser = await User.findOne({username:username})

    //     if(foundUser){
    //         req.flash('info', 'user already exist')
    //         res.redirect('/register')
    //     }

    //     //add this part to hack password
    //     // th higher the number, the more time it takes
    //     const hashedPassword = await bcrypt.hash(password,12)


    //     const user = new User({
    //         username:username,
    //         password:hashedPassword,
    //         role:'User',
    //         active:true
    //     })
    //     await user.save()
    //     console.log({username, hashedPassword})
    //     res.redirect('/login')
    // }catch (error) {
    //     console.log(error)
    // }
    // }) 

   
    
    app.post('/forgetpassword', async (req, res) => {
        const {username, newpassword} = req.body
             console.log({username, newpassword})
            const foundUser = await User.findOne({username:username})
         //console.log(foundUser)
  if(username.length<10 || newpassword.length<10){
    req.flash('info',' username must be greater then 10 and password must be greater than 10')
    res.redirect('/forgetpassword')
  }
  
  else{
    const hashedPassword = await bcrypt.hash(newpassword,10)
       const user = await User.findOneAndUpdate({username:username}, {$set: {password:hashedPassword}})
         console.log(user)

    // res.redirect('/dashboard')

    req.flash('info', 'password updateed')
    res.redirect('/login')
  }
}

    )





const PORT = 3000
app.listen(PORT,()=>{
    console.log(`listening to port${PORT}`)
})