const pool = require("./db")

module.exports = {

    //Creates the where query string for book searches. Returns the constructed
    //query string
    buildWhereString: function(query){
        
        where = []
        select_string = "SELECT * "
        from_string = "FROM books_authors "
        where_string = ""
        
        //If there are extra query parameters for the book search
        if(query){

            //User searched for book by name
            if(query.book_name && query.book_name.length > 0 ){
                
                //User did an exact match search for book name
                if(query.exact_match){
                    where.push("name='"+query.book_name+"'")
                
                //User did not do exact match for book name
                }else{
                    where.push("Lower(name) LIKE Lower('%"+query.book_name+"%')")
                }
            }

            //User searched by isbn
            if(query.book_isbn && query.book_isbn.length > 0){
                where.push("isbn='"+query.book_isbn+"'")
            }

            //User searched by genre
            if(query.genre && query.genre.length > 0){
                where.push("genre='"+query.genre+"'")
            }

            //User searched by author
            if(query.author && query.author.length > 0){
                where.push("authors LIKE '%"+query.author+"%'")
            }

            //Specified price range for the book search
            if(query.price_range){
                where.push("price <= "+query.price_range+"")
            }

            //If any where clauses were added, build the where part of the
            //query string
            if(where.length > 0){
                where_string = " where "+ where.join(" and ")
            }   
        }

        return select_string + from_string + where_string
    },

    //Handles the merging of cart items from a user who has just logged in.
    mergeCarts: async function(cartId, user_cart_id){
        try {
            //Get the merged cart values
            getMergedCartValues = await pool.query('select * from merged_rows($1,$2)',[cartId,user_cart_id])

            //Update the cart quantities
            for(let i = 0;i<getMergedCartValues.rows.length;i++){
                isbn = getMergedCartValues.rows[i].isbn
                quantity = getMergedCartValues.rows[i].book_sum
                setNewCartQuantity = await pool.query('insert into book_cart values($1,$2,$3) on conflict (cart_id,isbn) do update set'
                +' quantity=$3',[isbn,user_cart_id,quantity])
            }

            //Delete the old, not logged in cart items
            deleteCartItems = await pool.query('delete from book_cart where cart_id=$1',[cartId])
            
            //Delete the old cart
            deleteCart = await pool.query('delete from cart where cart_id=$1',[cartId])

            return

        } catch (err) {
            console.log(err.message)
            return
        }
        
    },

    //Handles when a user makes an update to their cart of books
    updateCart: async function(cartId, body){
        
        //If user is removing a book from the cart
        if(body.remove){
            //Get the isbn of the book being removed
            isbn = body.remove

            //Delete the book from the cart
            const updateCartContents = await pool.query("delete from book_cart where isbn=$1 and cart_id=$2", [isbn,cartId]);
        }

        //If user is adding more books to the cart
        else if(body.add){
            
            //Get the isbn and quantity of the book being added
            isbn = body.add
            new_quantity = body.quantity
            
            //Add the book to the cart. May be adding more to a book that is already in the cart
            const addOrUpdateCartContents = await pool.query("insert into book_cart values($1,$2,$3) on conflict (cart_id,isbn) do update set"
                +" quantity=book_cart.quantity+$3",[isbn, cartId, new_quantity]);
        }

        //If user is updating the quantity of a book in their cart
        else if(body.update){
            
            //Get the isbn and new quantity of the book being updated
            isbn = body.update
            new_quantity = body.quantity

            //Update the quantity of the book in the cart
            const updateCartContents = await pool.query("update book_cart set quantity=$1 where isbn=$2 and cart_id=$3",
                [new_quantity, isbn, cartId]);
        }
    },

    //Handles adding a publisher to the bookstore
    handleAddPublisher: async function(body){
        
        //Get publisher info
        pub_name = body.publisher_name
        street_num_name = body.publisher_street_name
        office_num = body.publisher_office
        city = body.publisher_city
        province = body.publisher_province
        country = body.publisher_country
        post_code = body.publisher_post
        email = body.publisher_email
        phone_num = body.publisher_phone
        bank_account = body.publisher_account 
 
        //Check if publisher already exists
        checkPublisher = await pool.query("select pub_id from publisher where pub_name=$1 and email=$2",[pub_name, email])
         
        //Set publisher id if it already existed
        pub_id = checkPublisher.rows.length > 0 ?checkPublisher.rows[0].pub_id : null
 
        //Add publisher if they don't exist
        if(checkPublisher.rows.length == 0){
 
            //Add address if it doesn't already exist. Get id of the address whether it existed or not
            addAddress = await pool.query('select * from insert_or_return_address($1,$2,$3,$4,$5,$6)', [street_num_name, office_num,
                  city, province, country, post_code])
 
            //Get the add_id
            add_id = addAddress.rows[0].insert_or_return_address
 
             
            addPublisher = await pool.query("insert into publisher(pub_name, add_id,email,bank_account)"
                 +"values($1,$2,$3,$4) returning pub_id",[pub_name,add_id,email,bank_account])

            pub_id = addPublisher.rows[0].pub_id

            //Add publisher phone numbers if it didn't already exist
            phone_numbers = phone_num.split(',')
            for(let i = 0;i<phone_numbers.length;i++) {
                addPhone = await pool.query("insert into phone values($1,$2)",[phone_numbers[i], pub_id])
            }
         }
 
         return pub_id
    },

    //Handles adding a new book and its' author(s) to the book store
    handleAddBookAndAuthor: async function(body, pub_id){
        
        //Get book information
        book_name = body.book_name
        authors = body.authors
        isbn = body.isbn
        price = parseFloat(body.price)
        genre = body.genre
        page_num = body.pages
        description = JSON.stringify(body.description)
        pub_percent = parseInt(body.publisher_percent)
        cover_image = body.cover_image
         
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
        
        return
    },

    //Handles adding billing info for an order to the db
    handleBilling: async function(body, order_id){
        
        //Get billing info
        first_name = body.bill_first
        last_name = body.bill_last
        email = body.bill_email
        phone_num = body.bill_phone
        street_num_name = body.bill_street
        apt = body.bill_apt == ''?null:body.bill_apt
        city = body.bill_city
        province = body.bill_prov
        country = body.bill_country
        post_code = body.bill_post
        credit_num = body.bill_card
        expiry = body.bill_expiry
        cvv = body.bill_cvv

        //Add address if it doesn't already exist. Get id of the address whether it existed or not
        addAddress = await pool.query('select * from insert_or_return_address($1,$2,$3,$4,$5,$6)', [street_num_name, apt, city, province, country, post_code])

        //Get the add_id
        add_id = addAddress.rows[0].insert_or_return_address

        //Add credit card to db if it wasn't already there
        addCreditCard = await pool.query('insert into credit_card values($1,$2,$3) on conflict do nothing',[credit_num, expiry, cvv])

        //Add billing info to db
        createBilling = await pool.query('insert into billing values(default, $1, $2, $3, $4, $5, $6, $7)' 
            ,[first_name,last_name, phone_num, add_id,email,
            credit_num, order_id])
        
        return 

    },

    //Handles adding shipping info for an order to the db
    handleShipping: async function(body, order_id){
        
        //Get shipping info
        first_name = body.ship_first
        last_name = body.ship_last
        email = body.ship_email
        phone_num = body.ship_phone
        street_num_name = body.ship_street
        apt = body.ship_apt == ''?null:body.ship_apt
        city = body.ship_city
        province = body.ship_prov
        country = body.ship_country
        post_code = body.ship_post

        //Add address if it doesn't already exist. Get id of the address whether it existed or not
        addAddress = await pool.query('select * from insert_or_return_address($1,$2,$3,$4,$5,$6)',
            [street_num_name, apt, city, province, country, post_code])

        //Get the add_id
        add_id = addAddress.rows[0].insert_or_return_address

        //Add shipping info to db
        createShipping = await pool.query('insert into shipping values(default, $1, $2, $3, $4, $5, $6)' 
            ,[first_name,last_name, phone_num, add_id,email, order_id])
        
        return 
    },

    //Handles adding delivery and tracking info to the db for an order
    handleDelivery: async function(order_id){
  
        //Add the delivery to the db
        addDelivery = await pool.query('insert into delivery values(default,$1,$2,$3,$4,$5)',['Toronto','Ontario','Canada',3, order_id])
        
        return
    },

    //Handles querying for sales report info. Returns the selected rows from the db
    handleReport: async function(query){

        //Construct the where string for the query
        where_string = buildSalesWhereString(query)

        getSalesInfo = null

        //Query seperate view for getting reports for authors
        if(query.author  && query.author.length > 0){
            getSalesInfo = await pool.query('select * from author_sale_info '+where_string)
        //All other reports
        }else{
            getSalesInfo = await pool.query('select * from book_genre_sale_info '+where_string)
        }

        return getSalesInfo.rows
    },

    //Handles retrieving the summed number of books,sales and expenses for reports.Returns selected rows from db
    handleTotals: async function(query){

        //Construct the where string for the query
        where_string = buildSalesWhereString(query)

        getSalesTotals = null

        //Query seperate view for getting report totals for authors
        if(query.author && query.author.length > 0){
            getSalesTotals = await pool.query('select sum(quantity) as tot_quantity,'+
                'sum(sale_tot) as tot_sales,'+
                'sum(amount) as tot_expense '+
                'from author_sale_info '+ where_string)
        //All other report totals
        }else{
            getSalesTotals = await pool.query('select sum(quantity) as tot_quantity,'+
            'sum(sale_tot) as tot_sales,'+
            'sum(amount) as tot_expense '+
            'from book_genre_sale_info '+ where_string)
        }

        return getSalesTotals.rows
    }
}

//Builds the where part of the query for sales info.Returns the where string
function buildSalesWhereString(query){
    //Get query criteria
    genre = query.genre
    author = query.author
    year = query.year
    month = query.month
    isbn = query.isbn

    where = []
    where_string = ""

    //If the user searched by genre
    if(genre && genre.length > 0){
        where.push("genre='"+genre+"'")
    }

    //If the user searched by author
    if(author && author.length > 0){
        where.push("auth_name='"+author+"'")
    }

    //If the user searched by year
    if(year && year.length > 0){
        where.push("EXTRACT(year FROM sale_date)="+parseInt(year))
    }

    //If user searched by book
    if(isbn && isbn.length > 0){
        where.push("isbn='"+isbn+"'")
    }

    //If the user searched by month
    if(month && month.length > 0){
        where.push("EXTRACT(month FROM sale_date)="+parseInt(month))
    }

    //If there was a criteria specified, construct the where string
    if(where.length > 0){
        where_string = "where "+ where.join(" and ")    
    }
    
    return where_string

}