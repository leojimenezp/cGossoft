const express = require('express');
const router = express.Router();

router.get('/consignaciones', (req,res) => {
    res.render('consignaciones/consignacion')
})

router.get('/consignaciones/agregar', (req,res) => {
    res.render('consignaciones/agregar-consignacion')
})

router.get('/consignaciones/agregar/rubro', (req,res) => {
    res.render('consignaciones/agregar-rubro')
})

module.exports = router;