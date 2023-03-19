const express = require('express');

const request = require('request-promise-any');

const router = express.Router();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Stripe = require("./stripe");

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

let insertFunction = (item, item2) => {
  let options = {
    method: "POST",
    url: "https://itslocaltv.io/api/insert.php",
    formData: {
      insert_query: item,
      select_query: item2,
    },
  };
  return options;
};

router.post('/register', (req, res, next) => {
  const { name, email, password } = req.body;
  // console.log(req.body);

  let opt1 = selectFunction(
    "select * from users where email = '"
      .concat(`${email}`)
      .concat("'")
  );

  let isValid = '';
  let isSuccessfull = false;

  try {
    request(opt1, (error, response) => {
      if (error) throw new Error(error);
      else {
        let z = JSON.parse(response.body);
        // console.log(z === null, z !== null);
        if (z === null) {
          let values1 = `\'${name}\', '${email}\', '${password}\', 'null\', 'null\', 'null\'`;
          let opt2 = insertFunction(
            "insert into users (name, email, password, subs_date, plan, session_id) values("
              .concat(`${values1}`)
              .concat(")"),
            "select * from users where email = '"
              .concat(`${email}`)
              .concat("'")
          )

          request(opt2, async (error, response) => {
            if (error) throw new Error(error);
            else {
              let z1 = JSON.parse(response.body);
              // console.log(z1);

              if (z1 !== null && z1[0] !== undefined) {
                // console.log(z1[0]);
                const customer = await Stripe.addNewCustomer(z1[0].email);
                // console.log(customer);
                isValid = 'user successfully registered';
                isSuccessfull = true;
                // return res.redirect('/v1/checkout1');
                return res.json({ isRegistered: isValid, isSuccessfull });
              }
              else {
                isValid = 'cannot create user';
                // email already exists
                // return res.redirect('/register');
                return res.json({ isRegistered: isValid, isSuccessfull });
              }
            }
          })
        }
        else {
          isValid = 'email already exists';
          // email already exists
          // return res.redirect('/register');
          return res.json({ isRegistered: isValid, isSuccessfull });
        } 
      }
    })
  }
  catch(error) {
    isSuccessfull = false;
    return res.json({ isRegistered: 'Error', isSuccessfull });
  }
})

module.exports = router;