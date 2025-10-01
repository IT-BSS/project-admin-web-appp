const https = require('https');
const crypto = require('crypto');
const querystring = require('querystring');

const paymentModel = require('../../models/payment/payment.model')

const {userIdByToken} = require('../../utils/token')

function createPay(req, res) {
  try {
    const public_key = '6jng7ro9uteki2y';
    const shop_id = '3942';
    const amount = req.body.total;
    const amountnum = amount.toFixed(2);
    const random_number = Math.floor(Math.random() * 1000000000);
    const hash_str = `${shop_id}${amountnum}${public_key}${random_number}`;
    const hash = crypto.createHash('sha256').update(hash_str).digest('hex');

    const {products} = req.body
    const extractedProducts = [];

// Перебираем каждый объект в массиве
    products.forEach(product => {
      const { image, name, price, color, quantity } = product;

      // Создаем новый объект с нужными свойствами
      const extractedProduct = { image, name, price, color, quantity };

      // Добавляем этот объект в массив extractedProducts
      extractedProducts.push(extractedProduct);

      // Выводим информацию о товаре
      console.log(image, name, price, color, quantity);
    });

    const token = req.user
    const user_id = userIdByToken(token);

    const queryParams = {
      amount: amountnum,
      desc: 'MTAyMTU=',
      shop_id: shop_id,
      label: random_number,
      hash: hash,
      nored: 1
    };

    const query = querystring.stringify(queryParams);
    const url = `https://sci.fropay.bid/get?${query}`;

    const create_pay = https.get(url, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        const createPayResponse = JSON.parse(data);
        const payments_id = createPayResponse.id;
        const pay_url = createPayResponse.url;
        res.json({ url: pay_url });

        console.log(createPayResponse);
        console.log(`payments_id: ${payments_id}`);
        console.log(`pay_url: ${pay_url}`);


        let checkCount = 0;
        const checkInterval = setInterval(() => {
          if (checkCount < 6) {
            getTransaction(payments_id, res, (status) => {
              console.log(status)
              if (status === '1') {
                console.log('Платёж прошёл, ожидается зачисление на баланс.');
              } else if (status === '2') {
                clearInterval(checkInterval);
                console.log('Платёж прошёл, и зачислился на баланс.');

                paymentModel.addOrderToBD(user_id, payments_id, amountnum, extractedProducts, (err, result) => {
                  if (err) {

                    return;
                  }
                  res.json({ url: pay_url, result: result }); // Возвращаем URL оплаты и результат добавления заказа

                });
                return;
              } else {
                console.log('Идет проверка, итерация:', checkCount++, ' Статус платежа: ', status);
              }
            });
          } else {
            clearInterval(checkInterval);
            console.log('Проверка завершилась.');
          }
        }, 10000); // 10 секунд

      });
    });

    create_pay.on('error', (error) => {
      console.error(error);
      res.json({ status: 'False' });
    });
  } catch (error) {
    console.error(error);
    res.json({ status: 'False' });
  }
}

function getTransaction(payments_id, res, callback) {
  try {
    const secret_id = 'in504r62lq3zw98'
    const hash_payment = crypto.createHash('sha256').update(secret_id).digest('hex');

    const statusUrl = `https://sci.fropay.bid/status?id=${payments_id}&secret=${hash_payment}`;

    const status = https.get(statusUrl, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        const statusResponse = JSON.parse(data);
        const status = statusResponse.status; // Получаем статус из JSON-ответа
        callback(status); // Передаем значение статуса в колбэк после получения ответа
      });
    });

    status.on('error', (error) => {
      console.error(error);
      res.json({ status: 'False' });
    });
  } catch (error) {
    console.error(error);
    res.json({ status: 'False' });
  }
}


module.exports = {
  createPay,
};
