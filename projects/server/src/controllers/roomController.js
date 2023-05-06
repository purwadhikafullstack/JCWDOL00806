// import sequelize
const { sequelize } = require('../../models')
const { Op } = require('sequelize')

// import modals
const db = require('../../models/index')
const room = db.room
const room_status = db.room_status
const room_special_price = db.room_special_price
const order = db.order
module.exports ={
    createRoom: async (req, res, next) => {
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
        console.log(error)
        next({
            isError: true,
            message: error.message,
            data: null,
            status: 400
        })
        }
    },
    updateRoom: async (req, res, next) => {
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
            console.log(error)
            next({
              isError: true,
              message: error.message,
              data: null,
              status: 400
            })
        }
    },
    deleteRoom: async (req, res, next) => {
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
        console.log(error)
        next({
            isError: true,
            message: error.message,
            data: null,
            status: 400
        })
        }
    },
    getRoomData: async (req, res, next) => {
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

            // count room data
            let totalData = await sequelize.query(`
                SELECT COUNT(*) AS total
                FROM property_categories c
                JOIN properties p ON p.category_id = c.id
                JOIN rooms r ON r.property_id = p.id
                WHERE c.tenant_id = ? AND p.id = ?
            `, {
                replacements: [id, property_id],
                type: sequelize.QueryTypes.SELECT
            })

            // calculate the number of pages
            let total_pages = Math.ceil(totalData[0].total / limit)

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
                data: {
                    total_pages,
                    room_data: roomData
                }
            })
        } catch (error) {
            console.log(error)
            next({
              isError: true,
              message: error.message,
              data: null,
              status: 400
            })
        }
    },
    getRoomDetail: async (req, res, next) => {
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
            console.log(error)
            next({
              isError: true,
              message: error.message,
              data: null,
              status: 400
            })
        }
    },
    addUnavailable: async (req, res, next) => {
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
            next({
              isError: true,
              message: error.message,
              data: null,
              status: 400
            })
        }
    },
    addSpecialPrice: async (req, res, next) => {
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
            next({
              isError: true,
              message: error.message,
              data: null,
              status: 400
            })
        }
    },
    getUnavailableRoom: async (req, res, next) => {
        try {
            // get data from client
            let { room_id } = req.params

            // get unavailable from room_statues
            let unavailable = await sequelize.query(`
                SELECT rs.start_date, rs.end_date
                FROM rooms r
                JOIN room_statuses rs ON r.id = rs.room_id
                WHERE r.id = ?;
            `, {
                replacements: [room_id],
                type: sequelize.QueryTypes.SELECT
            })

            // get unavailable from order
            let booked = await sequelize.query(`
                SELECT o.start_date, o.end_date
                FROM rooms r
                JOIN orders o ON o.room_id = r.id
                WHERE r.id = ? 
                AND o.status NOT IN ('Cancelled', 'Rejected');
            `, {
                replacements: [room_id],
                type: sequelize.QueryTypes.SELECT
            })

            return res.status(200).send({
                isEror: false,
                message: "Get Unavailable Room Success",
                data: {
                    unavailable,
                    booked
                }
            })
        } catch (error) {
            console.log(error)
            next({
              isError: true,
              message: error.message,
              data: null,
              status: 400
            })
        }
    },
    getRoomSpecialPrice: async (req, res, next) => {
        try {
            // get data from client
            let { room_id, start_date } = req.query

            // get room special price
            let specialPrice = await sequelize.query(`
                SELECT *
                FROM room_special_prices
                WHERE room_id = ?
                AND ? BETWEEN start_date AND end_date;
            `, {
                replacements: [room_id, start_date],
                type: sequelize.QueryTypes.SELECT
            })
            
            // check if room special price empty or not
            if (specialPrice.length === 0)
            return res.status(200).send({
                isError: false,
                message: "No Special Price Found",
                data: null
            })

            return res.status(200).send({
                isError: false,
                message: "Get Room Special Price Success",
                data: specialPrice[0]
            })
        } catch (error) {
            console.log(error)
            next({
              isError: true,
              message: error.message,
              data: null,
              status: 400
            })
        }
    },
    checkSpecial: async (req, res, next) => {
        try {
            let { room_id } = req.params
            
            let special = await sequelize.query(`
            SELECT rsp.start_date, rsp.end_date
            FROM rooms r
            JOIN room_special_prices rsp ON r.id = rsp.room_id
            WHERE r.id = ?;
        `, {
            replacements: [room_id],
            type: sequelize.QueryTypes.SELECT
        })

            return res.status(200).send({
                isError: false,
                message: "Special prices checked",
                data: {
                    special
                }
        })
        } catch (error) {
            
        }
    }
}