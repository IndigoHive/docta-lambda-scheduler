# ![image](https://github.com/user-attachments/assets/8e315813-3461-4f0d-bc6a-27514f7b6dd9)
# 🗓️ Cogfy Scheduler
Esse código foi desenvolvido afim de testar agendamentos de mensagens em canais do WhatsApp utilizando apoiado pelas collections do Cogfy.

## Tecnologias
Nome | Descrição
--- | ---
Cogfy | Para a criação e automação de conteúdos gerado por IA
Whapi | API para enviar mensagens para canais do Whatsapp
Toad Scheduler | Biblioteca para criação de jobs para agendar tarefas

## Cogfy
1. Essa aplicação serve para quem utiliza o Cogfy, se ainda não conhece, acesse aqui: [https://www.cogfy.com/](https://www.cogfy.com/)

2. Se você já tem um workspace, crie uma collection pelo Cogfy com o nome Scheduler, ela tem que se parecer com isso:
![image](https://github.com/user-attachments/assets/374f2aff-e78d-4dc6-915e-b3b17c1d3cce)

3. [Crie uma chave de API](https://app.cogfy.com/SBC/api-keys/create) que permita a visualização e a modificação da collection que você criou (a Scheduler)

4. Acesse a URL da sua collection, e obtenha seu ID e guarde somente o ID na variável de ambiente `COGFY_COLLECTION_ID`.

## Usabilidade
1. Antes de começar, instale todas as dependências do projeto: `npm install`
2. Acesse o arquivo `.env` e altere as variáveis de ambiente com os dados necessários para a aplicação rodar
3. É necessário que você saiba os IDs dos campos e propriedades que você irá manipular, acesse `src/index.ts` e os adicione
