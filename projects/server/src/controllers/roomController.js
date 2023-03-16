// import sequelize
const { sequelize } = require('../../models')
const { Op } = require('sequelize')

// import modals
const db = require('../../models/index')
const room = db.room

module.exports ={
    createRoom: async (req, res) => {
        try {
            // get data from client
            let { id } = req.dataToken
            let { property_id } = req.params
            let { name, price, description, rules } = req.body

            // check property belongs to users or not
            let checkProperty = await sequelize.query(`
                SELECT * 
                FROM property_categories c
                JOIN properties p ON p.category_id = c.id
                WHERE c.tenant_id = ? AND p.id = ?;
            `, {
                replacements: [id, property_id],
                type: sequelize.QueryTypes.SELECT
            })

            if (checkProperty.length === 0)
                return res.status(400).send({
                    isError: true,
                    message: "Property ID Not Belongs To User",
                    data: null
                })

            // create new room
            await room.create({
                name,
                price,
                description,
                rules,
                property_id: property_id
            })
                
            return res.status(200).send({
                isError: false,
                message: "Create Room Success",
                data: null
            })
        } catch (error) {
            return res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    updateRoom: async (req, res) => {
        try {
            // get data from client
            let { id } = req.dataToken
            let { room_id } = req.params
            let { name, price, description, rules } = req.body

            // check room belongs to users or not
            let checkRoom = await sequelize.query(`
                SELECT * 
                FROM property_categories c
                JOIN properties p ON p.category_id = c.id
                JOIN rooms r ON r.property_id = p.id
                WHERE c.tenant_id = ? AND r.id = ?;
            `, {
                replacements: [id, room_id],
                type: sequelize.QueryTypes.SELECT
            })

            if (checkRoom.length === 0)
                return res.status(400).send({
                    isError: true,
                    message: "Room ID Not Belongs To User",
                    data: null
                })

            // check req.body value is empty or not
            let updatedFields = {}

            if (name) updatedFields.name = name
            if (price) updatedFields.price = price
            if (description) updatedFields.description = description
            if (rules) updatedFields.rules = rules

            // update room
            await room.update(updatedFields, { where: { id: room_id } })

            return res.status(200).send({
                isError: false,
                message: "Update Room Success",
                data: null
            })
        } catch (error) {
            return res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    deleteRoom: async (req, res) => {
        try {
            // get data from client
            let { id } = req.dataToken
            let { room_id } = req.params

            // check room belongs to users or not
            let checkRoom = await sequelize.query(`
                SELECT * 
                FROM property_categories c
                JOIN properties p ON p.category_id = c.id
                JOIN rooms r ON r.property_id = p.id
                WHERE c.tenant_id = ? AND r.id = ?;
            `, {
                replacements: [id, room_id],
                type: sequelize.QueryTypes.SELECT
            })

            if (checkRoom.length === 0)
            return res.status(400).send({
                isError: true,
                message: "Room ID Not Belongs To User",
                data: null
            })

            // delete room
            await room.destroy({ where: { id: room_id } })

            return res.status(200).send({
                isError: false,
                message: "Delete Room Success",
                data: null
            })
        } catch (error) {
            return res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    getRoomData: async (req, res) => {
        try {
            // get data from client
            let { id } = req.dataToken
            let { property_id } = req.params
            let { page } = req.query

            // set the number of items per page
            let limit = 10
            let offset = (page - 1) * limit

            // check property belongs to users or not
            let checkProperty = await sequelize.query(`
                SELECT r.id, r.name, r.price, r.description, r.rules
                FROM property_categories c
                JOIN properties p ON p.category_id = c.id
                JOIN rooms r ON r.property_id = p.id
                WHERE c.tenant_id = ? AND p.id = ?
                GROUP BY r.id
                LIMIT ?
                OFFSET ?;
            `, {
                replacements: [id, property_id, limit, offset],
                type: sequelize.QueryTypes.SELECT
            })

            if (checkProperty.length === 0)
                return res.status(400).send({
                    isError: true,
                    message: "Property ID Not Belongs To User",
                    data: null
                })

            return res.status(200).send({
                isError: false,
                message: "Get Room Data Success",
                data: checkProperty
            })
        } catch (error) {
            return res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    }
}