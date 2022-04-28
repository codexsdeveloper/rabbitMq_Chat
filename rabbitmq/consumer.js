var amqp = require('amqplib/callback_api');

exports.consumer = async () => {
    amqp.connect('amqp://localhost', function (error0, connection) {
        if (error0) {
            throw error0
        }

        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1
            }
            var exchange = 'msg_exchange';
            var key = 'singleChat'
            channel.assertExchange(exchange, 'topic', {
                durable: false
            });

            channel.assertQueue('', {
                exclusive: true,
            },
                function (error2, q) {
                    if (error2) {
                        throw error2
                    }

                    channel.bindQueue(q.queue, exchange, key);
                    channel.consume(q.queue, function (msg) {
                        console.log(`consumer:=== ${msg.fields.routingKey} ${msg.content.toString()}`);
                        io.emit('res', msg.content.toString())
                    }, {
                        noAck: true
                    })
                }
            )
        })
    })
}