self = this;

window.onload = function () {
    self.hoje = new Date();
    self.hoje.setHours(00, 00, 00, 00);

    self.validade = document.getElementById("validade");
    self.quantidade = document.getElementById("quantidade");
    self.unidadeAbreviatura = document.getElementById("unidadeAbreviatura");
    self.fabricacao = document.getElementById("fabricacao");
}

limitarDataFabricação = () => {
    if (self.validade.hasAttribute("required"))
        self.fabricacao.setAttribute("max", self.validade.value);
}

dataInferior = () => new Date(self.validade.value + "T00:00:00") < hoje;

produtoVencido = () => alert("O produto encontra-se vencido.");

validadeObrigatoria = (perecivel) => {
    if (perecivel) {
        self.validade.setAttribute("required", "");
        limitarDataFabricação(self.validade.value);
    } else
        self.validade.removeAttribute("required");
}

mascarar = () => $("#preco").maskMoney();

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