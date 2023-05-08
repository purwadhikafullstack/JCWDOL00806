const { sequelize } = require("../../models")
const fs = require("fs").promises
const handlebars = require('handlebars')
const transporter = require('../helpers/transporter')

module.exports = {
    bookingReminder : async () => {
        try {
            const bookedTomorrow = await sequelize.query(`
            SELECT o.id, o.start_date, o.end_date, r.name AS room_name, p.name AS property_name, u.email
            FROM orders o
            JOIN rooms r ON o.room_id = r.id
            JOIN properties p ON r.property_id = p.id
            JOIN users u ON u.id = o.users_id
            WHERE o.start_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY);
            `)
            console.log(bookedTomorrow[0])
            let template = await fs.readFile("./src/template/bookingReminder.html", 'utf-8')
            let compiledTemplate = await handlebars.compile(template)
            
            bookedTomorrow[0].forEach(async order => {
                let newTemplate = compiledTemplate({
                    property: order.property_name,
                    room: order.room_name,
                    start: order.start_date,
                    end: order.end_date
                })

                await transporter.sendMail(
                    {
                        from: "Admin",
                        to: order.email,
                        subject: "Booking Reminder",
                        html: newTemplate
                    }, function (error, info) {
                        if (error) {
                            console.log(error)
                        } else {
                            console.log("Email sent : " + info.response)
                        }
                    }
                )
            });

        } catch (error) {
            console.log(error)
        }
    }
}
