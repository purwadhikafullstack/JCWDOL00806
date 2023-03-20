// import sequelize
const { sequelize } = require('../../models')
const { Op } = require('sequelize')

// import modals
const db = require('../../models/index')
const room = db.room
const room_status = db.room_status
const room_special_price = db.room_special_price
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

            // get room data
            let roomData = await sequelize.query(`
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

            return res.status(200).send({
                isError: false,
                message: "Get Room Data Success",
                data: roomData
            })
        } catch (error) {
            return res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    getRoomDetail: async (req, res) => {
        try {
            const {id} = req.dataToken
            const { room_id } = req.params

            const checkRoom = await sequelize.query(`
                SELECT r.id, r.name, r.price, r.description, r.rules
                FROM property_categories c
                JOIN properties p ON p.category_id = c.id
                JOIN rooms r ON r.property_id = p.id
                WHERE c.tenant_id = "${id}" AND r.id = "${room_id}"
                GROUP BY r.id
                LIMIT 1;
            `)

            if (!checkRoom[0].length) return res.status(404).send({
                isError: true,
                message: "This property / room does not belong to user",
                data: null
            })

            return res.status(201).send({
                isError: false,
                message: "Get Room Data Success",
                data: checkRoom[0][0]
            })
        } catch (error) {
            return res.status(404).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    addUnavailable: async (req, res) => {
        const t = await sequelize.transaction()
        try {
            const {start_date, end_date, room_id} = req.body

            await room_status.create({
                start_date,
                end_date,
                room_id
            }, { transaction: t })
            t.commit()
            return res.status(201).send({
                isError: false,
                message: "Room unavailable created succesfully",
                data: null
            })

        } catch (error) {
            t.rollback()
            console.log(error)
            return res.send(404).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    },
    addSpecialPrice: async (req, res) => {
        const t = await sequelize.transaction()
        try {
            const {start_date, end_date, room_id, price} = req.body

            await room_special_price.create({
                start_date,
                end_date,
                price,
                room_id
            })
            t.commit()
            return res.status(201).send({
                isError: false,
                message: "Room unavailable created succesfully",
                data: null
            })
        } catch (error) {
            t.rollback()
            console.log(error)
            return res.send(404).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    }
}