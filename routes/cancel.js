const express = require('express');

const request = require("request-promise-any");

const router = express.Router();

router.get('/success', (req, res, next) => {
	return res.json({
		'success': false
	})
})

module.exports = router;