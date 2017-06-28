module.exports = function (app) {
    var api = {};

    function getApi() {
        return api;
    }

    api.listar = function(req, res) {
        var conn = app.persistence.connectionFactory();
        var dao = new app.persistence.PagamentoDao(conn);
        dao.listar(function(err, result) {
            if (err) {
                res.status(500).json(err);
                return;
            }
            res.status(200).json(result);
        });
        conn.end();
    };

    api.obter = function(req, res) {
        var conn = app.persistence.connectionFactory();
        var dao = new app.persistence.PagamentoDao(conn);
        dao.obter(req.params.id, function(err, result) {
            if (err) {
                res.status(500).json(err);
                return;
            }
            res.status(200).json(result[0]);
        });
        conn.end();
    };

    function pagamentoHasErrors(req) {
        req.assert('forma_pagamento', 'required').notEmpty();
        req.assert('valor', 'required').notEmpty();
        req.assert('valor', 'invalid format').isFloat();
        req.assert('moeda', 'required').notEmpty();
        req.assert('moeda', 'invalid format').isLength({min: 3, max: 3});

        return req.validationErrors();
    }

    api.incluir = function(req, res) {

        var errors = pagamentoHasErrors(req);
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
                res.status(500).json(err);
                return;
            }
            pagamento.id = result.insertId;
            res.location('/pagamentos/' + result.insertId).status(201).json(pagamento);
        });
        conn.end();
    };

    api.alterar = function(req, res) {
        var errors = pagamentoHasErrors(req);
        if (errors) {
            res.status(400).json(errors);
            return;
        }

        var pagamento = req.body;
        if (!pagamento.id) {
            pagamento.id = req.params.id;
        }

        var conn = app.persistence.connectionFactory();
        var dao = new app.persistence.PagamentoDao(conn);

        dao.alterar(pagamento, function(err) {
            if (err) {
                res.status(500).json(err);
                return;
            }
            res.location('/pagamentos/' + pagamento.id).status(200).json(pagamento);
        });
        conn.end();
    };

    api.excluir = function(req, res) {
        var conn = app.persistence.connectionFactory();
        var dao = new app.persistence.PagamentoDao(conn);

        dao.excluir(req.params.id, function(err) {
            if (err) {
                res.status(500).json(err);
                return;
            }
            res.sendStatus(204);
        });
        conn.end();
    };

    return getApi;
};