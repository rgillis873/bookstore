const express = require("express");
const app = express();
const session = require("express-session")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const pool = require("./db")

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(cookieParser());
app.use(session({secret:"This is a book store"}));

app.use(express.static("public"));
//View Engine
app.set("view engine", "pug");

app.get("/", async(req, res)=>{
    try {
        res.render("pages/index", {
            userName : req.session.user_name
        });
    } catch (error) {
        console.error(err.message);
    }
})

app.get("/books", async(req,res)=>{
    try{
        const allBooks = await pool.query("SELECT * FROM book");
        //res.json(allBooks.rows);
        if(req.session.user_name){
            console.log(req.session.user_name);
        }
        res.render("pages/books", {
            userName : req.session.user_name,
            books: allBooks.rows
        });
    }
    catch (err){
        console.error(err.message);
    }
})

app.get("/books/:isbn", async(req,res)=>{
    try{
        //const allBooks = await pool.query("SELECT * FROM book");
        res.json("INDIVIDUAL BOOK");
    }
    catch (err){
        console.error(err.message);
    }
})

app.get("/register", async(req,res)=>{
    try{
        //const allBooks = await pool.query("SELECT * FROM book");
        res.render("pages/register", {
            userName : req.session.user_name
        });
    }
    catch (err){
        console.error(err.message);
    }
})

app.post("/register", async(req,res)=>{
    try{
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let email = req.body.email;
        let user_name = req.body.user_name;
        let user_pass = req.body.user_pass;
        console.log(req.body)
        if(user_name && email){
            const addUser = await pool.query("Insert into site_user(first_name, last_name, email, user_name, user_pass) values($1, $2, $3, $4, $5)"
            , [first_name, last_name, email, user_name, user_pass]);
            req.session.user_name = user_name;
            res.redirect("/books")
        }else{
            res.json("Already have a user with that name")
        }
    }
    catch (err){
        console.error(err.message);
    }
})

app.post("/signin", async(req,res)=>{
    try{
        //check if username is valid
        //need to handle if username/password is not correct
        console.log(req.body.user_name)
        req.session.user_name = req.body.user_name
        res.redirect("back");
    }
    catch (err){
        console.error(err.message);
    }
})



app.get("/sales", async(req,res)=>{
    try{
        //const allBooks = await pool.query("SELECT * FROM book");
        res.json("sales");
    }
    catch (err){
        console.error(err.message);
    }
})

app.get("/checkout", async(req,res)=>{
    try{
        //const allBooks = await pool.query("SELECT * FROM book");
        //res.json("checkout");
        user_name = req.session.user_name
        res.render("pages/checkout", {
            userName: user_name
        });
    }
    catch (err){
        console.error(err.message);
    }
})

app.get("/cart", async(req,res)=>{
    try{
        //const allBooks = await pool.query("SELECT * FROM book");
        res.json("cart");
    }
    catch (err){
        console.error(err.message);
    }
})

app.get("/storeorders", async(req,res)=>{
    try{
        //const allBooks = await pool.query("SELECT * FROM book");
        res.json("storeorders");
    }
    catch (err){
        console.error(err.message);
    }
})

app.get("/tracking", async(req,res)=>{
    try{
        //const allBooks = await pool.query("SELECT * FROM book");
        res.json("tracking");
    }
    catch (err){
        console.error(err.message);
    }
})

app.listen(3000, () => {
    console.log("server running on port 3000");
})