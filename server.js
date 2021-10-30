const express = require("express");
const app = express();

app.use(express.json());

app.get("/users", async(req,res)=>{
    try{
        //const allUsers = await pool.query("SELECT * FROM allusers");
        //res.json(allUsers.rows);
        res.json("ok");
    }
    catch (err){
        //console.error(err.message);
    }
})


app.listen(3000, () => {
    console.log("server running on port 3000");
})