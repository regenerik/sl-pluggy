var DataTypes = require('sequelize').DataTypes;
module.exports = function (sequelize) {
    // defino el modelo
    sequelize.define('quotes', {
        buy_price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        sell_price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        source: {
            type: DataTypes.STRING,
            primaryKey: true
        }
    }, { timestamps: false });
};
