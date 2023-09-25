# Desafio - Back-end

![giphy](https://github.com/Brunitinhaaa/Site-Petshop/assets/104976135/4e55f474-3f4a-4d8b-be8c-a76980f20989)

<h1>Descrição do desafio</h1>
Foi feita a construção de uma API RESTful que permite:

-   Criar conta bancária
-   Listar contas bancárias
-   Atualizar os dados do usuário da conta bancária
-   Excluir uma conta bancária
-   Depósitar em uma conta bancária
-   Sacar de uma conta bancária
-   Transferir valores entre contas bancárias
-   Consultar saldo da conta bancária
-   Emitir extrato bancário

<h1>Linguagem Utilizada</h1>
<h3>Javascript</h3>

<img width="30%" src= https://github.com/Brunitinhaaa/TCC-sistema-presenca-RFID/assets/104976135/2abd2863-d92f-4251-8513-c780bfd05e0f>

<h1>Framework Utilizado</h1>
<h3>Node.js</h3>

<img width="30%" src=https://github.com/Brunitinhaaa/TCC-sistema-presenca-RFID/assets/104976135/e360faa3-5316-45fe-8c49-e77e8843ebea>

<h1>Persistência de Dados</h1>
Os dados serão persistidos em memória, no objeto existente dentro do arquivo `bancodedados.js`. 

# Erros e seus respectivos Status

- **200 (OK):** Requisição bem sucedida
- **201 (Created):** Requisição bem sucedida e algo foi criado
- **204 (No Content):** Requisição bem sucedida, sem conteúdo no corpo da resposta
- **400 (Bad Request):** O servidor não entendeu a requisição pois está com uma sintaxe/formato inválido
- **401 (Unauthorized):** O usuário não está autenticado (logado)
- **403 (Forbidden):** O usuário não tem permissão de acessar o recurso solicitado
- **404 (Not Found):** O servidor não pode encontrar o recurso solicitado
- **500 (Internal Server Error):** Falhas causadas pelo servidor
