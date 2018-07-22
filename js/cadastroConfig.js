const self = this;

window.onload = function () {
    self.hoje = new Date();
    self.hoje.setHours(00, 00, 00, 00);
    
    self.nomeDoItem = document.getElementsByName("nomeDoItem")[0];
    self.unidadeMedida = document.getElementsByName("unidadeMedida")[0];
    self.quantidade = document.getElementsByName("quantidade")[0];
    self.unidadeAbreviatura = document.getElementsByName("unidadeAbreviatura")[0];
    self.preco = document.getElementsByName("preco")[0];
    self.perecivel = document.getElementsByName("perecivel")[0];
    self.validade = document.getElementsByName("validade")[0];
    self.fabricacao = document.getElementsByName("fabricacao")[0];

    if (localStorage.getItem("itens") === null || localStorage.getItem("itens") === "")
        localStorage.itens = [];
}

serializar = () => {
    let itens = (localStorage.itens === "") ? [] : JSON.parse(localStorage.itens);

    let itemNovo = {
        nomeDoItem : self.nomeDoItem.value,
        unidadeMedida : self.unidadeMedida.value,
        quantidade : self.quantidade.value,
        unidadeAbreviatura : self.unidadeAbreviatura.value,
        preco : self.preco.value,
        perecivel : self.perecivel.value,
        validade : self.validade.value,
        fabricacao : self.fabricacao.value,
        ativo: true
    }
    itens.push(itemNovo);

    localStorage.itens = JSON.stringify(itens);
    alert("Item cadastrado com sucesso!");
}

limitarDataFabricação = () => {
    if (self.validade.hasAttribute("required"))
        self.fabricacao.setAttribute("max", self.validade.value);
}

dataInferior = () => new Date(self.validade.value + "T00:00:00") < hoje;

produtoVencido = () => console.log("O produto encontra-se vencido.");

validadeObrigatoria = (perecivel) => {
    if (perecivel) {
        self.validade.setAttribute("required", "");
        limitarDataFabricação(self.validade.value);
    } else
        self.validade.removeAttribute("required");
}

mascarar = () => $("input[name='preco']").maskMoney();

cadastroCarregar = () => {
    $("#conteudo").load('cadastro.html');
}

quantidadeConfigurar = (quantidade) => {
    self.quantidade.setAttribute("step", "0.001")
    self.unidadeAbreviatura.setAttribute("value", "");

    switch (quantidade) {
        case "1":
            self.unidadeAbreviatura.setAttribute("value", "lt");
            break;
        case "2":
            self.unidadeAbreviatura.setAttribute("value", "kg");
            break;
        case "3":
            self.quantidade.setAttribute("step", "1")
            self.unidadeAbreviatura.setAttribute("value", "un");
            break;
        default:
            break;
    }
}

