const pool = require("./db")

module.exports = {

    //Creates the where query string for book searches. Returns the constructed
    //query string
    buildWhereString: function(query){
        
        where = []
        select_string = "SELECT * "
        from_string = "FROM booksAuthors "
        where_string = ""
        
        //If there are extra query parameters for the book search
        if(query){

            //User searched for book by name
            if(query.book_name && query.book_name.length > 0 ){
                
                //User did an exact match search for book name
                if(query.exact_match){
                    where.push("name='"+query.book_name+"'")
        
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
                where.push("price < "+query.price_range+"")
            }

            //If any where clauses were added, build the where part of the
            //query string
            if(where.length > 0){
                where_string = " where "+ where.join(" and ")
            }   
        }

        return select_string + from_string + where_string
    },

    //Handles the merging of cart items from a user who has just logged in. Returns the new cart id for the user
    mergeCarts: async function(cartId, user_name){
        try {
            getUserCartId = await pool.query("select cart_id from user_cart where username=$1",[user_name])

            user_cart_id = null

            //A cart alreadt exists for this user
            if(getUserCartId.rows.length > 0){
                user_cart_id = getUserCartId.rows[0].cart_id
            }else{
                //Create a cart
                createCartForUser = await pool.query("insert into cart values(default) returning cart_id")
                user_cart_id = createCartForUser.rows[0].cart_id
            
                //Add a reference for that cart for the user
                addUserCart = await pool.query('insert into user_cart values($1,$2)',[user_cart_id,user_name])
            }
        
            //Get the merged cart 
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

            return user_cart_id

        } catch (err) {
            console.log(err.message)
            return null
        }
        
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

        //Add billing info to db. Return bill id
        createBilling = await pool.query('insert into billing values(default, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)' 
            +' returning bill_id',[first_name,last_name, phone_num, street_num_name, apt, city,province,country,post_code,email,
            credit_num, expiry, cvv])
        
        bill_id = createBilling.rows[0].bill_id

        //Create reference for the billing info for the order number
        createBillOrderReference = await pool.query('insert into order_bill values($1,$2)',[order_id,bill_id])

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

        //Add shipping info to db. Returns ship id
        createShipping = await pool.query('insert into shipping values(default, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)' 
            +' returning ship_id',[first_name,last_name, phone_num, street_num_name, apt, city,province,country,post_code,email])
        
        ship_id = createShipping.rows[0].ship_id

        //Create a reference for the shipping for the order number
        createShipOrderReference = await pool.query('insert into order_ship values($1,$2)',[order_id,ship_id])

        return 
    },

    //Handles adding delivery and tracking info to the db for an order
    handleDelivery: async function(order_id){

        //Add the delivery to the db .Returns the delivery id
        addDelivery = await pool.query('insert into delivery values(default,$1,$2,$3,$4) returning delivery_id',['Toronto','Ontario','Canada',3])
        
        delivery_id = addDelivery.rows[0].delivery_id

        //Add reference for the delivery and order
        addOrderTrack = await pool.query('insert into track_order values($1,$2)',[order_id,delivery_id])

        return
    },

    //Handles querying for sales report info
    handleReport: async function(query){

        //Construct the where string for the query
        where_string = buildSalesWhereString(query)

        getSalesInfo = null

        //Query seperate view for getting reports for authors
        if(query.author  && query.author.length > 0){
            getSalesInfo = await pool.query('select * from author_sale_info '+where_string)
        }else{
            getSalesInfo = await pool.query('select * from book_genre_sale_info '+where_string)
        }

        return getSalesInfo.rows
    },

    //Handles retrieving the summed number of books,sales and expenses for reports
    handleTotals: async function(query){

        //Construct the where string for the query
        where_string = buildSalesWhereString(query)

        getSalesTotals = null

        //Query seperate view for getting reports for authors
        if(query.author && query.author.length > 0){
            getSalesTotals = await pool.query('select sum(quantity) as tot_quantity,'+
                'sum(sale_tot) as tot_sales,'+
                'sum(exp_tot) as tot_expense '+
                'from author_sale_info '+ where_string)
        }else{
            getSalesTotals = await pool.query('select sum(quantity) as tot_quantity,'+
            'sum(sale_tot) as tot_sales,'+
            'sum(exp_tot) as tot_expense '+
            'from book_genre_sale_info '+ where_string)
        }

        return getSalesTotals.rows
    }
}

//Builds the where part of the query for sales info.Returns strings
function buildSalesWhereString(query){
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

    if(where.length > 0){
        where_string = "where "+ where.join(" and ")    
    }
    
    return where_string

}