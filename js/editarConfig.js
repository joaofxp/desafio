//Referência para acessar variaveis internas
const self = this;
//Referência para os parâmetros que estão na URL
const parametros = parametrosPegar(window.location.href);

window.onload = function () {
    //Referência para o dia de hoje
    self.hoje = new Date();
    //colocamos o horário do dia de hoje como meia noite para futuras comparações
    self.hoje.setHours(00, 00, 00, 00);

    //verificamos se o local storage já existe ou está vazio
    if (localStorage.getItem("itens") === null || localStorage.getItem("itens") === "") {
        localStorage.itens = [];
        alert("Ocorreu um problema, redirecionando...");
        window.location.replace("listagem.html");
    }

    //Referência para o input que contém o nome do item
    self.nomeDoItem = document.getElementsByName("nomeDoItem")[0];
    //Referência para o input que contém o unidade de medida
    self.unidadeMedida = document.getElementsByName("unidadeMedida")[0];
    //Referência para o input que contém o quantidade
    self.quantidade = document.getElementsByName("quantidade")[0];
    //Referência para o input que contém a unidade de abreviatura
    self.unidadeAbreviatura = document.getElementsByName("unidadeAbreviatura")[0];
    //Referência para o input que contém o preço
    self.preco = document.getElementsByName("preco")[0];
    //Referência para o input que contém se é perecível
    self.perecivel = document.getElementsByName("perecivel")[0];
    //Referência para o input que contém a validade
    self.validade = document.getElementsByName("validade")[0];
    //Referência para o input que contém a fabricação
    self.fabricacao = document.getElementsByName("fabricacao")[0];

    //Caso a lista de itens não esteja vazia, carregamos as informações do item
    if (localStorage.itens != "") {
        for (let item of JSON.parse(localStorage.itens)) {
            //Verificamos se os parametros coincidem com um item da lista
            if (item.fabricacao == parametros.fabricacao && item.nomeDoItem == decodeURI(parametros.nomeDoItem) && item.ativo === true) {
                self.nomeDoItem.value = item.nomeDoItem;
                self.unidadeMedida.value = item.unidadeMedida;
                self.quantidade.value = item.quantidade;
                self.unidadeAbreviatura.value = item.unidadeAbreviatura;
                self.preco.value = item.preco;
                self.perecivel.checked = item.perecivel;
                self.validade.value = item.validade;
                self.fabricacao.value = item.fabricacao;
            }
        }
    }
}

//função responsável pela edição de um item
serializar = () => {
    //Referência para os itens guardados no local storage
    let itens = JSON.parse(localStorage.itens);
    
    //encontrar o item que será editado e alterar os valores
    for (let item of itens) {
        if (item.fabricacao == parametros.fabricacao && item.nomeDoItem == decodeURI(parametros.nomeDoItem) && item.ativo === true) {
            item.nomeDoItem = self.nomeDoItem.value;
            item.unidadeMedida = self.unidadeMedida.value;
            item.quantidade = self.quantidade.value;
            item.unidadeAbreviatura = self.unidadeAbreviatura.value;
            item.preco = self.preco.value;
            item.perecivel = self.perecivel.checked;
            item.validade = self.validade.value;
            item.fabricacao = self.fabricacao.value;
            item.ativo = true;
        }
    }

    //Salvar a nova lista de itens
    localStorage.itens = JSON.stringify(itens);
    //Avisar sobre o status da edição
    alert("Item editado com sucesso!");
}

//Limita a data de fabricação caso seja um produto perecível
limitarDataFabricação = () => {
    if (self.validade.hasAttribute("required"))
        self.fabricacao.setAttribute("max", self.validade.value);
}

//comparar se uma data é inferior a outra
dataInferior = () => (self.validade.value.substring(0, 4) > 1753) ? new Date(self.validade.value + "T00:00:00") < self.hoje : false;

//alertar o usuario sobre a validade do produto
produtoVencido = () => console.log("O produto encontra-se vencido.");

//tornamos validade obrigatória caso seja um produto perecível
validadeObrigatoria = (perecivel) => {
    if (perecivel) {
        self.validade.setAttribute("required", "");
        limitarDataFabricação(self.validade.value);
    } else
        self.validade.removeAttribute("required");
}

//mascaramos o input de dinheiro
mascarar = () => $("input[name='preco']").maskMoney();

//configurar a unidade de abreviatura
quantidadeConfigurar = (quantidade) => {
    //definimos que o número possui três casas decimais
    self.quantidade.setAttribute("step", "0.001")
    self.unidadeAbreviatura.setAttribute("value", "");

    switch (quantidade) {
        case "1":
            self.unidadeAbreviatura.value = "lt";
            break;
        case "2":
            self.unidadeAbreviatura.value = "kg";
            break;
        case "3":
        self.unidadeAbreviatura.value = "un";
            //definimos que o número não possui casas decimais
            self.quantidade.setAttribute("step", "1")
            break;
        default:
            break;
    }
}

//Função responsável por pegar os parametros da URL
function parametrosPegar(url) {
    // get query string from url (optional) or window
    let queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    let obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        let arr = queryString.split('&');

        for (let i = 0; i < arr.length; i++) {
            // separate the keys and the values
            let a = arr[i].split('=');

            // in case params look like: list[]=thing1&list[]=thing2
            let paramNum = undefined;
            let paramName = a[0].replace(/\[\d*\]/, function (v) {
                paramNum = v.slice(1, -1);
                return '';
            });

            // set parameter value (use 'true' if empty)
            let paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

            // (optional) keep case consistent
            // paramName = paramName.toLowerCase();
            // paramValue = paramValue.toLowerCase();

            // if parameter name already exists
            if (obj[paramName]) {
                // convert value to array (if still string)
                if (typeof obj[paramName] === 'string') {
                    obj[paramName] = [obj[paramName]];
                }
                // if no array index number specified...
                if (typeof paramNum === 'undefined') {
                    // put the value on the end of the array
                    obj[paramName].push(paramValue);
                }
                // if array index number specified...
                else {
                    // put the value at that index number
                    obj[paramName][paramNum] = paramValue;
                }
            }
            // if param name doesn't exist yet, set it
            else {
                obj[paramName] = paramValue;
            }
        }
    }

    return obj;
}