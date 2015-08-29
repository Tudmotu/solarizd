import {module, inject} from '../mocks';

describe("formatTime filter", function () {
    var $filter;
    var formatTime;

    beforeEach(module('filters'));
    beforeEach(inject(function(_$filter_){
        $filter = _$filter_;
        formatTime = $filter('formatTime');
    }));

    it("corretly formats an empty string as '--:--'", function () {
        expect(formatTime('')).toBe('--:--');
    });

    it("corretly parses only seconds", function () {
        expect(formatTime('22')).toBe('00:22');
    });

    it("corretly parses only minutes", function () {
        expect(formatTime('60')).toBe('1:00');
    });

    it("corretly parses single-digit minute with seconds", function () {
        expect(formatTime('83')).toBe('1:23');
    });

    it("corretly parses two-digit minute with seconds", function () {
        expect(formatTime('723')).toBe('12:03');
    });

    it("corretly parses hours with two-digits minutes and seconds", function () {
        expect(formatTime('7923')).toBe('2:12:03');
    });

    it("corretly parses hours with single-digits minutes and seconds", function () {
        expect(formatTime('7323')).toBe('2:02:03');
    });
});
