const pool = require("./db")

module.exports = {
    buildWhereString: function(query){
        where = []
        select_string = "SELECT * "
        from_string = "FROM booksAuthors "
        where_string = ""
        if(query){
            if(query.book_name && query.book_name.length > 0 ){
                if(query.exact_match){
                    where.push("name='"+query.book_name+"'")
        
                }else{
                    where.push("Lower(name) LIKE Lower('%"+query.book_name+"%')")
                }
            }
            if(query.book_isbn && query.book_isbn.length > 0){
                where.push("isbn='"+query.book_isbn+"'")
            }
            if(query.genre && query.genre.length > 0){
                where.push("genre='"+query.genre+"'")
            }
            if(query.author && query.author.length > 0){
                where.push("authors LIKE '%"+query.author+"%'")
            }
            if(query.price_range){
                where.push("price < "+query.price_range+"")
            }
            if(where.length > 0){
                where_string = " where "+ where.join(" and ")
            }   
        }
        return select_string + from_string + where_string
    },

    mergeCarts: async function(cartId, user_name){
        try {
            getUserCartId = await pool.query("select cart_id from user_cart where username=$1",[user_name])

            user_cart_id = null
            //A cart alreadt exists for this user
            if(getUserCartId.rows.length > 0){
                console.log("cart already exists")
                user_cart_id = getUserCartId.rows[0].cart_id
            }else{
                console.log("cart not exist already. creating one")
                //Create a cart
                createCartForUser = await pool.query("insert into cart values(default) returning cart_id")
                user_cart_id = createCartForUser.rows[0].cart_id
            
                console.log("adding cart to user_cart")
                //Add a reference for that cart for the user
                addUserCart = await pool.query('insert into user_cart values($1,$2)',[user_cart_id,user_name])
            }
        
            console.log('getting cart item values')
            //Get the merged cart 
            getMergedCartValues = await pool.query('select * from merged_rows($1,$2)',[cartId,user_cart_id])

            //Update the cart quantities
            for(let i = 0;i<getMergedCartValues.rows.length;i++){
                console.log(i)
                console.log('updating cart values in merged cart')
                isbn = getMergedCartValues.rows[i].isbn
                quantity = getMergedCartValues.rows[i].book_sum
                setNewCartQuantity = await pool.query('insert into book_cart values($1,$2,$3) on conflict (cart_id,isbn) do update set'
                +' quantity=$3',[isbn,user_cart_id,quantity])
            }

            console.log('deleting old values')
            //Delete the old, not logged in cart items
            deleteCartItems = await pool.query('delete from book_cart where cart_id=$1',[cartId])

            console.log(user_cart_id)
            return user_cart_id

    } catch (err) {
        console.log(err.message)
        return null
    }
        
    }
}