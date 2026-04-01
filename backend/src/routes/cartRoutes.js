const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/', cartController.createCart);
router.get('/user/:userId', cartController.getUserCart);
router.get('/:cartId', cartController.getCart);
router.post('/:cartId/items', cartController.addItem);
router.put('/:cartId/items/:itemId', cartController.updateItem);
router.delete('/:cartId/items/:itemId', cartController.removeItem);
router.delete('/:cartId/clear', cartController.clearCart);

module.exports = router;
