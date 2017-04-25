const axios = require("axios"),
      hook = process.env.SLACK_URL
module.exports = {
  post: (input)=>{
    return axios.post(hook, JSON.stringify({
      "text":  `New request from ${input.from}:`,
      "attachments": [
          {	
        "title": input.title,
        "text": `${input.description} \n Backoffice: ${input.boValue} \n Zendesk: ${input.zdValue}`,
        "color": "warning"
          }
      ]
    }))
  }
}