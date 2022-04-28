var amqp = require('amqplib/callback_api');

exports.producer = async (msg) => {
    console.log('msg=====', msg);
    amqp.connect('amqp://localhost', function (error0, connection) {
        if (error0) {
            throw error0;
        }

        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            var exchange = 'topic_exchange';
            var key = 'singleChat';
            // const args = ['single.#', 'room.#'];

            channel.assertExchange(exchange, 'topic', {
                durable: false
            });
            console.log('MSG:=', msg);
            channel.publish(exchange, key, Buffer.from(JSON.stringify(msg)))
            console.log(" [x] Sent %s:'%s'", key, msg);
        });
    });
}



