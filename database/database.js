const Sequelize = require('sequelize');

const connection = new Sequelize('perguntas_respostas', 'root', 'ME04R85J13.', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection