module.exports.development = {
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'admin',
        database: 'tradein_development'
    },
    pool: {
      min: 2,
      max: 20
    },
    migrations: {
        directory: __dirname+'/migrations'
    },
    useNullAsDefault: true
    // seeds:{
    //     directory: './seeds'
    // }
}