const express = require("express")
const dotenv = require("dotenv")
const bodyParser = require("body-parser")
require("dotenv").config()
const app = express()


app.use(bodyParser.json())
app.set('json spaces', 2);

const Pipedrive = require("./lib/pipedrive")
const Slack = require("./lib/slack")
const Validateur = require("./lib/validateur")
let testData = {
  person_id: 337,
  from: "@veljo",
  boValue: "test@pipedrive.com",
  zdValue: "23443223",
  title: "Hello who is this",
  description: "Hello this is dog"
}
app.get("/", (req,res)=> {
  Pipedrive.create(testData)
  .then(response => Pipedrive.addNote(testData,response.data.data.id))
  .then(response => Slack.post(testData))
  .then(response => res.json(response.data))
  .catch(e=>console.log(e))
})
app.post("/request",(req,res)=>{
  let errors = Validateur(req.body);
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