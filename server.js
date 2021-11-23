const express = require("express");
const app = express();
const session = require("express-session")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const pool = require("./db");
const { request } = require("express");
const helperFunctions = require ("./serverHelpers"); 

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
        bookSearch = helperFunctions.buildWhereString(req.query);
        const getGenres = await pool.query("SELECT distinct genre FROM book");
        const getAuthors = await pool.query("SELECT auth_name FROM author"); 
        const allBooks = await pool.query(bookSearch);
        if(req.session.user_name){
            console.log(req.session.user_name);
        }
        console.log(req.query)
        res.render("pages/books", {
            userName : req.session.user_name,
            genres: getGenres.rows,
            authors: getAuthors.rows,
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
        isbn = req.params.isbn
        console.log(isbn)
        const bookInfo = await pool.query("SELECT * FROM bookPage where isbn=$1",[isbn])
        const reviewInfo = await pool.query("SELECT * FROM review where isbn=$1",[isbn])
        const getRating = await pool.query("SELECT * FROM avg_rating($1)",[isbn])
        console.log(getRating.rows)
        avgRating = ''
        if(getRating.rows.length == 0 || getRating.rows[0].avg_rating == null){
            avgRating = 'N/A'
        }else{
            avgRating = getRating.rows[0].avg_rating.toString()+"/5"
        }
        res.render("pages/book", {
            userName : req.session.user_name,
            book: bookInfo.rows[0],
            reviews: reviewInfo.rows,
            bookRating: avgRating
        });
    }
    catch (err){
        console.error(err.message);
    }
})

app.post("/review", async(req,res)=>{
    try{
        review = req.body
        reviewer = review.review_name
        comment = JSON.stringify(review.review_comment)
        rating = review.review_rating
        isbn = review.review_isbn
        url = '/books/'+isbn
        const addReview = await pool.query('insert into review(name,comment,rating,isbn) values($1,$2,$3,$4)',[reviewer,comment,rating,isbn])
        res.redirect(url)
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

app.get("/registrationresult", async(req,res)=>{
    try{
        //const allBooks = await pool.query("SELECT * FROM book");
        user_name = null
        if(req.session.user_name){
            user_name = req.session.user_name
        }
        res.render("pages/registrationresult", {
            userName : user_name
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
        const addUser = await pool.query("Insert into store_user(first_name, last_name, email, username, user_pass) values($1, $2, $3, $4, $5)"
            , [first_name, last_name, email, user_name, user_pass]);
        if(addUser.rowCount > 0){
            req.session.user_name = user_name;
            //res.redirect("/books")
            res.redirect("/registrationresult")
        }
    }
    catch (err){
        console.error(err.message);
        res.redirect("/registrationresult")
    }
})

app.post("/signin", async(req,res)=>{
    try{
        //check if username is valid
        //need to handle if username/password is not correct
        username = req.body.user_name
        password = req.body.pass_word
        checkSignIn = await pool.query("SELECT * FROM store_user where username=$1 and user_pass=$2",[username,password]);
        if(checkSignIn.rows.length > 0){
            req.session.user_name = username
            res.redirect("back");
        }else{
            res.redirect("/failedsignin")
        }
    }
    catch (err){
        console.error(err.message);
    }
})

app.get("/failedsignin", async(req,res)=>{
    try{
        res.render("pages/failedsignin",{

        });
    }
    catch (err){
        console.error(err.message);
    }
})

app.post("/signout", async(req,res)=>{
    try{
        //check if username is valid
        //need to handle if username/password is not correct
        req.session.user_name = null
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
        user_name = req.session.user_name
        res.render("pages/tracking", {
            userName: user_name
        });
    }
    catch (err){
        console.error(err.message);
    }
})

app.get("/tracking/:orderid", async(req,res)=>{
    tracking_info = {}
    tracking_info['exists'] = false
    try{
        orderid = parseInt(req.params.orderid)
        const getTrackingInfo = await pool.query("SELECT * FROM shipping where order_id = $1",[orderid]);
        tracking_info.exists = true
        tracking_info['details'] = getTrackingInfo.rows
        console.log(tracking_info)
        user_name = req.session.user_name
        if(getTrackingInfo.rows.length > 0){
            res.render("pages/tracking_info", {
                userName: user_name,
                trackingInfo: tracking_info
            });
        }else{
            res.render("pages/tracking_info", {
                userName: user_name,
                orderId: orderid
            });    
        }
    }
    catch (err){
        console.error(err.message);
        res.render("pages/tracking_info", {
            userName: user_name,
            orderId: orderid
        });
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
        //Get publisher info
        pub_name = req.body.publisher_name
        street_num_name = req.body.publisher_address
        office_num = req.body.publisher_office
        city = req.body.publisher_city
        province = req.body.publisher_province
        country = req.body.publisher_country
        post_code = req.body.publisher_post
        email = req.body.publisher_email
        phone_num = req.body.publisher_phone
        bank_account = req.body.publisher_account 

        //Check if publisher already exists
        checkPublisher = await pool.query("select * from publisher where pub_name=$1 and email=$2",[pub_name, email])
        
        //Add publisher if they don't exist
        if(checkPublisher.rows.length == 0){
            addPublisher = await pool.query("insert into publisher(pub_name,street_num_name,office_num,city,province,country,post_code"
                +",email,bank_account",[pub_name,street_num_name,office_num,city,province,country,post_code,email,bank_account])
        }

        //Get publisher id
        getPublisherId = await pool.query("select pub_id from publisher where pub_name=$1 and email=$2",[pub_name,email])
        pub_id = getPublisherId.rows[0]

        //Add publisher phone numbers if it didn't already exist
        if(checkPublisher.rows.length == 0){
            for(phone in phone_num.split(',')){
                addPhone = await pool.query("insert into phone values($1,$2)",[phone, pub_id])
            }
        }


        //Get book information
        book_name = req.body.book_name
        authors = req.body.authors
        isbn = req.body.isbn
        price = parseFloat(req.body.price)
        genre = req.body.genre
        page_num = req.body.page_num
        description = JSON.stringify(req.body.description)
        pub_percent = parseInt(req.body.publisher_percent)
        cover_image = req.body.cover_image
        const addBook = await pool.query("insert into book(isbn,name,genre,price,description,cover_image,pub_id,pub_percent)"+
        "values($1, $2, $3, $4, $5,$6,$7,$8)",[isbn,book_name,genre, price,description, cover_image, pub_id,pub_percent])
        for(author in authors.split(",")){
            const addAuthor = await pool.query("insert into author(auth_name) values($1)",[author])
        }

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