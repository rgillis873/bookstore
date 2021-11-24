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
        getUserCartId = await pool.query("select cart_id from user_cart where username=$1",user_name)

        user_cart_id = null
        //A cart alreadt exists for this user
        if(getUserCartId.rows.length > 0){
            user_cart_id = getUserCartId.rows[0].cart_id
        }else{
            //Create a cart
            createCartForUser = await pool.query("insert into cart values(defualt) returning cart_id")
            user_cart_id = createCartForUser.rows[0].cart_id
            
            //Add a reference for that cart for the user
            addUserCart = await pool.query('insert into user_cart values($1,$2)',[user_cart_id,user_name])
        }
        getMergedCartValues = await pool.query('select * from merged_rows($1,$2)',[cartId,user_cart_id])




    }
}