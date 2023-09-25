const { contas, saques, depositos, transferencias } = require('../bancodedados/bancodedados');
const { format } = require('date-fns');

let numeroConta = 1;

//-----------------VERIFICAÇÕES DA API-------------------

const verificacaodados = (nome, cpf, data_nascimento, telefone, email, senha, res) => {

    if (!nome) {
        return res.status(400).json({ mensagem: 'O nome é obrigatório' });
    }
    if (!cpf) {
        return res.status(400).json({ mensagem: 'O cpf é obrigatório' });
    }
    if (!data_nascimento) {
        return res.status(400).json({ mensagem: 'A data de nascimento é obrigatória' });
    }
    if (!telefone) {
        return res.status(400).json({ mensagem: 'O telefone é obrigatório' });
    }
    if (!email) {
        return res.status(400).json({ mensagem: 'O email é obrigatório' });
    }
    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha é obrigatória' });
    }
}

const verificacaoNumeroValido = (numeroConta, res) => {
    if (isNaN(numeroConta)) {
        return res.status(400).json({ mensagem: 'O numero da conta informado não é um número valido' });
    }
}

const verificacaContaExistente = (numeroConta, numero_conta, res) => {
    const conta = contas.find((conta) => (conta.numero === parseInt(numeroConta)) || (conta.numero === parseInt(numero_conta)));
    console.log(conta);

    if (!conta) {
        return res.status(404).json({ mensagem: 'O numero da conta informada não foi encontrado' });
    }

    return conta;
}

const verificacaoCpf_EmailExistente = (cpf, email, res) => {
    const cpfExistente = contas.find((conta) => {
        return conta.usuario.cpf === cpf;
    });

    const emailExistente = contas.find((conta) => {
        return conta.usuario.email === email;
    });

    if (cpfExistente || emailExistente) {
        return res.status(400).json({ mensagem: 'Já existe uma conta com o cpf ou e-mail informado!' });
    }
}

const verificacaoValorMaiorQueZero = (valor, res) => {
    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'O valor deve ser maior que zero' });
    }
}

const verificacaoNumero_Senha = (numero_conta, senha, res) => {
    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: 'O número da conta e a senha são obrigatórios!' });
    }
}


//-----------------FUNÇÕES DA API-------------------

//-----------------listar Contas--------------------
const listarContas = (req, res) => {
    return res.json(contas);
}

//-----------------Criar Contas---------------------
const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    verificacaodados(nome, cpf, data_nascimento, telefone, email, senha, res);
    verificacaoCpf_EmailExistente(cpf, email, res);

    const novaConta = {
        numero: numeroConta,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }

    contas.push(novaConta);
    numeroConta++;
    return res.status(201).json();
}

//-----------------Atualizar Contas---------------------
const atualizarConta = (req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    verificacaodados(nome, cpf, data_nascimento, telefone, email, senha, res);
    verificacaoNumeroValido(numeroConta, res);
    verificacaoCpf_EmailExistente(cpf, email, res);
    verificacaContaExistente(numeroConta, res);
    const conta = verificacaContaExistente(null, numeroConta, res);

    conta.usuario.nome = nome;
    conta.usuario.cpf = cpf;
    conta.usuario.data_nascimento = data_nascimento;
    conta.usuario.telefone = telefone;
    conta.usuario.email = email;
    conta.usuario.senha = senha;

    return res.status(204).json();
}

//-----------------Deletar Contas---------------------
const deletarConta = (req, res) => {
    const { numeroConta } = req.params;

    verificacaoNumeroValido(numeroConta, res);

    const conta = contas.find((conta) => (conta.numero === parseInt(numeroConta)));

    if (!conta) {
        return res.status(404).json({ mensagem: 'O numero da conta informada não foi encontrado' });
    }

    if (conta.saldo !== 0) {
        return res.status(400).json({ mensagem: 'A conta só pode ser removida se o saldo for zero!' });
    }

    contas.splice(conta, 1);
    return res.status(200).json();
}

//-----------------Depositar------------------------------
const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    if (!numeroConta || !valor) {
        return res.status(404).json({ mensagem: 'O número da conta e o valor são obrigatórios!' });
    }

    verificacaoValorMaiorQueZero(valor, res);
    verificacaContaExistente(null, numero_conta, res);
    const conta = verificacaContaExistente(numero_conta, res);

    conta.saldo += valor;

    const transacao = {
        data: new Date(),
        numero_conta,
        valor,
    };

    depositos.push(transacao);
    return res.status(204).send();
}

//-----------------Sacar------------------------------
const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ mensagem: 'O número da conta, o valor e a senha são obrigatórios!' });
    }

    verificacaoValorMaiorQueZero(valor, res);
    verificacaContaExistente(null, numero_conta, res);
    const conta = verificacaContaExistente(numero_conta, res);

    if (conta.usuario.senha !== senha) {
        return res.status(401).json({ mensagem: 'Senha inválida' });
    }

    if (conta.saldo < valor) {
        return res.status(400).json({ mensagem: 'Saldo menor que o valor de saque' });
    }

    conta.saldo -= valor;

    const transacao = {
        data: new Date(),
        numero_conta,
        valor,
    };

    saques.push(transacao);
    return res.status(204).send();
}

//-----------------Transferir------------------------------
const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({ mensagem: 'O número da conta de origem, destino, valor e a senha são obrigatórios!' });
    }

    const contaOrigem = contas.find((conta) => conta.numero === parseInt(numero_conta_origem));

    const contaDestino = contas.find((conta) => conta.numero === parseInt(numero_conta_destino));

    if (!contaOrigem || !contaDestino) {
        return res.status(404).json({ mensagem: 'O numero da(s) conta(s) informada(s) não foi encontrado' });
    }

    if (contaOrigem.usuario.senha !== senha) {
        return res.status(401).json({ mensagem: 'Senha inválida' });
    }

    verificacaoValorMaiorQueZero(valor, res);

    if (contaOrigem.saldo < valor) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente!' });
    }

    contaOrigem.saldo -= valor;
    contaDestino.saldo += valor;

    const transacao = {
        data: new Date(),
        numero_conta_origem,
        numero_conta_destino,
        valor,
    };

    transferencias.push(transacao);
    return res.status(204).send();
}

//-----------------Saldo------------------------------
const saldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    verificacaoNumero_Senha(numero_conta, senha, res);
    verificacaContaExistente(null, numero_conta, res);
    const conta = verificacaContaExistente(numero_conta, res);

    if (conta.usuario.senha !== senha) {
        return res.status(401).json({ mensagem: 'Senha inválida' });
    }

    return res.status(200).json(`Saldo: ${conta.saldo}`);
}

//-----------------Extrato------------------------------
const extrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    verificacaoNumero_Senha(numero_conta, senha, res);
    verificacaContaExistente(null, numero_conta, res);
    const conta = verificacaContaExistente(numero_conta, res);

    if (conta.usuario.senha !== senha) {
        return res.status(401).json({ mensagem: 'Senha inválida' });
    }

    const depositosUsuario = depositos.filter((transacao) => {
        return transacao.numero_conta === numero_conta;
    });

    const saquesUsuario = saques.filter((transacao) => {
        return transacao.numero_conta === numero_conta;
    });

    const transferenciasUsuarioOrigem = transferencias.filter((transacao) => {
        return transacao.numero_conta_origem === numero_conta;
    });

    const transferenciasUsuarioDestino = transferencias.filter((transacao) => {
        return transacao.numero_conta_destino === numero_conta;
    });

    const formatarDatas = (transacoes) => {
        return transacoes.map((transacao) => {
            return {
                ...transacao,
                data: format(new Date(transacao.data), "yyyy-MM-dd HH:mm:ss")
            };
        });
    };

    const extratoFormatado = {
        depositos: formatarDatas(depositosUsuario),
        saques: formatarDatas(saquesUsuario),
        transferenciasEnviadas: formatarDatas(transferenciasUsuarioOrigem),
        transferenciasRecebidas: formatarDatas(transferenciasUsuarioDestino),
    };

    return res.status(200).json(extratoFormatado);
}

module.exports = {
    listarContas,
    criarConta,
    atualizarConta,
    deletarConta,
    depositar,
    sacar,
    transferir,
    saldo,
    extrato
}



