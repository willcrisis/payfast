module.exports = function(app) {
    app.get('/pagamentos', function(req, res) {
        console.log('requisição recebida na porta 3000');
        res.send('oi!');
    });

    app.post('/pagamentos', function(req, res, next) {

        req.assert('forma_pagamento', 'required').notEmpty();
        req.assert('valor', 'required').notEmpty();
        req.assert('valor', 'invalid format').isFloat();
        req.assert('moeda', 'required').notEmpty();
        req.assert('moeda', 'invalid format').isLength({min: 3, max: 3});

        var errors = req.validationErrors();
        if (errors) {
            res.status(400).json(errors);
            return;
        }

        var pagamento = req.body;
        pagamento.status = 'C';
        pagamento.data = new Date();

        var conn = app.persistence.connectionFactory();
        var dao = new app.persistence.PagamentoDao(conn);

        dao.incluir(pagamento, function(err, result) {
            if (err) {
                return next(err);
            }
            res.json(result);
        });
        conn.end();
    });
};
