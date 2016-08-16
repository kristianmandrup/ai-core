/*
 * ai-core
 * https://github.com/kristianmandrup/ai-core
 *
 * Copyright (c) 2016, Kristian Mandrup
 * Licensed under the MIT license.
 */

'use strict';

var chai = require('chai'),
    expect = chai.expect;

chai.should();

var ai-core = require('../lib/ai-core.js');

describe('ai-core module', function() {
    describe('#awesome()', function() {
        it('should return a hello', function() {
            expect(ai-core.awesome('livia')).to.equal('hello livia');
        });
    });
});
