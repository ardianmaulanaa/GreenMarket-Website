const express = require('express');
const router  = express.Router({ mergeParams: true });
const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
} = require('../controllers/address');

router.get('/:id_user',           getAddresses);
router.post('/:id_user',          addAddress);
router.put('/:id_user/:id_alamat', updateAddress);
router.delete('/:id_user/:id_alamat', deleteAddress);

module.exports = router;