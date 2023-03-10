const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const client = require("@mailchimp/mailchimp_marketing");
const auth = require(__dirname + "/apikey.js");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

client.setConfig({
    apiKey: auth.api_key,
    server: auth.api_server,
  });

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res){
    const firstName = req.body.inputFirstName;
    const lastName = req.body.inputLastName;
    const email = req.body.inputEmail

    const listId = "b1c4a8af82";

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const run = async () => {
        const response = await client.lists.batchListMembers(listId, data);
        console.log(response.error_count);
        if (response.error_count === 0) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }
      };



    run();

})

app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(3000, function(req, res){
    console.log("Server running on 3000");
})