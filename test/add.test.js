/* eslint-disable no-undef */
import { add } from "../src/index";
var assert = chai.assert;

describe("test", function() {
  describe("加法函数的测试", function() {
    it("1 加 1 应该等于 2", function() {
      assert.equal(add(1, 1), 2);
    });
  });
});
