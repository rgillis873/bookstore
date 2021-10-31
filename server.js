const express = require("express");
const app = express();
const pool = require("./db")

app.use(express.json());
app.use(express.static("public"));
//View Engine
app.set("view engine", "pug");

app.get("/", async(req, res)=>{
    try {
        res.render("pages/index", {

        });
    } catch (error) {
        console.error(err.message);
    }
})

app.get("/books", async(req,res)=>{
    try{
        const allBooks = await pool.query("SELECT * FROM book");
        //res.json(allBooks.rows);
        res.render("pages/books", {
            books: allBooks.rows
        });
    }
    catch (err){
        console.error(err.message);
    }
})


app.listen(3000, () => {
    console.log("server running on port 3000");
})