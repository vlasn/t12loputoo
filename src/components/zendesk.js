var Zendesk = require('zendesk-node-api');

var zendesk = new Zendesk({
  url: process.env.ZENDESK_API,
  email: process.env.ZENDESK_EMAIL,
  token: process.env.ZENDESK_APIKEY
});



const postZendeskComment = function(input, ticketId) {
  const contentTemplate = 
    `Sent to Support Engineers by ${input.from} via supportbot:\
    Title: ${input.title}\
    BO: ${input.boData}
    Content: ${input.description}\
    `
  zendesk.tickets.update(ticketId, {
    comment: {body: contentTemplate, public: false}
  }).then(result => console.log(`Successfully posted comment to ZD!`))
}

module.exports = {postZendeskComment}