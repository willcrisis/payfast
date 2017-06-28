function PagamentoDao(connection) {
    this._connection = connection;
}

PagamentoDao.prototype.listar = function(callback) {
    this._connection.query('select * from pagamento', callback);
};

PagamentoDao.prototype.obter = function(id, callback) {
    this._connection.query('select * from pagamento where id = ?', id, callback);
};

PagamentoDao.prototype.incluir = function(pagamento, callback) {
    this._connection.query('insert into pagamento set ?', pagamento, callback);
};

PagamentoDao.prototype.alterar = function(pagamento, callback) {
    this._connection.query('update pagamento set ? where id = ?', [pagamento, pagamento.id], callback);
};

PagamentoDao.prototype.excluir = function(id, callback) {
    this._connection.query('delete from pagamento where id = ?', id, callback);
};

module.exports = function() {
    return PagamentoDao;
}