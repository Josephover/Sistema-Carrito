const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', upload.single('image'), productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
