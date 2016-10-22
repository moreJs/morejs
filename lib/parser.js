'use strict';

class Parser{
    constructor(tokens) {
        this.tokens = tokens;
        this.index = 0;
        this.declarations = ['var','let','const'];
    }
    run() {
        // 安全退出
        if(this.index == this.tokens.length) {
            return;
        }
        let token = this.tokens[this.index];
        let ret = this.callExpression(token) || this.arrowFunctionExpression(this.index, token) || this.variableDeclaration(this.index, token) || this.identifier(token);
        if(ret) {
            return ret;
        }else{
            throw new Error(`can not parser [value]${token.value} [type]${token.type}`);
        }

    }
    callExpression(token) {
        if(token.type === 'name' && token.value.indexOf('.') != -1) {
            this.index++;
            let reg = /^([^.]*)\.([^(]*)([("']*)([^"')]*)/;
            let results = token.value.match(reg);
            return {
                type: "CallExpression",
                arguments: this._identifier(results[4]),
                callee: this._memberExpression(results[1], results[2])
            }
        }
        return null;
    }
    _memberExpression(obj, property) {
        return {
            type: 'MemberExpression',
            object: this._identifier(obj),
            property: this._identifier(property)
        }
    }
    _identifier(value) {
        return {
            type: 'Identifier',
            value: value
        }
    }
    arrowFunctionExpression(index, token) {
        if(token.type === 'name' && index + 1 < this.tokens.length && this.tokens[index + 1].type === 'arrayFunction') {
            this.index += 2;
            return {
                type: 'ArrowFunctionExpression',
                params: this._identifier(token.value),
                body: this.run()
            }
        }
        return null;
    }
    variableDeclaration(index, token) {
        // VariableDeclaration
        if(this.declarations.indexOf(token.value) !== -1) {
            this.index++;
            return {
                type: 'VariableDeclaration',
                kind: token.value,
                declarations: [this.run()]
            }
        }else if(token.type === 'name' && index + 1 < this.tokens.length && this.tokens[index + 1].type === 'equal') {
            this.index += 2;
            return {
                type: 'VariableDeclaration',
                id: this._identifier(token.value),
                init: [this.run()]
            }
        }else{
            return null;
        }
    }
    identifier(token) {
        // Identifier        
        if(token.type === 'number' || token.type === 'name') {
            this.index ++;            
            return this._identifier(token.value);
        }else{
            return null;
        }
    }
    start() {
        let ast = {
            type: 'Program',
            body: []
        };
        while(this.index < this.tokens.length - 1) {
            ast.body.push(this.run());
        }
        return ast;
    }
    static Create(tokens) {
        return new Parser(tokens);
    }
}

module.exports = Parser;