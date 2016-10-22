'use strict';

class Genarator{
    constructor(node){
        this._node = node;
    }
    run(item){
        let node = item || this._node;
        switch(node.type){
            case 'Program':
                return node.body.map(item => {
                    return this.run(item);
                }).join('\n');
            case 'VariableDeclaration':
                return this._variable(node);
            case 'Identifier':
                return node.value;
            case 'FunctionExpression':
                return this._function(node);
            case 'CallExpression':
                return this._callee(node);
            case 'MemberExpression':
                return this._member(node);
            default:
                throw new Error(`can not genarator ${node.type}`);
        }
    }
    _callee(node) {
        return `${this.run(node.callee)}(${this.run(node.arguments)});`;
    }
    _member(node) {
        return `${this.run(node.object)}.${this.run(node.property)}`;
    }
    _function(node) {
        return `function(${this.run(node.params)}) {
            ${this.run(node.body)}
        }`;
    }
    _variable(node) {
        if(node.kind) {
            let innerCode = node.declarations.map(item => {
                return this.run(item);
            }).join('\n');
            return `${node.kind} ${innerCode};`;
        }else if(node.init) {
            let innerCode = node.init.map(item => {
                return this.run(item);
            }).join('\n');
            return  `${this.run(node.id)} = ${innerCode}` 
        }
        return 'VariableDeclarationError';
    }
}

module.exports = Genarator;