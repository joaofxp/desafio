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

window.onload = function () {
    //Referência para o dia de hoje
    self.hoje = new Date();
    //colocamos o horário do dia de hoje como meia noite para futuras comparações
    self.hoje.setHours(00, 00, 00, 00);

    //Referencia para o corpo de conteúdo (tbody) da tabela
    self.itensTabelaCorpo = $("#itensTabelaCorpo");

    //verificamos se o local storage já existe ou está vazio
    if (localStorage.getItem("itens") === null || localStorage.getItem("itens") === "") {
        localStorage.itens = [];
        self.itensTabelaCorpo.append($('<tr></tr>').load("itemTemplate.html"));
    }

    var registrosChecagem = false;

    //Caso a lista de itens não esteja vazia, carregamos os itens do localStorage na tabela
    if (localStorage.itens != "") {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            var _loop = function _loop() {
                var item = _step.value;

                if (item.ativo === true) {
                    registrosChecagem = true;
                    var novoItem = $('<tr></tr>').load("itemTemplate.html", function () {
                        novoItem[0].children[0].firstElementChild.value = item.nomeDoItem;
                        novoItem[0].children[1].firstElementChild.value = item.unidadeMedida;
                        novoItem[0].children[2].children[0].value = item.quantidade;
                        novoItem[0].children[2].children[1].value = item.unidadeAbreviatura;
                        novoItem[0].children[3].firstElementChild.value = item.preco;
                        novoItem[0].children[4].firstElementChild.checked = item.perecivel;
                        novoItem[0].children[5].firstElementChild.value = item.validade;
                        novoItem[0].children[6].firstElementChild.value = item.fabricacao;
                        //Adicionamos aos botões os parâmetros para editar e remover do item
                        novoItem[0].children[7].children[0].setAttribute("onclick", "itemEditar('" + item.nomeDoItem + "', '" + item.fabricacao + "')");
                        novoItem[0].children[7].children[1].setAttribute("onclick", "itemRemover('" + item.nomeDoItem + "', '" + item.fabricacao + "')");

                        //Verificamos se o produto está vencido, se estiver mudamos o input para vermelho
                        if (dataInferior(item.validade)) {
                            novoItem[0].children[5].firstElementChild.classList.remove("form-control");
                            novoItem[0].children[5].firstElementChild.classList.add("btn");
                            novoItem[0].children[5].firstElementChild.classList.add("btn-danger");
                            novoItem[0].children[5].firstElementChild.classList.add("disabled");
                        }

                        //Adicionamos o item ao tbody da tabela
                        self.itensTabelaCorpo.append(novoItem);
                    });
                }
            };

            for (var _iterator = JSON.parse(localStorage.itens)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                _loop();
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }

    //Caso nenhum item seja listado, informamos que não há cadastros
    if (!registrosChecagem) {
        $("table").remove();
        $("#tabelaVazia").append("<h4>Não há itens cadastrados</h4>");
    }
};

//comparar se uma data é inferior a outra
dataInferior = function dataInferior(validade) {
    return new Date(validade + "T00:00:00") < self.hoje;
};

//Ir para a tela de edição, passando o nome e a data de fabricacao do item
itemEditar = function itemEditar(nomeDoItem, fabricacao) {
    window.location.href = "editar.html?nomeDoItem=" + nomeDoItem + "&fabricacao=" + fabricacao;
};

//Faz a remoção d um item
itemRemover = function itemRemover(nomeDoItem, fabricacao) {
    if (confirm("Realmente deseja excluir este item?")) {
        var removido = false;

        var itens = JSON.parse(localStorage.itens);

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = itens[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _item = _step2.value;

                if (_item.nomeDoItem == nomeDoItem && _item.fabricacao == fabricacao) {
                    _item.ativo = false;
                    removido = true;
                }
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        if (removido == true) {
            alert("Item removido com sucesso!");
            localStorage.itens = JSON.stringify(itens);
        } else alert("Erro ao remover, contate um administrador.");

        window.location.reload();
    }
};