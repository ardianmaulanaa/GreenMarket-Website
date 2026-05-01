const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, upgradeUserRole} = require('../controllers/user');

router.put("/upgrade/:id", upgradeUserRole);
router.get('/:id', getProfile);
router.put('/:id', updateProfile);

module.exports = router;