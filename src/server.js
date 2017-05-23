const express = require("express")
const dotenv = require("dotenv")
const bodyParser = require("body-parser")
const Validateur = require("./components/validateur.js")
require("dotenv").config()
const app = express()
const cors = require("cors")

app.use(cors())

//Mongo:
const mongoose = require("mongoose")
mongoose.connect('mongodb://localhost:27017/kt2')
const db = mongoose.connection
db.on('error', console.error.bind(console,'connection:error'))
db.once('open', ()=> console.log('MongoDB up!'))


app.use(bodyParser.json())
app.set('json spaces', 2);

const Pipedrive = require("./components/pipedrive")
const Slack = require("./components/slack")
const Zendesk = require("./components/zendesk")
const logger = require("./components/logger")



app.get("/api/:count", (req,res)=> {
  logger.get(req.params.count)
    .then(data => res.json(data))
    .catch(e => res.json(e))
})

app.post("/api/request", (req,res)=>{
  console.log(req.body);
  let errors = Validateur(req.body);
  let temp = req.body.zdValue.split("/")
  let ticketId = parseInt(temp[temp.length-1])


  if(req.body.boType == "e-mail") {
    req.body.boData = "https://just-rock.pipedrive.com/backoffice/find?haystack=email_contains&return_type=user&needle="+req.body.boData;
  } else if (req.body.boType == "company-id") {
        req.body.boData= "https://just-rock.pipedrive.com/backoffice/find?haystack=id_is&return_type=company&needle="+req.body.boData;
  } else {
    errors.push("Invalid BO type!")
  }
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
  let details = {
    person_id: req.body.person_id,
    from: req.body.from,
    boType: req.body.boType,
    boValue: req.body.boValue,
    zdValue: req.body.zdValue,
    title: req.body.title,
    description: req.body.description
  }
  logger.log(details,errors)
    .then(result => console.log("added MongoDB object!"))
    .catch(e => console.log(e))
})

app.listen(3000, ()=> console.log("Server up."))
