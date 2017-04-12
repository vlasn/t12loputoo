
module.exports = input => {
  //person_id
  //from
  //boValue
  //zdValue
  //title
  //description
  errors = []
  //title
  if(input.title.length<3) {
    errors.push("Please make sure you've entered a title!")
  } else if (input.title.length>36) {
    errors.push("Please make sure title is shorter than 36 characters!")
  }

  if(input.description.length<5) {
    errors.push("Please make sure description is more than 5 characters in length!")
  }
  return errors
}