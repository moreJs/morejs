'use strict';

class Transformer{
    constructor(ast) {
        this.ast = ast;
        this._initVistor();
    }
    _initVistor() {
        this._visitor = {
            Identifier: (node, parent) => {
                parent._context.push(node);
            },
            VariableDeclaration: (node, parent) => {
                if(node.declarations) {
                    let newv = {
                        type: 'VariableDeclaration',
                        kind: node.kind,
                        declarations: []
                    };
                    parent._context.push(newv);
                    node._context = newv.declarations;
                }else if(node.init) {
                    let newv = {
                        type: 'VariableDeclaration',
                        init: [],
                        id: node.id
                    };
                    parent._context.push(newv);
                    node._context = newv.init;
                }
            },
            CallExpression: (node, parent) => {
                parent._context.push(node);
            },
            MemberExpression: (node, parent) => {
                parent._context.push(node);
            },
            ArrowFunctionExpression: (node ,parent) => {
                parent._context.push({
                    type: 'FunctionExpression',
                    params: node.params,
                    body: node.body
                });
            }
        };
    }
    traverseArray(array, parent) {
        array.forEach(node => {
            this.traverseNode(node, parent);
        });
    }
    traverseNode(node, parent) {
        let method = this._visitor[node.type];
        if(method) {
            method(node, parent);
        }
        switch(node.type){
            case 'Program':
                this.traverseArray(node.body, node);
                break;
            case 'VariableDeclaration':
                this.traverseArray(node.declarations || node.init, node);
                break;
        }
    }
    run() {
        const newAst = {
            type: 'Program',
            body: []
        };
        this.ast._context = newAst.body;
        this.traverseNode(this.ast, null);
        return newAst;
    }
    static Create(opt) {
        return new Transformer(opt);
    }
}

module.exports = Transformer;