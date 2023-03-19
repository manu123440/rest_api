const express = require('express');

const request = require("request-promise-any");

const router = express.Router();

let selectFunction = (item) => {
  let options = {
    method: "POST",
    url: "https://itslocaltv.io/api/select.php",
    formData: {
      select_query: item,
    },
  };
  return options;
};

router.get('/success', (req, res, next) => {
	let isSuccess = true;
	return res.json({ isSuccess });
	// const email = req.body.email;
	// let opt1 = selectFunction(
	//     "select session_id from users where email = '"
	//     .concat(`${email}`)
	//     .concat("'")
	// );
	// let isSuccess = false;

	// try {
	// 	request(opt1, (error, response) => {
	// 		if (error) throw new Error(error);
	//     else {
	//       let x = JSON.parse(response.body);
	//       // console.log(x);
	//       if(x !== null && x[0] !== undefined) {
	//       	// console.log(x);
	//       	isSuccess = true;
	//       	return res.json({ isSuccess });
	//       }
	//       else {
	//       	isSuccess = false;
	// 				return res.json({
	// 					isSuccess
	// 				})
	//       }
	//    	}
	// 	})
	// }
	// catch(err) {
	// 	success = false;
	// 	return res.json({
	// 		success
	// 	})
	// }
})

module.exports = router;