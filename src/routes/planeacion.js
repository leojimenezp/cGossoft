const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/planeacion', isLoggedIn, async (req,res) => {
    res.render('planeacion/planeacion');
})

router.get('/planeacion/agregar', isLoggedIn, async (req,res) => {

    const clientes = await pool.query("SELECT id_cliente,contacto_cliente FROM tb_clientes");
    const personal = await pool.query("SELECT id,nombre_personal,apellido_personal FROM tb_personal");
    const centro_costos = await pool.query("SELECT id_centro_costo,nombre_centro_costo FROM tb_centro_costos");
    const contratos = await pool.query("SELECT id_contrato,descripcion_contrato FROM tb_contratos");
    const campos = await pool.query("SELECT id_campo,nombre_campo FROM tb_campos");
    const monedas = await pool.query("SELECT id_moneda,abreviatura_moneda FROM tb_monedas");

    res.render('planeacion/agregar-planeacion', {
        clientes: clientes,
        personal: personal,
        centro_costos: centro_costos,
        contratos: contratos,
        campos: campos,
        monedas: monedas
    });
})

router.post('/consultarPlaneacion', isLoggedIn, async (req,res) => {

    const { titulo } = req.body;
    const datos = req.body;
    const consulta = await pool.query(`SELECT ie.id_planeacion ,ie.titulo, ie.fecha_estimada, p.razon_social_proveedor, pe.nombre_personal, pe.apellido_personal, c.abreviatura_centro_costo, co.descripcion_contrato, ca.nombre_campo, m.abreviatura_moneda FROM tb_planeacion ie, tb_proveedor p, tb_personal pe, tb_centro_costos c, tb_contratos co, tb_campos ca, tb_monedas m WHERE ie.id_cliente = p.id_proveedor AND ie.id_personal = pe.id AND ie.id_centro_costo = c.id_centro_costo AND ie.id_contrato = co.id_contrato AND ie.id_campo = ca.id_campo AND ie.id_moneda = m.id_moneda AND ie.titulo = '${titulo}'`);
    console.log(consulta);

    res.render('planeacion/planeacion', {
        consulta: consulta,
        json: JSON.stringify(consulta)
    })

})

router.post('/agregarPlaneacion', isLoggedIn, async (req,res) => {

    const { 
        titulo,
        id_cliente,
        contacto,
        telefono,
        email,
        fecha_contacto,
        hora_contacto,
        id_personal,
        id_centro_costo,
        fecha_estimada,
        id_contrato,
        alojamiento,
        combustible,
        iluminacion,
        seguridad_fisica,
        personal,
        id_campo,
        id_personal_supervisor,
        id_moneda,
        trm,
        objetivo_trabajo,
        requisito_hse,
        observacion
     } = req.body;
     const datos = req.body;
     
     if(titulo == '') console.log('El titulo esta vacio')
     if(id_cliente == '') console.log('El cliente esta vacio')
     if(contacto == '') console.log('El contacto esta vacio')
     if(telefono == '') console.log('El telefono esta vacio')
     if(email == '') console.log('El email esta vacio')
     if(fecha_contacto == '') console.log('La fecha de contacto esta vacio')
     if(hora_contacto == '') console.log('La hora del contacto esta vacio')
     if(id_personal == '') console.log('El id personal etsa vacio')
     if(id_centro_costo == '') console.log('El centro de costos esta vacio')
     if(fecha_estimada == '') console.log('La fecha estimada esta vacia')
     if(id_contrato == '') console.log('El contrato esta vacio')
     if(alojamiento == '') console.log('El alojamiento esta vacio')
     if(combustible == '') console.log('El combustible esta vacio')
     if(iluminacion == '') console.log('La iluminacion esta vacia')
     if(seguridad_fisica == '') console.log('La seguridad fisica esta vacia')
     if(personal == '') console.log('El personal esta vacio')
     if(id_campo == '') console.log('El campo esta vacio')
     if(id_personal_supervisor == '') console.log('El supervisor esta vacio')
     if(id_moneda == '') console.log('La moneda esta vacia')
     if(trm == '') console.log('El trm esta vacio')
     if(objetivo_trabajo == '') console.log('El objetivo del trabajo esta vacio')
     if(requisito_hse == '') console.log('El requisito hse esta vacio')
     if(observacion == '') console.log('La observacion esta vacio')

    await pool.query("INSERT INTO tb_planeacion SET ?", [datos]);
    res.redirect('/planeacion');

})

// Testing chart.js with HBS and node js

router.get('/planeacion/graficas/:id_planeacion', isLoggedIn, async (req,res) => {

    const { id_planeacion } = req.params;
    const numeros = await pool.query("SELECT id FROM tb_personal");
    const consulta = await pool.query("SELECT id_planeacion FROM tb_planeacion WHERE id_planeacion = ?", [id_planeacion]);

    // Equipos

    const tb_equipo_item_equipo_herramienta = await pool.query(`SELECT ie.id_equipo_item_equipo_herramienta, ie.cantidad, ie.gasto, ie.gasto_standby, ie.contado, ie.credito, ie.observaciones ,e.codigo_equipo, u.nombre_unidad_medida, r.sigla_rubro, m.abreviatura_moneda FROM tb_equipo_item_equipo_herramienta ie, tb_equipos e, tb_unidad_medida u, tb_rubros r, tb_monedas m WHERE ie.id_equipo_herramienta = e.id_equipo AND ie.id_unidad_medida = u.id_unidad_medida AND ie.id_rubro = r.id_rubro AND ie.id_moneda = m.id_moneda AND ie.id_planeacion = '${id_planeacion}'`);
    const tb_equipo_item_personal = await pool.query(`SELECT ie.id_equipo_item_personal, ie.cantidad, ie.costo, c.nombre_cargo, p.nombre_personal, p.apellido_personal, u.abreviatura_unidad_medida, r.sigla_rubro, m.abreviatura_moneda FROM tb_equipo_item_personal ie, tb_cargos c, tb_personal p, tb_unidad_medida u, tb_rubros r, tb_monedas m WHERE ie.id_cargo = c.id_cargo AND ie.id_personal = p.id AND ie.id_unidad_medida = u.id_unidad_medida AND ie.id_rubro = r.id_rubro AND ie.id_planeacion = '${id_planeacion}'`);
    const tb_equipo_item_combustible = await pool.query(`SELECT ie.id_equipo_item_combustible, i.descripcion_item, r.sigla_rubro, u.abreviatura_unidad_medida, ie.costo_unitario, ie.cantidad, ie.contado, ie.credito, m.abreviatura_moneda FROM tb_equipo_item_combustible ie, tb_item i, tb_rubros r, tb_unidad_medida u, tb_monedas m WHERE ie.id_item = i.id_item AND ie.id_moneda = m.id_moneda AND ie.id_rubro = r.id_rubro AND ie.id_unidad_medida = u.id_unidad_medida AND ie.id_planeacion = '${id_planeacion}'`);
    const tb_equipo_item_imprevistos = await pool.query(`SELECT ie.id_equipo_item_imprevisto, ie.descripcion, ie.fecha_imprevisto, ie.cantidad, ie.costo_unitario, ie.contado, ie.credito, r.sigla_rubro, u.abreviatura_unidad_medida, m.abreviatura_moneda FROM tb_equipo_item_imprevistos ie, tb_rubros r, tb_unidad_medida u, tb_monedas m WHERE ie.id_rubro = r.id_rubro AND ie.id_moneda = m.id_moneda AND ie.id_unidad_medida = u.id_unidad_medida AND ie.id_planeacion = '${id_planeacion}'`);

    // Movilizacion

    const tb_mov_item_vehiculos = await pool.query(`SELECT ie.id_mov_item_vehiculo, ie.cantidad, e.nombre_equipo, ie.gasto, ie.gasto_standby, ie.contado, ie.credito, ie.observaciones, e.placa_equipo, u.abreviatura_unidad_medida, m.abreviatura_moneda, r.sigla_rubro FROM tb_mov_item_vehiculos ie, tb_equipos e, tb_unidad_medida u, tb_monedas m, tb_rubros r WHERE ie.vehiculo = e.id_equipo AND ie.id_unidad_medida = u.id_unidad_medida AND ie.id_moneda = m.id_moneda AND ie.id_rubro = r.id_rubro AND ie.id_planeacion = '${id_planeacion}'`);
    const tb_mov_item_personal = await pool.query(`SELECT ie.id_mov_item_personal, ie.cantidad, ie.costo, c.nombre_cargo, p.nombre_personal, p.apellido_personal, u.abreviatura_unidad_medida, r.sigla_rubro, e.placa_equipo, a.descripcion, m.abreviatura_moneda FROM tb_mov_item_personal ie, tb_cargos c, tb_personal p, tb_unidad_medida u, tb_rubros r, tb_equipos e, tb_tipo_asignacion a, tb_monedas m WHERE ie.id_cargo = c.id_cargo AND ie.id_personal = p.id AND ie.id_unidad_medida = u.id_unidad_medida AND ie.id_rubro = r.id_rubro AND ie.id_equipo = e.id_equipo AND ie.id_tipo_asignacion = a.id_tipo_asignacion AND ie.id_moneda = m.id_moneda AND ie.id_planeacion = '${id_planeacion}'`);
    const tb_mov_item_combustibles = await pool.query(`SELECT ie.id_mov_item_combustible, ie.cantidad, ie.costo_unitario, ie.contado, ie.credito, i.descripcion_item, r.sigla_rubro, u.abreviatura_unidad_medida, m.abreviatura_moneda, r.nombre_rubro FROM tb_mov_item_combustibles ie, tb_item i, tb_rubros r, tb_unidad_medida u, tb_monedas m WHERE ie.id_item = i.id_item AND ie.id_rubro = r.id_rubro AND ie.id_unidad_medida = u.id_unidad_medida AND ie.id_moneda = m.id_moneda AND ie.id_planeacion = '${id_planeacion}'`);
    const tb_mov_item_imprevistos = await pool.query(`SELECT ie.id_mov_item_imprevisto, ie.fecha_imprevisto, ie.descripcion, ie.cantidad, ie.costo_unitario, ie.contado, ie.credito, r.sigla_rubro, u.abreviatura_unidad_medida, m.abreviatura_moneda FROM tb_mov_item_imprevistos ie, tb_rubros r, tb_unidad_medida u, tb_monedas m WHERE ie.id_rubro = r.id_rubro AND ie.id_moneda = m.id_moneda AND ie.id_unidad_medida = u.id_unidad_medida AND ie.id_planeacion = '${id_planeacion}'`);

    console.log(consulta)

    var num = [];

    for(var numero of numeros){
        num.push(numero.id);
        console.log(num);
    }

    res.render('planeacion/planeacion-datos', {

        tb_equipo_item_equipo_herramienta: tb_equipo_item_equipo_herramienta,
        tb_equipo_item_personal: tb_equipo_item_personal,
        tb_equipo_item_combustible: tb_equipo_item_combustible,
        tb_equipo_item_imprevistos: tb_equipo_item_imprevistos,

        tb_mov_item_vehiculos: tb_mov_item_vehiculos,
        tb_mov_item_personal: tb_mov_item_personal,
        tb_mov_item_combustibles: tb_equipo_item_combustible,
        tb_mov_item_imprevistos: tb_mov_item_imprevistos,

        numeros: JSON.stringify(num),
        consulta: consulta
    });
})

router.get('/modificarPlaneacion/:id_planeacion', isLoggedIn, async (req,res) => {

    const { id_planeacion } = req.params;
    const consulta = await pool.query("SELECT * FROM tb_planeacion WHERE id_planeacion = ?", [id_planeacion]);

    const tipos_trabajo = await pool.query("SELECT id_tipo_trabajo, descripcion_tipo_trabajo FROM tb_tipo_trabajos");
    const tipos_trabajo_planeacion = await pool.query(`SELECT t.descripcion_tipo_trabajo, ie.id_tipo_trabajo_planeacion FROM tb_tipo_trabajo_planeacion ie, tb_tipo_trabajos t WHERE ie.id_tipo_trabajo = t.id_tipo_trabajo AND ie.id_planeacion = '${id_planeacion}'`);
    const pozos = await pool.query("SELECT id_pozo, nombre_pozo FROM tb_pozos");
    const pozos_planeacion = await pool.query(`SELECT p.nombre_pozo, ie.id_pozo_planeacion FROM tb_pozos_planeacion ie, tb_pozos p WHERE ie.id_pozo = p.id_pozo AND ie.id_planeacion = '${id_planeacion}'`);

    console.log(pozos_planeacion);

    res.render('planeacion/planeacion-modificar', {
        tipos_trabajo: tipos_trabajo,
        tipos_trabajo_planeacion: tipos_trabajo_planeacion,
        pozos: pozos,
        pozos_planeacion: pozos_planeacion,
        consulta: consulta,
    })
})

router.post('/agregarTipoTrabajo', isLoggedIn, async (req,res) => {

    const {
        id_planeacion,
        id_tipo_trabajo
    } = req.body;

    const datos = req.body;

    await pool.query("INSERT INTO tb_tipo_trabajo_planeacion SET ?", [datos]);
    res.redirect('/planeacion');

})

router.get('/eliminarTipoTrabajo/:id_tipo_trabajo_planeacion', isLoggedIn, async (req,res) => {

    const { id_tipo_trabajo_planeacion } = req.params;

    await pool.query("DELETE FROM tb_tipo_trabajo_planeacion WHERE id_tipo_trabajo_planeacion = ?", [id_tipo_trabajo_planeacion]);
    res.redirect("/planeacion")

})

router.post('/agregarPozo', isLoggedIn, async (req,res) => {

    const {
        id_planeacion,
        id_pozo
    } = req.body;

    const datos = req.body;

    await pool.query("INSERT INTO tb_pozos_planeacion SET ?", [datos]);
    res.redirect('/planeacion');    

})

router.get('/eliminarPozo/:id_pozo_planeacion', isLoggedIn, async (req,res) => {

    const { id_pozo_planeacion } = req.params;

    await pool.query("DELETE FROM tb_pozos_planeacion WHERE id_pozo_planeacion = ?", [id_pozo_planeacion]);
    res.redirect("/planeacion")

})

router.get('/eliminarPlaneacion/:id_planeacion', isLoggedIn, async (req,res) => {

    const { id_planeacion } = req.params;

    await pool.query("DELETE FROM tb_planeacion WHERE id_planeacion = ?", [id_planeacion]);
    res.redirect("/planeacion")

})

router.get('/equipo/equipos-herramientas/:id_planeacion', isLoggedIn, async (req,res) => {

    const { id_planeacion } = req.params;
    const consulta = await pool.query("SELECT * FROM tb_planeacion WHERE id_planeacion = ?", [id_planeacion]);

    const tipo_equipo_herramienta = await pool.query("SELECT id_tipo_equipo_herramienta ,nombre_equipo_herramienta FROM tb_tipo_equipos_herramientas");
    const unidad_medida = await pool.query("SELECT id_unidad_medida ,nombre_unidad_medida, abreviatura_unidad_medida FROM tb_unidad_medida");
    const rubros = await pool.query("SELECT id_rubro,sigla_rubro FROM tb_rubros");
    const monedas = await pool.query("SELECT id_moneda, abreviatura_moneda FROM tb_monedas");

    console.log(id_planeacion);

    res.render('planeacion/Equipo/Equipos-herramientas', {
        consulta: consulta,
        tipo_equipo_herramienta: tipo_equipo_herramienta,
        unidad_medida: unidad_medida,
        monedas: monedas,
        rubros: rubros
    })
})

router.post('/equipo/equipos-herramientas/:id_planeacion', isLoggedIn, async (req,res) => {

    const { id_planeacion } = req.params;
    const consulta = await pool.query("SELECT * FROM tb_planeacion WHERE id_planeacion = ?", [id_planeacion]);

    const { dato } = req.body;

    const consultaEquipo = await pool.query(`SELECT t.nombre_equipo_herramienta, e.nombre_equipo, e.id_equipo, t.id_tipo_equipo_herramienta FROM tb_tipo_equipos_herramientas t, tb_equipos e WHERE t.id_tipo_equipo_herramienta = e.id_tipo_equipo_herramienta AND t.id_tipo_equipo_herramienta = '${req.body.dato}'`);
    const tipo_equipo_herramienta = await pool.query("SELECT id_tipo_equipo_herramienta ,nombre_equipo_herramienta FROM tb_tipo_equipos_herramientas");
    const unidad_medida = await pool.query("SELECT id_unidad_medida ,nombre_unidad_medida, abreviatura_unidad_medida FROM tb_unidad_medida");
    const rubros = await pool.query("SELECT id_rubro,sigla_rubro FROM tb_rubros");
    const monedas = await pool.query("SELECT id_moneda, abreviatura_moneda FROM tb_monedas");

    res.render('planeacion/Equipo/Equipos-herramientas', {
        consulta: consulta,
        consultaEquipo: consultaEquipo,
        tipo_equipo_herramienta: tipo_equipo_herramienta,
        unidad_medida: unidad_medida,
        rubros: rubros,
        monedas: monedas
    })
})

router.post('/equipo/equipos-herramientas/agregar/:id_planeacion', isLoggedIn, async (req,res) => {
    
    const {
        id_planeacion,
        id_tipo_equipo_herramienta,
        id_equipo_herramienta,
        cantidad,
        id_unidad_medida,
        gasto,
        gasto_standby,
        id_rubro,
        contado,
        credito,
        id_moneda,
        observaciones
    } = req.body;
    const datos = req.body;
    await pool.query("INSERT INTO tb_equipo_item_equipo_herramienta SET ?", [datos]);

})

router.get('/equipo/equipos-herramientas/eliminar/:id_equipo_item_equipo_herramienta', isLoggedIn, async (req,res) => {

    const { id_equipo_item_equipo_herramienta } = req.params;

    await pool.query("DELETE FROM tb_equipo_item_equipo_herramienta WHERE id_equipo_item_equipo_herramienta = ?", [id_equipo_item_equipo_herramienta]);
    res.redirect("/planeacion")

})

router.get('/equipo/personal/:id_planeacion', isLoggedIn, async (req,res) => {

    const { id_planeacion } = req.params;
    const consulta = await pool.query("SELECT * FROM tb_planeacion WHERE id_planeacion = ?", [id_planeacion]);

    const cargos = await pool.query("SELECT id_cargo, nombre_cargo FROM tb_cargos");
    const personal = await pool.query("SELECT id, nombre_personal, apellido_personal FROM tb_personal");
    const unidad_medida = await pool.query("SELECT id_unidad_medida ,nombre_unidad_medida, abreviatura_unidad_medida FROM tb_unidad_medida");
    const rubros = await pool.query("SELECT id_rubro,sigla_rubro FROM tb_rubros");
    const monedas = await pool.query("SELECT id_moneda,abreviatura_moneda FROM tb_monedas");


    res.render('planeacion/Equipo/Personal', {
        consulta: consulta,
        cargos: cargos,
        personal: personal,
        unidad_medida: unidad_medida,
        rubros: rubros,
        monedas: monedas
    });
})

router.post('/equipo/personal/:id_planeacion', isLoggedIn, async (req,res) => {

    const { id_planeacion } = req.params;
    const consulta = await pool.query("SELECT * FROM tb_planeacion WHERE id_planeacion = ?", [id_planeacion]);
    const { dato } = req.body;

    const cargos = await pool.query("SELECT id_cargo, nombre_cargo FROM tb_cargos");
    const personal = await pool.query("SELECT id, nombre_personal, apellido_personal FROM tb_personal");
    const unidad_medida = await pool.query("SELECT id_unidad_medida ,nombre_unidad_medida, abreviatura_unidad_medida FROM tb_unidad_medida");
    const rubros = await pool.query("SELECT id_rubro,sigla_rubro FROM tb_rubros");
    const cargo_personal = await pool.query(`SELECT c.id_cargo, c.nombre_cargo, p.nombre_personal, p.apellido_personal, p.id FROM tb_cargos c, tb_personal p WHERE c.id_personal = p.id AND c.id_cargo = '${req.body.dato}'`);
    const monedas = await pool.query("SELECT id_moneda,abreviatura_moneda FROM tb_monedas");

    console.log(cargo_personal);

    res.render('planeacion/Equipo/Personal', {
        consulta: consulta,
        cargos: cargos,
        personal: personal,
        unidad_medida: unidad_medida,
        cargo_personal: cargo_personal,
        rubros: rubros,
        monedas: monedas
    });
})

router.post('/equipo/personal/agregar/:id_planeacion', isLoggedIn, async (req,res) => {
    
    const {
        id_planeacion,
        id_cargo,
        id_personal,
        id_unidad_medida,
        id_moneda,
        cantidad,
        costo,
        id_rubro,
    } = req.body;
    const datos = req.body;
    await pool.query("INSERT INTO tb_equipo_item_personal SET ?", [datos]);

})

router.get('/equipo/personal/eliminar/:id_equipo_item_personal', isLoggedIn, async (req,res) => {

    const { id_equipo_item_personal } = req.params;

    await pool.query("DELETE FROM tb_equipo_item_personal WHERE id_equipo_item_personal = ?", [id_equipo_item_personal]);
    res.redirect("/planeacion")

})

router.get('/equipo/combustibles/:id_planeacion', isLoggedIn, async (req,res) => {

    const { id_planeacion } = req.params;
    const consulta = await pool.query("SELECT * FROM tb_planeacion WHERE id_planeacion = ?", [id_planeacion]);

    const unidad_medida = await pool.query("SELECT id_unidad_medida ,nombre_unidad_medida, abreviatura_unidad_medida FROM tb_unidad_medida");
    const rubros = await pool.query("SELECT id_rubro, sigla_rubro FROM tb_rubros");
    const items = await pool.query("SELECT id_item, descripcion_item FROM tb_item");
    const monedas = await pool.query("SELECT id_moneda,abreviatura_moneda FROM tb_monedas");

    res.render('planeacion/Equipo/Combustibles', {
        unidad_medida: unidad_medida,
        rubros: rubros,
        items: items,
        consulta: consulta,
        monedas: monedas
    });
})

router.post('/equipo/combustibles/agregar', isLoggedIn, async (req,res) => {

    const {
        id_planeacion,
        id_item,
        id_rubro,
        id_unidad_medida,
        cantidad,
        costo_unitario,
        contado,
        id_moneda,
        credito
    } = req.body

    const datos = req.body;
    await pool.query("INSERT INTO tb_equipo_item_combustible SET ?", [datos]);

})

router.get('/equipo/combustibles/eliminar/:id_equipo_item_combustible', isLoggedIn, async (req,res) => {

    const { id_equipo_item_combustible } = req.params;

    await pool.query("DELETE FROM tb_equipo_item_combustible WHERE id_equipo_item_combustible = ?", [id_equipo_item_combustible]);
    res.redirect("/planeacion")

})


router.get('/equipo/imprevistos/:id_planeacion', isLoggedIn, async (req,res) => {

    const { id_planeacion } = req.params;
    const consulta = await pool.query("SELECT * FROM tb_planeacion WHERE id_planeacion = ?", [id_planeacion]);

    const unidad_medida = await pool.query("SELECT id_unidad_medida ,nombre_unidad_medida, abreviatura_unidad_medida FROM tb_unidad_medida");
    const rubros = await pool.query("SELECT id_rubro, sigla_rubro FROM tb_rubros");

    res.render('planeacion/Equipo/Imprevistos', {
        unidad_medida: unidad_medida,
        rubros: rubros,
        consulta: consulta
    })
})

router.post('/equipo/imprevistos/agregar', isLoggedIn, async (req,res) => {

    const {
        id_planeacion,
        descripcion,
        fecha_imprevisto,
        id_rubro,
        id_unidad_medida,
        cantidad,
        id_moneda,
        costo_unitario,
        contado,
        credito
    } = req.body

    const datos = req.body;
    await pool.query("INSERT INTO tb_equipo_item_imprevistos SET ?", [datos]);

})

router.get('equipo/imprevistos/eliminar/:id_equipo_item_imprevisto', isLoggedIn, async (req,res) => {

    const { id_equipo_item_imprevisto } = req.params;

    await pool.query("DELETE FROM tb_equipo_item_imprevistos WHERE id_equipo_item_imprevisto = ?", [id_equipo_item_imprevisto]);
    res.redirect("/planeacion")    

})

router.get('/movilizacion/combustibles/:id_planeacion', isLoggedIn, async (req,res) => {

    const { id_planeacion } = req.params;
    const consulta = await pool.query("SELECT * FROM tb_planeacion WHERE id_planeacion = ?", [id_planeacion]);

    const unidad_medida = await pool.query("SELECT id_unidad_medida ,nombre_unidad_medida, abreviatura_unidad_medida FROM tb_unidad_medida");
    const rubros = await pool.query("SELECT id_rubro, sigla_rubro FROM tb_rubros");
    const items = await pool.query("SELECT id_item, descripcion_item FROM tb_item");
    const monedas = await pool.query("SELECT id_moneda, abreviatura_moneda FROM tb_monedas");

    res.render('planeacion/Movilizacion/Combustibles', {
        unidad_medida: unidad_medida,
        rubros: rubros,
        items: items,
        monedas: monedas,
        consulta: consulta
    });
})

router.post('/movilizacion/combustibles/agregar', isLoggedIn, async (req,res) => {

    const {
        id_planeacion,
        id_item,
        id_rubro,
        id_moneda,
        cantidad,
        costo_unitario,
        contado,
        credito
    } = req.body

    const datos = req.body;
    await pool.query("INSERT INTO tb_mov_item_combustibles SET ?", [datos]);

})

router.get('movilizacion/combustible/eliminar/:id_mov_item_combustible', isLoggedIn, async (req,res) => {

    const { id_mov_item_combustible } = req.params;

    await pool.query("DELETE FROM tb_mov_item_combustibles WHERE id_mov_item_combustible = ?", [id_mov_item_combustible]);
    res.redirect("/planeacion")    

})


router.get('/movilizacion/imprevistos/:id_planeacion', isLoggedIn, async (req,res) => {

    const { id_planeacion } = req.params;
    const consulta = await pool.query("SELECT * FROM tb_planeacion WHERE id_planeacion = ?", [id_planeacion]);

    const unidad_medida = await pool.query("SELECT id_unidad_medida ,nombre_unidad_medida, abreviatura_unidad_medida FROM tb_unidad_medida");
    const rubros = await pool.query("SELECT id_rubro, sigla_rubro FROM tb_rubros");
    const monedas = await pool.query("SELECT id_moneda, abreviatura_moneda FROM tb_monedas");

    res.render('planeacion/Movilizacion/Imprevistos', {
        unidad_medida: unidad_medida,
        rubros: rubros,
        consulta: consulta,
        monedas: monedas
    })
})

router.post('/movilizacion/imprevistos/agregar', isLoggedIn, async (req,res) => {

    const {
        id_planeacion,
        descripcion,
        fecha_imprevisto,
        id_rubro,
        id_unidad_medida,
        id_moneda,
        cantidad,
        costo_unitario,
        contado,
        credito
    } = req.body

    const datos = req.body;
    await pool.query("INSERT INTO tb_mov_item_imprevistos SET ?", [datos]);

})

router.get('/movilizacion/imprevistos/eliminar/:id_mov_item_imprevisto', isLoggedIn, async (req,res) => {

    const { id_mov_item_imprevisto } = req.params;

    await pool.query("DELETE FROM tb_mov_item_imprevistos WHERE id_mov_item_imprevisto = ?", [id_mov_item_imprevisto]);
    res.redirect("/planeacion")    

})

router.get('/movilizacion/personal/:id_planeacion', isLoggedIn, async (req,res) => {

    const { id_planeacion } = req.params;
    const consulta = await pool.query("SELECT * FROM tb_planeacion WHERE id_planeacion = ?", [id_planeacion]);
    const { dato } = req.body;

    const cargos = await pool.query("SELECT id_cargo, nombre_cargo FROM tb_cargos");
    const personal = await pool.query("SELECT id,nombre_personal,apellido_personal FROM tb_personal");
    const unidad_medida = await pool.query("SELECT id_unidad_medida ,nombre_unidad_medida, abreviatura_unidad_medida FROM tb_unidad_medida");
    const rubros = await pool.query("SELECT id_rubro,sigla_rubro FROM tb_rubros");
    const tipo_asignacion = await pool.query("SELECT id_tipo_asignacion, descripcion FROM tb_tipo_asignacion");
    const placa = await pool.query("SELECT id_equipo, placa_equipo FROM tb_equipos");
    const monedas = await pool.query("SELECT id_moneda, abreviatura_moneda FROM tb_monedas");

    res.render('planeacion/Movilizacion/Personal', {
        cargos: cargos,
        personal: personal,
        unidad_medida: unidad_medida,
        rubros: rubros,
        tipo_asignacion: tipo_asignacion,
        placa: placa,
        monedas: monedas,
        consulta: consulta
    });
})

router.post('/movilizacion/personal/:id_planeacion', isLoggedIn, async (req,res) => {

    const { id_planeacion } = req.params;
    const consulta = await pool.query("SELECT * FROM tb_planeacion WHERE id_planeacion = ?", [id_planeacion]);

    const cargos = await pool.query("SELECT id_cargo, nombre_cargo FROM tb_cargos");
    const personal = await pool.query("SELECT id,nombre_personal,apellido_personal FROM tb_personal");
    const unidad_medida = await pool.query("SELECT id_unidad_medida ,nombre_unidad_medida, abreviatura_unidad_medida FROM tb_unidad_medida");
    const rubros = await pool.query("SELECT id_rubro,sigla_rubro FROM tb_rubros");
    const tipo_asignacion = await pool.query("SELECT id_tipo_asignacion, descripcion FROM tb_tipo_asignacion");
    const placa = await pool.query("SELECT id_equipo, placa_equipo FROM tb_equipos");
    const cargo_personal = await pool.query(`SELECT c.id_cargo, c.nombre_cargo, p.nombre_personal, p.apellido_personal, p.id FROM tb_cargos c, tb_personal p WHERE c.id_personal = p.id AND c.id_cargo = '${req.body.dato}'`);
    const monedas = await pool.query("SELECT id_moneda, abreviatura_moneda FROM tb_monedas");

    res.render('planeacion/Movilizacion/Personal', {
        cargos: cargos,
        personal: personal,
        unidad_medida: unidad_medida,
        rubros: rubros,
        tipo_asignacion: tipo_asignacion,
        placa: placa,
        consulta: consulta,
        cargo_personal: cargo_personal,
        monedas: monedas
    });
})

router.post('/movilizacion/personal/agregar/:id_planeacion', isLoggedIn, async (req,res) => {

    const {
        id_cargo,
        id_planeacion,
        id_personal,
        id_unidad_medida,
        cantidad,
        costo,
        id_moneda,
        id_rubro,
        id_equipo,
        id_tipo_asignacion
    } = req.body;

    const datos = req.body;
    await pool.query("INSERT INTO tb_mov_item_personal SET ?", [datos]);

})

router.get('/movilizacion/personal/eliminar/:id_mov_item_personal', isLoggedIn, async (req,res) => {

    const { id_mov_item_personal } = req.params;

    await pool.query("DELETE FROM tb_mov_item_personal WHERE id_mov_item_personal = ?", [id_mov_item_personal]);
    res.redirect("/planeacion")

})

router.get('/movilizacion/vehiculos/:id_planeacion', isLoggedIn, async (req,res) => {

    const { id_planeacion } = req.params;
    const consulta = await pool.query("SELECT * FROM tb_planeacion WHERE id_planeacion = ?", [id_planeacion]);

    const vehiculo_carga = await pool.query("SELECT id_equipo, nombre_equipo, placa_equipo FROM tb_equipos");
    const unidad_medida = await pool.query("SELECT id_unidad_medida ,nombre_unidad_medida, abreviatura_unidad_medida FROM tb_unidad_medida");
    const rubros = await pool.query("SELECT id_rubro,sigla_rubro FROM tb_rubros");
    const monedas = await pool.query("SELECT id_moneda, abreviatura_moneda FROM tb_monedas");

    res.render('planeacion/Movilizacion/Vehiculos', {
        vehiculo_carga: vehiculo_carga,
        unidad_medida: unidad_medida,
        rubros: rubros,
        consulta: consulta,
        monedas: monedas
    })
})

router.post('/movilizacion/vehiculos/agregar', isLoggedIn, async (req,res) => {

    const {
        id_planeacion,
        vehiculo,
        carga,
        id_unidad_medida,
        gasto,
        gasto_standby,
        cantidad,
        id_rubro,
        contado,
        id_moneda,
        credito,
        observaciones
    } = req.body;

    const datos = req.body;
    await pool.query("INSERT INTO tb_mov_item_vehiculos SET ?", [datos]);

})

router.get('movilizacion/vehiculos/eliminar/:id_mov_item_vehiculo', isLoggedIn, async (req,res) => {

    const { id_mov_item_vehiculo } = req.params;

    await pool.query("DELETE FROM tb_mov_item_vehiculos WHERE id_mov_item_vehiculo = ?", [id_mov_item_vehiculo]);
    res.redirect("/planeacion")

})

module.exports = router;