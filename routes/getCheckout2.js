const express = require('express');

const router = express.Router();

router.get('/checkout2', (req, res, next) => {
	return res.render('checkout2', {
		  docTitle: 'Checkout2'
	})
})

module.exports = router;