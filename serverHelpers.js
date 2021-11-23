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
                console.log(where_string)
            }   
        }
        return select_string + from_string + where_string
    },

    buildPublisherString: function(query){
        
    }
}