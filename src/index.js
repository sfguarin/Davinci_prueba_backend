


//Modulos requeridos
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const multipart = require('connect-multiparty');



//constante express
const app = express();

// const  multipartMiddleware  = multipart ({
//     uploadDir: './subidas'
// } ) ;

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}))

//carga de archivo csv
// app.post('/addCSV', multipartMiddleware, (req,res) => {
//     console.log(req);
//     res.json({
//         'message': 'Fichero cargado correctamente'
//     });
// });


//importación endpoints
const personRoutes = require('./routes/person-routes');

//ajustes
//ajuste de puerto donde se levanta mi servidor
app.set('port', process.env.PORT);



//------------------------------------------------------------
//middlewares 

//revisión de endpoint entrante
app.use(morgan('dev'));

//informaciónentrante de tipo json
app.use(express.json());

//Información proveniente de la ruta - false
app.use(express.urlencoded({ extended: false }));

//aceptar todas las solicitudes sin importar de donde vengan
app.use(cors());


//-------------------------------------------------------------



//uso de mis endpoints 
app.use(personRoutes);



//run
app.listen(app.get('port'), () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`)
})