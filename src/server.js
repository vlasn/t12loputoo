const express = require("express")
const dotenv = require("dotenv")
const bodyParser = require("body-parser")
require("dotenv").config()
const app = express()


app.use(bodyParser.json())
app.use(expressValidator());
app.set('json spaces', 2);

const Pipedrive = require("./lib/pipedrive")
const Slack = require("./lib/slack")
let testData = {
  person_id: 337,
  from: "@veljo",
  boValue: "test@pipedrive.com",
  zdValue: "23443223",
  title: "Hello who is this",
  description: "Hello this is dog"
}
app.get("/", (req,res)=> {
  res.json("Please go away thanks");
})
app.post("/request",(req,res)=>{
  let errors = Validateur(req.body);
  if(req.body.boType == "e-mail") {
    req.body.boData = "https://just-rock.pipedrive.com/backoffice/find?haystack=email_contains&return_type=user&needle="+req.body.boData;
  } else if (req.body.boType == "company-id") {
        req.body.boData= "https://just-rock.pipedrive.com/backoffice/find?haystack=id_is&return_type=company&needle="+req.body.boData;
  } else {
    errors.push("Invalid BO type!")
  }
  req.body.zdValue = "https://pipedrive.zendesk.com/agent/tickets/"+req.body.zdValue;
  console.log(req.body);
  if(errors.length <1) {
    Pipedrive.create(req.body)
    .then(response => Pipedrive.addNote(req.body,response.data.data.id))
    .then(response => Slack.post(req.body))
    .then(response => res.json(response.data))
    .catch(e=>console.log(e))
  } else {
    res.json(errors);
  }
})

app.listen(3000, ()=> console.log("Server up."))