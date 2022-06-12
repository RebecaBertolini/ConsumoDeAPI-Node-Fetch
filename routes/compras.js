var express = require('express');
var router = express.Router();
var cielo = require('../lib/cielo');

/* GET criacao de compra */
router.post('/', async function (req, res, next) {

  await cielo.compra(req.body).then(async (result) => {

    const paymentId = result.Payment.PaymentId
    await cielo.captura(paymentId).then((result) => {
      if (result.Status == 2) {
        res.status(201).send({
          "status": "Sucesso",
          "message": "Compra realizada com sucesso.",
          "CompraId": paymentId
        })
      } else {
        res.status(402).send({
          "status": "Falha",
          "message": "Compra não realizada. Problema com a cobrança no cartão de crédito."
        })
      }

    })
  }).catch((err) => {
    console.err(err)
  })

});

router.get('/:compra_id/status', function (req, res, next) {
  cielo.consulta(req.params.compra_id).then((result) => {
    let message = {}
    switch (result.Payment.Status) {
      case 1:
        message = {
          "Status": "Pagamento autorizado."
        };
        break;
      case 2:
        message = {
          "Status": "Pagamento autorizado."
        };
        break;
      case 12:
        message = {
          "Status": "Pagamento pendente."
        };
        break;
      default:
        message = {
          "Status": "Pagamento falhou."
        }
    }

    res.send(message)
  })
});

module.exports = router;
