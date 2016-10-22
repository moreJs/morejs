'use strict';
/**
 * Module Dep
 */

class Tokenizer{
    constructor(str) {
        this._str = str;
        // 指针
        this.index = 0;
        this.total = this._str.length;
        // 保存最后的 token
        this.output = [];
        this.emptyMap = {};
    }
    arrayFunction() {
        let reg = '=>';
        let temp = this._str.charAt(this.index) + this._str.charAt(this.index + 1);
        let result = false;

        if(temp === reg && this.isEmpty([this.index - 1, this.index + 2])) {
            this.output.push({
                type: 'arrayFunction',
                value: temp
            });
            this.index += 2;
            result = true;
        }
        return result;
    }
    isEqual() {
        let reg = '==';
        let temp = this._str.charAt(this.index) + this._str.charAt(this.index + 1);
        let result = false;
        if(temp === reg && this.isEmpty([this.index - 1, this.index + 2])) {
            this.output.push({
                type: 'isEqual',
                value: temp
            });
            this.index += 2;
            result = true;
        }
        return result;
    }
    isStrictEqual() {
        let reg = '===';
        let temp = this._str.charAt(this.index) + this._str.charAt(this.index + 1) + this._str.charAt(this.index + 2);
        let result = false;
        if(temp === reg && this.isEmpty([this.index - 1, this.index + 3])) {
            this.output.push({
                type: 'isEqual',
                value: temp
            });
            this.index += 3;
            result = true;
        }
        return result;
    }
    equal() {
        let reg = '=';
        let temp = this._str.charAt(this.index);
        let result = false;
        if(temp === reg && this.isEmpty([this.index - 1, this.index + 1])) {
            this.output.push({
                type: 'equal',
                value: temp
            });
            this.index++;
            result = true;
        }
        return result;
    }
    number() {
        let reg = /\d/;
        let temp = '';
        let result = false;
        while(reg.test(this._str.charAt(this.index))) {
            temp += this._str.charAt(this.index);
            this.index++;
            result = true;
        }
        if(result) {
            this.output.push({
                type: 'number',
                value: temp
            });
        }
        return result;
    }
    name() {
        let reg = /[a-z0-9."';]/i;
        let temp = '';
        let result = false;
        result = this.isStrictEqual() || this.arrayFunction() || this.isEqual() || this.equal();
        if(result) {
            return result;
        }

        while(reg.test(this._str.charAt(this.index)) || this._str.charAt(this.index) == '(' || this._str.charAt(this.index) == ')') {
            temp += this._str.charAt(this.index);
            this.index++;
            result = true;
        }
        if(result) {
            this.output.push({
                type: 'name',
                value: temp
            });
        }
        return result;
    }
    run() {
        let total = this._str.length;
        while(this.index < total) {
            if(this.isEmpty(this.index)) {
                this.index++;
                continue;
            }
            if(this.name() || this.number()) {
                continue;
            }else{
                let str = this._str.charAt(this.index);
                throw new Error('can not parse: ', str);
            }
        }
        return this.output;
    }
    isEmpty(i) {
        // optmise
        if(this.emptyMap[i]) {
            return this.emptyMap[i];
        }
        let reg = /\s/;
        let result = true;
        try {
            i.forEach(() => {});
        } catch (err) {
            i = [i];
        }
        i.forEach(index => {
            if(!reg.test(this._str.charAt(index))) {
                result = false;
            }
        });
        this.emptyMap[i] = result;
        return result;
    }
    static Create(str) {
        return new Tokenizer(str);
    }
}

module.exports = Tokenizer;