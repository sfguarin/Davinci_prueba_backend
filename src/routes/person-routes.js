//Router requerido para el manejor de rutas
const { Router } = require('express');
const router = Router();
const  multipart  = require ('connect-multiparty') ;

const csv = require('csvtojson') 

//llamo conexión con base de datoscl
const BD = require('../config/configbd');

//CSV
const  multipartMiddleware  = multipart ({
    uploadDir: './subidas'
} ) ;

//carga de archivo csv
router.post('/addCSV', multipartMiddleware, (req,res) => {
    console.log("stiven",req.body);
    console.log("fernando",req.files);
    console.log("meromero",req.files.uploads[0].path)
    path = req.files.uploads[0].path;
    const csvfilepath = `./${path}`;
    csv().fromFile(csvfilepath).then((jsonObj)=>{
        console.log(jsonObj[0]);
        for(i=0; i<jsonObj.length;i++){

            //entrada de información en el body para crear
            const { nombre, apellido, telefono, direccion, campana } = jsonObj[i];

            //sql para crear usuario
            sql = "insert into person(nombre,apellido,telefono, direccion, campana) values (:nombre,:apellido,:telefono, :direccion, :campana)";

            //conexión con mi base de datos para hacer la creacion, envio argumentos y autocommit para guardar
            BD.Open(sql, [nombre, apellido, telefono, direccion, campana], true);
        }
    })
    res.json({
        'message': 'Fichero cargado correctamente'
    });
});

//READ
router.get('/getUsers', async (req, res) => {

    //sql para la consulta
    sql = "select * from person where state=1";

    //conexión con mi base de datos para hacer la consulta, no tiene autocommit porque es un select
    let result = await BD.Open(sql, [], false);

    //arreglo de arreglos
    //console.log(resulta.rows);

    //inicialización de arreglo
    Users = [];

    //recorrido de arreglo para crear objetos
    result.rows.map(user => {
        let userSchema = {
            "code": user[0],
            "nombre": user[1],
            "apellido": user[2],
            "telefono": user[3],
            "direccion": user[4],
            "campana": user[5]
            //"direccion": user[6]
        }

        //añadir objetos al arreglo
        Users.push(userSchema);
    })

    //respuesta
    res.status(200).json(Users);
})

//CREATE

router.post('/addUser', async (req, res) => {

    //entrada de información en el body para crear
    const { nombre, apellido, telefono, direccion, campana } = req.body;

    //sql para crear usuario
    sql = "insert into person(nombre,apellido,telefono, direccion, campana) values (:nombre,:apellido,:telefono, :direccion, :campana)";

    //conexión con mi base de datos para hacer la creacion, envio argumentos y autocommit para guardar
    await BD.Open(sql, [nombre, apellido, telefono, direccion, campana], true);

    //respuesta
    res.status(200).json({
        "nombre": nombre,
        "apellido": apellido,
        "telefono": telefono,
        "direccion": direccion,
        "campana": campana
    })
})


//UPDATE
router.put("/updateUser", async (req, res) => {

    //entrada de información en el body para actualizar
    const { code, nombre, apellido, telefono, direccion, campana } = req.body;

    //sql para actualizar usuario
    sql = "update person set nombre=:nombre, apellido=:apellido, telefono=:telefono, direccion=:direccion, campana=:campana where code=:code";

    //conexión con mi base de datos para hacer la actualización, envio argumentos y autocommit para guardar 
    await BD.Open(sql, [nombre, apellido, telefono, direccion, campana, code], true);

    //respuesta
    res.status(200).json({
        "code": code,
        "nombre": nombre,
        "apellido": apellido,
        "telefono": telefono,
        "direccion": direccion,
        "campana": campana
    })

})


//DELETE
router.delete("/deleteUser/:code", async (req, res) => {

    //entrada de la información en la URL
    const { code } = req.params;

    //Ajuste de estado (nunca se elimina información de la base de datos)
    sql = "update person set state=0 where code=:code";

    //conexión con mi base de datos para hacer la eliminación(actualización), envio argumento y autocommit para guardar 
    await BD.Open(sql, [code], true);

    //respuesta
    res.status(200).json({ "msg": "Usuario Eliminado" })
})


module.exports = router;