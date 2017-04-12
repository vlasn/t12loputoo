const axios = require("axios")
const auth = `?api_token=${process.env.API_KEY}`
const rootUrl = "https://api.pipedrive.com/v1"
const stage_id = process.env.STAGE_ID


const create = input=> {
  return axios.post(`${rootUrl}/deals${auth}`,{
    "title": input.title,
    "person_id": input.person_id,
    "stage_id": stage_id
  })
}
const addNote = (input, dealId) => {
  return axios.post(`${rootUrl}/notes${auth}`,{
    "content": input.description,
    "deal_id": dealId,
    "pinned_to_deal_flag": 1
  })
}

module.exports = {create, addNote};