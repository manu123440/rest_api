const express = require('express');

const router = express.Router();

router.get('/checkout1', (req, res, next) => {
	return res.render('checkout1', {
		docTitle: 'Checkout'
	})
})

module.exports = router;