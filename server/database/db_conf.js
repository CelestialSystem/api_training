module.exports.development = {
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'admin',
        database: 'tradein_development'
    },
    migrations: {
        directory: '../migrations'
    },
    useNullAsDefault: true
    // seeds:{
    //     directory: './seeds'
    // }
}