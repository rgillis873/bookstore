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

//Displays search page for books
app.get("/books", async(req,res)=>{
    try{
        //Build where string to search db for books matching the query
        bookSearch = helperFunctions.buildWhereString(req.query);

        //Get list of book genres
        const getGenres = await pool.query("SELECT distinct genre FROM book");
        
        //Get list of authors
        const getAuthors = await pool.query("SELECT auth_name FROM author"); 
        
        //Get list of books
        const allBooks = await pool.query(bookSearch);
        
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

//Displays an individual book page
app.get("/books/:isbn", async(req,res)=>{
    try{
        isbn = req.params.isbn

        //Get the book details
        const bookInfo = await pool.query("SELECT * FROM bookPage where isbn=$1",[isbn])
        
        //Get the reviews for the book
        const reviewInfo = await pool.query("SELECT * FROM review where isbn=$1",[isbn])
        
        //Determine the average rating for the book
        const getRating = await pool.query("SELECT * FROM avg_rating($1)",[isbn])
        
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

//Handles when a user posts a review for a book
app.post("/review", async(req,res)=>{
    try{
        //Get the review details
        review = req.body
        reviewer = review.review_name
        comment = JSON.stringify(review.review_comment)
        rating = review.review_rating
        isbn = review.review_isbn
        url = '/books/'+isbn

        //Add the review to the review relation
        const addReview = await pool.query('insert into review(name,comment,rating,isbn) values($1,$2,$3,$4)',[reviewer,comment,rating,isbn])
        
        //Return to the url
        res.redirect(url)
    }
    catch (err){
        console.error(err.message);
    }
})

//Displays page where user can register for the store
app.get("/register", async(req,res)=>{
    try{
        res.render("pages/register", {
            userName : req.session.user_name
        });
    }
    catch (err){
        console.error(err.message);
    }
})

//Displays page showing the outcome of the registration process
app.get("/registrationresult", async(req,res)=>{
    try{
        res.render("pages/registrationresult", {
            userName : req.session.user_name
        });
    }
    catch (err){
        console.error(err.message);
    }
})

//Handles when a user tries to register for the store
app.post("/register", async(req,res)=>{
    try{
        //Get user info from the request
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let email = req.body.email;
        let user_name = req.body.user_name;
        let user_pass = req.body.user_pass;

        //Add the user to the store_user relation
        const addUser = await pool.query("Insert into store_user(first_name, last_name, email, username, user_pass) values($1, $2, $3, $4, $5)"
            , [first_name, last_name, email, user_name, user_pass]);
        
        //If successful, set the username and redirect to the registration result page
        if(addUser.rowCount > 0){
            req.session.user_name = user_name;
            res.redirect("/registrationresult")
        }
    }
    catch (err){
        //If unsuccessful adding the user, don't set username and redirect to the registration result page
        console.error(err.message);
        res.redirect("/registrationresult")
    }
})

//Handles when a user tries to login to the store
app.post("/signin", async(req,res)=>{
    try{
        //Get login info
        username = req.body.user_name
        password = req.body.pass_word
        
        //Check for a matching username and password in the db
        checkSignIn = await pool.query("SELECT * FROM store_user where username=$1 and user_pass=$2",[username,password]);
        
        //Set username if the credentials are verified
        if(checkSignIn.rows.length > 0){
            req.session.user_name = username
            
            //If the user had cart items before logging in, merge them with
            //the pre-existing items in the logged in user's cart
            if(req.session.cartId){
                //helperFunctions.mergeCarts(req.session.cartId, req.session.user_name)
            }
            
            res.redirect("back");
        }else{
            //Direct user to failed signin page if not successful
            res.redirect("/failedsignin")
        }
    }
    catch (err){
        console.error(err.message);
    }
})

//Displays page for when user is unsuccessful signing in
app.get("/failedsignin", async(req,res)=>{
    try{
        
        res.render("pages/failedsignin",{
            userName: req.session.user_name
        });
    }
    catch (err){
        console.error(err.message);
    }
})

//Handles when a user signs out of the store
app.post("/signout", async(req,res)=>{
    try{
        req.session.user_name = null
        req.session.cartId = null
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

//Displays the contents of a cart to the user
app.get("/cart", async(req,res)=>{
    try{
        cartContents = null

        //If the user has items in the cart
        if(req.session.cartId){
            const getCartContents = await pool.query("SELECT * FROM book_cart where cart_id=$1",[req.session.cartId]);
            cartContents = getCartContents.rows
        }
        res.render("pages/cart", {
            userName: req.session.user_name,
            cart: cartContents
        });
    }
    catch (err){
        console.error(err.message);
    }
})

//Handles when a user adds/removes an item from their cart
app.post("/cart", async(req,res)=>{
    try{
        
        //If no cart id, create a cart
        if(!req.session.cartId){
            const createCart = await pool.query("insert into cart values(default) returning cart_id");
            req.session.cartId = createCart.rows[0].cart_id
        }

        //If user is removing a book from the cart
        if(req.body.remove){
            isbn = req.body.remove
            const updateCartContents = await pool.query("delete from book_cart where isbn=$1 and cart_id=$2", [isbn,req.session.cartId]);
        }
        //If user is updating the quantity of a book in their cart
        else if(req.body.update){
            isbn = req.body.update
            new_quantity = req.body.quantity
            const updateCartContents = await pool.query("update book_cart set quantity=$1 where isbn=$2 and cart_id=$3",
             [new_quantity, isbn, req.session.cartId]);
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

//Displays page where store owner can add a book
app.get("/addbook", async(req,res)=>{
    try{
        success =  req.query.success
        res.render("pages/addbook", {
            success : success
        });
    }
    catch (err){
        console.error(err.message);
    }
})

//Handles when owner tries to add a book to the book store
app.post("/addbook", async(req,res)=>{
    try{
        //Get publisher info
        pub_name = req.body.publisher_name
        street_num_name = req.body.publisher_street_name
        office_num = req.body.publisher_office
        city = req.body.publisher_city
        province = req.body.publisher_province
        country = req.body.publisher_country
        post_code = req.body.publisher_post
        email = req.body.publisher_email
        phone_num = req.body.publisher_phone
        bank_account = req.body.publisher_account 

        //Check if publisher already exists
        checkPublisher = await pool.query("select pub_id from publisher where pub_name=$1 and email=$2",[pub_name, email])
        

        //Add publisher if they don't exist
        addPublisher = ""
        if(checkPublisher.rows.length == 0){
            addPublisher = await pool.query("insert into publisher(pub_name,street_num_name,office_num,city,province,country,post_code"
                +",email,bank_account) values($1,$2,$3,$4,$5,$6,$7,$8,$9) returning pub_id",[pub_name,street_num_name,office_num,city,province,country
                    ,post_code,email,bank_account])
        }

        //Get publisher id
        pub_id = checkPublisher.rows.length > 0?checkPublisher.rows[0].pub_id:addPublisher.rows[0].pub_id

        //Add publisher phone numbers if it didn't already exist
        if(checkPublisher.rows.length == 0){
            phone_numbers = phone_num.split(',')
            for(let i = 0;i<phone_numbers.length;i++) {
                addPhone = await pool.query("insert into phone values($1,$2)",[phone_numbers[i], pub_id])
            }
        }

        //Get book information
        book_name = req.body.book_name
        authors = req.body.authors
        isbn = req.body.isbn
        price = parseFloat(req.body.price)
        genre = req.body.genre
        page_num = req.body.pages
        description = JSON.stringify(req.body.description)
        pub_percent = parseInt(req.body.publisher_percent)
        cover_image = req.body.cover_image
        
        //Check if book already exists
        const checkForBook = await pool.query('select * from book where isbn=$1',[isbn])
        
        //If book already exists, changed it's removed status.Otherwise add it to the db
        if(checkForBook.rows.length > 0){
            const addBackBook = await pool.query('update book set isremoved=FALSE where isbn=$1',[isbn])
        }else{

            //Insert the book into the book relation
            const addBook = await pool.query("insert into book(isbn,name,genre,price,description,cover_image,pub_id,pub_percent,page_num)"+
                "values($1, $2, $3, $4, $5,$6,$7,$8,$9)",[isbn,book_name,genre, price,description, cover_image, pub_id,pub_percent,page_num])
            
            //Add each of the authors to the author and book_auth relations
            author_list = authors.split(",")
            for(let i = 0;i< author_list.length;i++){
                
                const checkForAuthor = await pool.query("select auth_id from author where auth_name=$1",[author_list[i]])
                auth_id = checkForAuthor.rows.length >0? checkForAuthor.rows[0].auth_id: ""
                
                //If author doesn't already exist in author relation
                if(checkForAuthor.rows.length == 0){
                    const addAuthor = await pool.query("insert into author(auth_name) values($1) returning auth_id",[author_list[i]])
                    auth_id = addAuthor.rows[0].auth_id
                }
                const addBookAuth = await pool.query("insert into book_auth values($1,$2)",[auth_id,isbn])
            }
        }   
        res.redirect("/addbook?success=true")
    }
    catch (err){
        res.redirect("/addbook?success=false")
        console.error(err.message);
    }
})

//Displays page for removing books
app.get("/removebook", async(req,res)=>{
    try{
        //Get list of books with their isbn,name and status
        getBookStatuses = await pool.query("SELECT name,isbn,isremoved from book");
        success =  req.query.success
        res.render("pages/removebook", {
            success : success,
            books: getBookStatuses.rows
        });
    }
    catch (err){
        console.error(err.message);
    }
})

//Handles when owner removes a book from the book store
app.post("/removebook", async(req,res)=>{
    try{
        //Set the isremoved boolean for the book store to true
        isbn = req.body.isbn
        const allBooks = await pool.query("UPDATE book SET isRemoved=TRUE WHERE isbn=$1",[isbn]);
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