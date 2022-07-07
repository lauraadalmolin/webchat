# Webchat

## Instalação do servidor

Para rodar o servidor, você precisa instalar o *Node.js* na sua máquina.

**Ubuntu:**

1. Faça download da versão LTS (Long Term Support) disponível no [site oficial](https://nodejs.org/en/).
2. Abra o terminal na pasta Downloads
3. Rode os seguintes comandos:

```
sudo apt update
sudo apt install xz-utils
sudo tar -xvf NAME_OF_DOWNLOADED_FILE
sudo cp -r NAME_OF_DOWNLOADED_FILE/{bin,include,lib,share} /usr/
export PATH=/usr/NAME_OF_DOWNLOADED_FILE/bin:$PATH
```

4. Você pode verificar se a instalação foi realizada com sucesso rodando ```node --version```

Depois de instalar o Node.js, você precisa acessar a pasta do servidor pelo terminal e então rodar:

```
npm install
npm start
```

Com isso, o servidor já deve estar rodando!

## Instalação do cliente

**Ubuntu:**
Primeiro, siga todas as intruções para instalação do servidor. Em seguida, basta rodar:

```
npm install
npm start
```

Com isso, o cliente já deve estar rodando!
Provavelmente será aberta uma janela no navegador com a aplicação, mas caso isso não ocorra, basta acessar *localhost:3000*.

**Você precisará abrir o sistema em no mínimo duas janelas diferentes para conseguir testar corretamente o webchat.**