const express = require("express")
const dotenv = require("dotenv")
const bodyParser = require("body-parser")
const Validateur = require("./components/validateur.js")
require("dotenv").config()
const app = express()
const cors = require("cors")

app.use(cors())


app.use(bodyParser.json())
app.set('json spaces', 2);

const Pipedrive = require("./components/pipedrive")
const Slack = require("./components/slack")
const Zendesk = require("./components/zendesk")



app.get("/", (req,res)=> {
  res.json("Please go away thanks");
})
app.post("/api/request",(req,res)=>{
    console.log(req.body);
  let errors = Validateur(req.body);
  let ticketId = req.body.zdValue;

  if(req.body.boType == "e-mail") {
    req.body.boData = "https://just-rock.pipedrive.com/backoffice/find?haystack=email_contains&return_type=user&needle="+req.body.boData;
  } else if (req.body.boType == "company-id") {
        req.body.boData= "https://just-rock.pipedrive.com/backoffice/find?haystack=id_is&return_type=company&needle="+req.body.boData;
  } else {
    errors.push("Invalid BO type!")
  }
  req.body.zdValue = "https://pipedrive.zendesk.com/agent/tickets/"+req.body.zdValue;
  if(errors.length <1) {
    Pipedrive.create(req.body)
    .then(response => Pipedrive.addNote(req.body,response.data.data.id))
    .then(response => Slack.post(req.body))
    .then(response => res.json(response.data))
    .then(response => Zendesk.postZendeskComment(req.body,ticketId))
    .catch(e=>console.log(e))
  } else {
    res.json(errors);
  }
})

app.listen(3000, ()=> console.log("Server up."))