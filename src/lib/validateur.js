const validator = require("validator")

module.exports = input => {
  //person_id
  //from
  //boType
  //boValue
  //zdValue
  //title
  //description
  errors = []
  //title
  if(input.boType === "e-mail" && !validator.isEmail(input.boData)) {
    errors.push("Please make sure you've entered a valid e-mail!")
  } else if (input.boType === "company-id" && !validator.isInt(input.boData)){
    errors.push("Please make sure you've entered a valid Company ID")
  }

  if(input.title.length<3) {
    errors.push("Please make sure you've entered a title!")
  } else if (input.title.length>36) {
    errors.push("Please make sure title is shorter than 36 characters!")
  }
  //description
  if(input.description.length<5) {
    errors.push("Please make sure description is more than 5 characters in length!")
  }
  return errors
}