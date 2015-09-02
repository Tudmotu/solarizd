import {module, inject} from '../mocks';

describe("youtubeTime filter", function () {
    var $filter;
    var youtubeTime;

    beforeEach(module('filters'));
    beforeEach(inject(function(_$filter_){
        $filter = _$filter_;
        youtubeTime = $filter('youtubeTime');
    }));

    it("corretly formats an empty string as '--:--'", function () {
        expect(youtubeTime('')).toBe('--:--');
    });

    it("corretly parses PT22S", function () {
        expect(youtubeTime('PT22S')).toBe('00:22');
    });

    it("corretly parses PT1M", function () {
        expect(youtubeTime('PT1M')).toBe('01:00');
    });

    it("corretly parses PT1M23S", function () {
        expect(youtubeTime('PT1M23S')).toBe('01:23');
    });

    it("corretly parses PT12M3S", function () {
        expect(youtubeTime('PT12M3S')).toBe('12:03');
    });

    it("corretly parses PT2H12M3S", function () {
        expect(youtubeTime('PT2H12M3S')).toBe('02:12:03');
    });

    it("corretly parses PT2H2M3S", function () {
        expect(youtubeTime('PT2H2M3S')).toBe('02:02:03');
    });
});
