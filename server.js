const express = require("express");
const app = express();
const session = require("express-session")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const pool = require("./db");
const helperFunctions = require ("./serverHelpers"); 
const serverHelpers = require("./serverHelpers");

//Use json
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

//Session info
app.use(cookieParser());
app.use(session({secret:"This is a book store"}));

//Serve static files
app.use(express.static("public"));

//View Engine
app.set("view engine", "pug");

//Displays landing page for the book store
app.get("/", async(req, res)=>{
    try {
        //Render the page
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
        
        //Render the page
        res.render("pages/books", {
            userName : req.session.user_name,
            genres: getGenres.rows,
            authors: getAuthors.rows,
            books: allBooks.rows,
            query: req.query
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
        const bookInfo = await pool.query("SELECT * FROM book_page where isbn=$1",[isbn])
        
        //Get the reviews for the book
        const reviewInfo = await pool.query("SELECT * FROM review where isbn=$1",[isbn])
        
        //Determine the average rating for the book
        const getRating = await pool.query("SELECT * FROM avg_rating($1)",[isbn])
        
        //Convert average rating for the book
        avgRating = ''
        if(getRating.rows.length == 0 || getRating.rows[0].avg_rating == null){
            avgRating = 'N/A'
        }else{
            avgRating = getRating.rows[0].avg_rating.toString()+"/5"
        }
        
        //Render the page
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
        //Render the page
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
        //Render the page
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

        //Create cart for the user
        createCart = await pool.query('insert into cart values(default) returning cart_id')
        cart_id = createCart.rows[0].cart_id

        //Add the user to the store_user relation
        const addUser = await pool.query("Insert into store_user(first_name, last_name, email, username, user_pass, cart_id)"+ 
            "values($1, $2, $3, $4, $5, $6)", [first_name, last_name, email, user_name, user_pass, cart_id]);
        
        //If successful, set the username and redirect to the registration result page
        if(addUser.rowCount > 0){

            //Assign the correct cart id to the logged in user
            old_cart_id = req.session.cartId
            req.session.cartId = cart_id

            //Move items into the assigned cart for the user if there were any as long as the user wasn't already signed in
            //as a different user
            if(old_cart_id && !req.session.user_name){
                changeCartItems = await pool.query('update book_cart set cart_id=$1 where cart_id=$2',[cart_id,old_cart_id])
            }

            //Set username
            req.session.user_name = user_name;

        //If unsuccessful registering, delete the cart
        }else{
            //Delete the cart created for the user
            deleteCart = await pool.query('delete from cart where cart_id=$1',[cart_id])
        }

        //Send user to page showing the result of the registration
        res.redirect("/registrationresult")
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
            
            user_cart_id = checkSignIn.rows[0].cart_id
            
            //If the user had cart items before logging in, merge them with
            //the pre-existing items in the logged in user's cart and 
            //assign a new cart number.Otherwise, get their cart id
            if(req.session.cartId){
                mergeCarts = await helperFunctions.mergeCarts(req.session.cartId, user_cart_id)
            }

            //Assign the user's cart to the user
            req.session.cartId = user_cart_id
            
            //Reload the user's current page
            res.redirect("back");
        
        //If login fails
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
        //Render the page
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
        //Set user id and cart id for the session back to null
        req.session.user_name = null
        req.session.cartId = null

        //Reload page for the user
        res.redirect("back");
    }
    catch (err){
        console.error(err.message);
    }
})

//Displays checkout page to the user
app.get("/checkout", async(req,res)=>{
    try{
        //Only logged in users can checkout, so only get cart contents if they are logged in
        //and have a cart
        cartContents = null
        if(req.session.user_name && req.session.cartId){
            const getCartContents = await pool.query("SELECT * FROM get_cart_items where cart_id=$1",[req.session.cartId]);
            cartContents = getCartContents.rows
        }

        //Render the page
        res.render("pages/checkout", {
            userName: req.session.user_name,
            cart: cartContents
        });
    }
    catch (err){
        console.error(err.message);
    }
})

//Handles when a user tries to checkout
app.post("/checkout", async(req,res)=>{
    try{
        
        //Get cart id and user id from the session
        cart_id = req.session.cartId
        username = req.session.user_name
        
        order_accepted = false
        order_id = null
        low_stock = false

        //Get cost of the order from the request
        ord_cost = req.body.ord_cost

        //Check if there is enough stock to fill the order
        notEnoughBookStock = await pool.query('select * from cant_fill_order($1)',[cart_id])
        
        //If there is enough stock to fill the order
        if(!notEnoughBookStock.rows[0].cant_fill_order){

            //Get the items in the user's cart
            getCartItems = await pool.query('select * from book_cart where cart_id=$1',[cart_id])

            //Create the order. Returns the order id
            createOrder = await pool.query('insert into store_order values(default, current_date,$1,$2) returning order_id',[ord_cost,username])
            
            order_id =createOrder.rows[0].order_id

            //Update the stock number for each book in the cart
            for(let i = 0;i<getCartItems.rows.length;i++){
                quantity = getCartItems.rows[i].quantity
                isbn = getCartItems.rows[i].isbn
                updateBookStock = await pool.query('update book set stock=book.stock-$1 where isbn=$2',[quantity,isbn])
            }

            //Handle insertion of shipping, billing and delivery info in db
            await helperFunctions.handleBilling(req.body, order_id)
            await helperFunctions.handleShipping(req.body, order_id)
            await helperFunctions.handleDelivery(order_id)
        
        //If not enough stock to complete the order
        }else{
            low_stock = true
        }

        //Render the page
        res.render("pages/orderstatus", {
            userName: req.session.user_name,
            orderid: order_id,
            stock_low: low_stock
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

            //Get the items in the user's cart
            const getCartContents = await pool.query("SELECT * FROM get_cart_items where cart_id=$1",[req.session.cartId]);
            cartContents = getCartContents.rows
        }

        //Render the page
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
        //If no cart id, create a cart (for non logged in users)
        if(!req.session.cartId){
            const createCart = await pool.query("insert into cart values(default) returning cart_id");
            req.session.cartId = createCart.rows[0].cart_id
        }

        //Update the contents of the cart
        const updateCart = await serverHelpers.updateCart(req.session.cartId, req.body)

        //Reload the page for the user
        res.redirect("back")
    }
    catch (err){
        console.error(err.message);
    }
})

//Displays page where user can search for the tracking info of their order
app.get("/tracking", async(req,res)=>{
    try{

        //Render the page
        res.render("pages/tracking", {
            userName: req.session.user_name
        });
    }
    catch (err){
        console.error(err.message);
    }
})


//Handles displaying the tracking info for an order
app.get("/tracking/:orderid", async(req,res)=>{
    try{
        exists = false
        order_details = null
        order_items = null
        order_date = null
        order_cost = null

        //Get the order id
        order_id = parseInt(req.params.orderid)
        
        //Check for the order in the db
        const getTrackingInfo = await pool.query("SELECT * FROM delivery where order_id=$1",[order_id]);
        
        //There was delivery info for the order
        if(getTrackingInfo.rows.length > 0){
            exists = true
            order_details = getTrackingInfo.rows[0]
         
            //Get items of the order
            const getOrderItems = await pool.query("SELECT * FROM order_items where order_id=$1",[order_id]);
            order_items = getOrderItems.rows
            order_date = getOrderItems.rows[0].ord_date
            order_cost = getOrderItems.rows[0].ord_cost
        }

        //Render the page
        res.render("pages/tracking_info", {
            userName: req.session.user_name,
            orderExists: exists,
            orderId: order_id,
            trackingInfo: order_details,
            orderItems: order_items,
            orderDate: order_date,
            orderCost: order_cost
        });
        
    }
    catch (err){
        console.error(err.message);
    }
})

//Displays landing page for store owner activities
app.get("/admin", async(req,res)=>{
    try{
        //Render the page
        res.render("pages/admin", {
        });
    }
    catch (err){
        console.error(err.message);
    }
})

//Displays page where owner can create reports
app.get("/createreport", async(req,res)=>{
    try{
        
        //Get list of book genres
        const getGenres = await pool.query("SELECT distinct genre FROM book");
        
        //Get list of authors
        const getAuthors = await pool.query("SELECT auth_name FROM author");

        //Get list of books
        const getBooks = await pool.query("SELECT isbn,name FROM book");

        //Render the page
        res.render("pages/createreport", {
            genres: getGenres.rows,
            authors: getAuthors.rows,
            books: getBooks.rows

        });
    }
    catch (err){
        console.error(err.message);
    }
})

//Handles displaying a report for the owner
app.get("/reports", async(req,res)=>{
    try{
        //Get the sales info matching the specified criteria
        const sales_info = await serverHelpers.handleReport(req.query)
        
        //Get the sales totals matching the specified criteria
        const sales_totals = await serverHelpers.handleTotals(req.query)

        //Render the page
        res.render("pages/reports", {
            salesInfo : sales_info,
            salesTotals: sales_totals
        });
    }
    catch (err){
        console.error(err.message);
    }
})

//Displays admin page where owners can view orders made to publisher for books
app.get("/orders", async(req,res)=>{
    try{
        order_list = null

        //Get list of orders from publishers
        const getWarehouseOrders = await pool.query("SELECT * FROM publisher_orders");
        
        //If list is not empty
        if(getWarehouseOrders.rows.length > 0){
            order_list = getWarehouseOrders.rows
        }

        //Render the publisher orders page
        res.render("pages/pubOrders", {
            orderList: order_list
        });
    }
    catch (err){
        console.error(err.message);
    }
})

//Displays page where store owner can add a book
app.get("/addbook", async(req,res)=>{
    try{
        //If book was added successfully, this will be true.Otherwise false
        success =  req.query.success
        
        //Render the page
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

        //Check if book already exists
        const checkForBook = await pool.query('select * from book where isbn=$1',[req.body.isbn])
         
        //If book already exists, changed it's removed status.Otherwise add it to the db
        if(checkForBook.rows.length > 0){
            const addBackBook = await pool.query('update book set is_removed=FALSE where isbn=$1',[req.body.isbn])
        }else{

            //Add publisher
            pub_id = await serverHelpers.handleAddPublisher(req.body)

            //Add book and its' author(s) to the book store
            addBookAndAuthor = await serverHelpers.handleAddBookAndAuthor(req.body, pub_id)
        }

        //Redirect user for successful book add   
        res.redirect("/addbook?success=true")
    }
    catch (err){
        //Redirect user for unsuccessful book add
        res.redirect("/addbook?success=false")
        console.error(err.message);
    }
})

//Displays page for removing books
app.get("/removebook", async(req,res)=>{
    try{
        //Get list of books with their isbn,name and status
        getBookStatuses = await pool.query("SELECT name,isbn,is_removed from book");
        
        //This will be true when the removal was a success. Otherwise false
        success =  req.query.success
        
        //Render the page
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
        //Set the is_removed boolean for the book store to true
        isbn = req.body.isbn
        const removedBook = await pool.query("UPDATE book SET is_removed=TRUE WHERE isbn=$1",[isbn]);
        
        
        if(removedBook.rowCount > 0){
            //Redirect user for a successful book removal
            res.redirect("/removebook?success=true")
        }else{
            //Redirect user for an unsuccessful book removal
            res.redirect("/removebook?success=false")
        }
    }
    catch (err){
        //Redirect user for an unsuccessful book removal
        res.redirect("/removebook?success=false")
        console.error(err.message);
    }
})

//Listen on port 3000
app.listen(3000, () => {
    console.log("server running on port 3000");
})