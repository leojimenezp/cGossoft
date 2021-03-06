const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/personal', isLoggedIn, async (req, res) => {
    const personal = await pool.query('SELECT * FROM tb_personal p,tb_cargos c WHERE p.id_cargo=c.id_cargo');
    res.render('personal/personal', { personal });
});

router.get('/personal/crear', isLoggedIn, async (req, res) => {
    const cargos = await pool.query('SELECT id_cargo,nombre_cargo FROM tb_cargos WHERE estado_cargo = ?',[1]);
    const bases = await pool.query('SELECT id_base,nombre_base FROM tb_bases WHERE estado_base = ?',[1]);
    res.render('personal/crear', {cargos,bases});
});

router.post('/personal',isLoggedIn, async (req, res) => {

    const { numero_documento_personal} = req.body;
    const descripcion_bitacora = "El usuario "+req.user.username+" creó un personal nuevo con No. de documento "+numero_documento_personal;

    const bitacora = {
        descripcion_bitacora: descripcion_bitacora,
        id_user: req.user.id
    };

    const array = req.body;
    console.log(array);

    const rows = await pool.query('SELECT id FROM tb_personal WHERE numero_documento_personal = ?', [numero_documento_personal]);
    
    if (rows.length > 0) {
        
     req.flash('error', 'El No. documento ya existe!');
     res.redirect('personal/crear');

    }else{
     
        await pool.query('INSERT INTO tb_personal set ?', [array]);
        await pool.query('INSERT INTO tb_bitacora set ?', [bitacora]);
    
        req.flash('success', 'Registro exitoso!');
    
        res.redirect('personal');

    }

});

router.get('/editar-personal/:id', isLoggedIn, async (req, res) => {
    
    const { id } = req.params;
    const personal = await pool.query('SELECT * FROM tb_personal WHERE id = ?', [id]);
    const cargos = await pool.query('SELECT id_cargo,nombre_cargo FROM tb_cargos WHERE estado_cargo = ?',[1]);
    const bases = await pool.query('SELECT id_base,nombre_base FROM tb_bases WHERE estado_base = ?',[1]);

    res.render('personal/editar', { personal: personal[0], cargos, bases});
});

router.get('/ver-personal/:id', isLoggedIn, async (req, res) => {
    
    const { id } = req.params;
    const personal = await pool.query('SELECT * FROM tb_personal p,tb_cargos c,tb_bases b WHERE p.id ='+id+' AND p.id_cargo=c.id_cargo AND p.id_base=b.id_base');

    res.render('personal/ver', { personal: personal[0]});
});

router.post('/editar-personal/:id', isLoggedIn , async (req, res) => {

    const { id } = req.params;
    const { numero_documento_personal} = req.body;
    const array = req.body; 
    const descripcion_bitacora = "El usuario "+req.user.username+" modificó el personal con No. de documento "+numero_documento_personal;

    const bitacora = {
        descripcion_bitacora: descripcion_bitacora,
        id_user: req.user.id
    };

    await pool.query('UPDATE tb_personal set ? WHERE id = ?', [array, id]);

    await pool.query('INSERT INTO tb_bitacora set ?', [bitacora]);

    req.flash('success', 'Registro moficicado exitosamente!');
    res.redirect('/personal');
});

module.exports = router;