const express = require("express");
const app = express();
const session = require("express-session")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const pool = require("./db");
const { request } = require("express");

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
        console.log(req.query)
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
    console.log(req.params);
    try{
        const bookInfo = await pool.query("SELECT * FROM book where isbn=$1",[parseInt(req.params.isbn)]);
        console.log(bookInfo.rows);
        res.render("pages/book", {
            userName : req.session.user_name,
            book: bookInfo.rows[0]
        });
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
        const getCartContents = await pool.query("SELECT * FROM cart");
        user_name = req.session.user_name
        res.render("pages/checkout", {
            userName: user_name,
            cart: getCartContents.rows
        });
    }
    catch (err){
        console.error(err.message);
    }
})

app.post("/checkout", async(req,res)=>{
    try{
        //const Contents = await pool.query("SELECT * FROM cart");
        //empty cart, update book quantities, check if have enough

        user_name = req.session.user_name
        res.render("pages/orderstatus", {
            userName: user_name,
            orderid: 12345
        });
    }
    catch (err){
        console.error(err.message);
    }
})

app.get("/cart", async(req,res)=>{
    try{
        const getCartContents = await pool.query("SELECT * FROM cart");
        user_name = req.session.user_name
        res.render("pages/cart", {
            userName: user_name,
            cart: getCartContents.rows
        });
    }
    catch (err){
        console.error(err.message);
    }
})

app.post("/cart", async(req,res)=>{
    try{
        if(req.body.remove){
            removed_item = req.body.remove
            const updateCartContents = await pool.query("DELETE FROM cart where item=$1", [removed_item]);
        }else if(req.body.update){
            updated_item = req.body.update
            new_quantity = req.body.quantity
            const updateCartContents = await pool.query("UPDATE cart set quantity=$1 where item=$2", [new_quantity, updated_item]);
        }
        res.redirect("back")
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


app.get("/admin", async(req,res)=>{
    try{
        //const allBooks = await pool.query("SELECT * FROM book");
        res.render("pages/admin", {
        });
    }
    catch (err){
        console.error(err.message);
    }
})

app.get("/reports", async(req,res)=>{
    try{
        //const allBooks = await pool.query("SELECT * FROM book");
        res.json("sales");
    }
    catch (err){
        console.error(err.message);
    }
})

app.get("/orders", async(req,res)=>{
    try{
        //const allBooks = await pool.query("SELECT * FROM book");
        res.json("storeorders");
    }
    catch (err){
        console.error(err.message);
    }
})


app.get("/addbook", async(req,res)=>{
    try{
        //const allBooks = await pool.query("SELECT * FROM book");
        //res.json("sales");
        success =  req.query.success

        res.render("pages/addbook", {
            success : success
        });
    }
    catch (err){
        console.error(err.message);
    }
})

app.post("/addbook", async(req,res)=>{
    try{
        book_title = req.body.book_title
        authors = req.body.authors
        isbn = parseInt(req.body.isbn)
        publisher = req.body.publisher
        price = parseFloat(req.body.price)
        cover_image = null
        if(req.body.cover_image){
            cover_image = req.body.cover_image
        }
        const addBook = await pool.query("insert into book values($1, $2, $3, $4, $5)",[isbn,book_title, authors,price,cover_image])
        res.redirect("/addbook?success=true")
    }
    catch (err){
        res.redirect("/addbook?success=false")
        console.error(err.message);
    }
})

app.get("/removebook", async(req,res)=>{
    try{
        //const allBooks = await pool.query("SELECT * FROM book");
        success =  req.query.success
        res.render("pages/removebook", {
            success : success
        });
    }
    catch (err){
        console.error(err.message);
    }
})

app.post("/removebook", async(req,res)=>{
    try{
        book_title = req.body.book_title
        isbn = parseInt(req.body.isbn)
        if(req.body.cover_image){
            cover_image = req.body.cover_image
        }
        const addBook = await pool.query("delete from book where isbn=$1 and name=$2",[isbn,book_title])
        res.redirect("/removebook?success=true")
    }
    catch (err){
        res.redirect("/removebook?success=false")
        console.error(err.message);
    }
})


app.listen(3000, () => {
    console.log("server running on port 3000");
})