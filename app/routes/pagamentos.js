module.exports = function(app) {
    app.get('/pagamentos', function(req, res) {
        console.log('requisição recebida na porta 3000');
        res.send('oi!');
    });
};
