//Llamado del modulo
const oracledb = require('oracledb');

//Información para la conxión con mi base de datos
cns = {
    user: "system",
    password: "oracle",
    connectString: "localhost:51521/xe"
}

//abrir conexión, hacer consulta y cerrar conexión
async function Open(sql, binds, autoCommit) {
    //abrir
    let cnn = await oracledb.getConnection(cns);
    //consultar y confirmar los cambios con el autoCommit
    let result = await cnn.execute(sql, binds, { autoCommit });
    //cerrar
    cnn.release();

    return result;
}

//exportar función
exports.Open = Open;