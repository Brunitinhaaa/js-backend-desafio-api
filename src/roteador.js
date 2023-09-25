const express = require('express');
const { listarContas, criarConta, atualizarConta, deletarConta, depositar, sacar, transferir, saldo, extrato } = require('./controladores/controladores');
const verificarSenha = require('./intermediario');

const rotas = express();

rotas.get('/contas', verificarSenha, listarContas);
rotas.post('/contas', criarConta);
rotas.put('/contas/:numeroConta/usuario', atualizarConta);
rotas.delete('/contas/:numeroConta', deletarConta);
rotas.post('/transacoes/depositar', depositar);
rotas.post('/transacoes/sacar', sacar);
rotas.post('/transacoes/transferir', transferir);
rotas.get('/contas/saldo', saldo);
rotas.get('/contas/extrato', extrato);

module.exports = rotas;