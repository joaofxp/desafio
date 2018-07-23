/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*    @author João Francisco - https://github.com/joaofxp                  *
*    @updated 23/07/2018                                                  *
*    Pacote: Desafio Front-End                                            *
*                                                                         *
*    Copyright (C) 2018 UNIVALI - Universidade do Vale do Itajaí          *
*                  https://univali.br                                     *
*                  0800 723 1300                                          *
*                                                                         *
*    Este  programa  é  software livre, você pode redistribuí-lo e/ou     *
*    modificá-lo sob os termos da Licença Pública Geral GNU, conforme     *
*    publicada pela Free  Software  Foundation,  tanto  a versão 2 da     *
*    Licença   como  (a  seu  critério)  qualquer  versão  mais  nova.    *
*                                                                         *
*    Este programa  é distribuído na expectativa de ser útil, mas SEM     *
*    QUALQUER GARANTIA. Sem mesmo a garantia implícita de COMERCIALI-     *
*    ZAÇÃO  ou  de ADEQUAÇÃO A QUALQUER PROPÓSITO EM PARTICULAR. Con-     *
*    sulte  a  Licença  Pública  Geral  GNU para obter mais detalhes.     *
*                                                                         *
*    Você  deve  ter  recebido uma cópia da Licença Pública Geral GNU     *
*    junto  com  este  programa. Se não, escreva para a Free Software     *
*    Foundation,  Inc.,  59  Temple  Place,  Suite  330,  Boston,  MA     *
*    02111-1307, USA.                                                     *
*                                                                         *
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/

//Referência para acessar variaveis internas
var self = this;

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
    if (localStorage.getItem("itens") === null || localStorage.getItem("itens") === "") localStorage.itens = [];
};

//função responsável pelo cadastro de um item
serializar = function serializar() {
    //Referência para os itens guardados no local storage
    var itens = localStorage.itens === "" ? [] : JSON.parse(localStorage.itens);

    //Novo item a ser adicionado
    var itemNovo = {
        nomeDoItem: self.nomeDoItem.value,
        unidadeMedida: self.unidadeMedida.value,
        quantidade: self.quantidade.value,
        unidadeAbreviatura: self.unidadeAbreviatura.value,
        preco: self.preco.value,
        perecivel: self.perecivel.checked,
        validade: self.validade.value,
        fabricacao: self.fabricacao.value,
        ativo: true
    };

    //adicionamos este novo item na referênica do local storage
    itens.push(itemNovo);

    //adicionamos a referência no localstorage, substituindo os itens anteriores
    localStorage.itens = JSON.stringify(itens);
    //alertamos o usuário sobre o cadastro
    alert("Item cadastrado com sucesso!");
};

//Limita a data de fabricação caso seja um produto perecível
limitarDataFabricacao = function limitarDataFabricacao() {
    if (self.validade.hasAttribute("required")) {
        self.fabricacao.setAttribute("max", self.validade.value);
    }
};

//comparar se uma data é inferior a outra
dataInferior = function dataInferior() {
    return self.validade.value.substring(0, 4) > 1753 ? new Date(self.validade.value + "T00:00:00") < self.hoje : false;
};

//alertar o usuario sobre a validade do produto
produtoVencido = function produtoVencido() {
    return alert("O produto encontra-se vencido.");
};

//tornamos validade obrigatória caso seja um produto perecível
validadeObrigatoria = function validadeObrigatoria(perecivel) {
    if (perecivel) {
        self.validade.setAttribute("required", "");
        limitarDataFabricacao(self.validade.value);
    } else self.validade.removeAttribute("required");
};

//mascaramos o input de dinheiro
mascarar = function mascarar() {
    return $("input[name='preco']").maskMoney();
};

//configurar a unidade de abreviatura
quantidadeConfigurar = function quantidadeConfigurar(quantidade) {
    //definimos que o número possui três casas decimais
    self.quantidade.setAttribute("step", "0.001");
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
            self.quantidade.setAttribute("step", "1");
            break;
        default:
            break;
    }
};