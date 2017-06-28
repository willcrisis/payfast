module.exports = function (app) {
    const api = app.api.pagamentos(app);

    app.route('/pagamentos')
        .get(api.listar)
        .post(api.incluir);

    app.route('/pagamentos/:id')
        .get(api.obter)
        .put(api.alterar)
        .delete(api.excluir);
};
