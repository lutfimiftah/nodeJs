
const { Sequelize, DataType, DataTypes } = require('sequelize');
const { FOREIGNKEYS } = require('sequelize/lib/query-types');
const sequelize = new Sequelize('asignmentnodejs', 'root', 'lutfi21', {
    host: 'localhost',
    dialect: 'mysql'
});

const AkunUser = sequelize.define('Akunuser', {
    email : {
        type : DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type : DataTypes.STRING,
        allowNull: false
    }
});


const profil = sequelize.define('profil', {
    akunUser_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references : {
            model: AkunUser,
            key: 'id'
        }
    }, 
    poto: {
        type: DataTypes.STRING
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pesan_untuk_masa_depan: {
        type: DataTypes.STRING
    }
});

AkunUser.hasOne(profil, {FOREIGNKEY: 'akunUser_id'});
profil.belongsTo(AkunUser, { FOREIGNKEY: 'akunUser_id'});

module.exports = {
    sequelize,
    AkunUser,
    profil
};