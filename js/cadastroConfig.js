//Referência para acessar variaveis internas
const self = this;

//quando a página terminar de carregar
window.onload = function () {
    //Referência para o dia de hoje
    self.hoje = new Date();
    //colocamos o horário do dia de hoje como meia noite para futuras comparações
    self.hoje.setHours(00, 00, 00, 00);
    
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
    
    //verificamos se o local storage já existe ou está vazio
    if (localStorage.getItem("itens") === null || localStorage.getItem("itens") === "")
        localStorage.itens = [];
}

//função responsável pelo cadastro de um item
serializar = () => {
    //Referência para os itens guardados no local storage
    let itens = (localStorage.itens === "") ? [] : JSON.parse(localStorage.itens);

    //Novo item a ser adicionado
    let itemNovo = {
        nomeDoItem : self.nomeDoItem.value,
        unidadeMedida : self.unidadeMedida.value,
        quantidade : self.quantidade.value,
        unidadeAbreviatura : self.unidadeAbreviatura.value,
        preco : self.preco.value,
        perecivel : self.perecivel.checked,
        validade : self.validade.value,
        fabricacao : self.fabricacao.value,
        ativo: true
    }

    //adicionamos este novo item na referênica do local storage
    itens.push(itemNovo);

    //adicionamos a referência no localstorage, substituindo os itens anteriores
    localStorage.itens = JSON.stringify(itens);
    //alertamos o usuário sobre o cadastro
    alert("Item cadastrado com sucesso!");
}

//Limita a data de fabricação caso seja um produto perecível
limitarDataFabricacao = () => {
    if (self.validade.hasAttribute("required")){
        self.fabricacao.setAttribute("max", self.validade.value);
    }
}

//comparar se uma data é inferior a outra
dataInferior = () => (self.validade.value.substring(0, 4) > 1753) ? new Date(self.validade.value + "T00:00:00") < self.hoje : false;

//alertar o usuario sobre a validade do produto
produtoVencido = () => alert("O produto encontra-se vencido.");

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

