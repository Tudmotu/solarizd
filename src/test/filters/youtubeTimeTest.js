import Application from '../../js/Application';
import {module, inject} from '../mocks';

describe("youtubeTime filter", function () {
    var $filter;
    var youtubeTime;

    beforeEach(module('filters'));
    beforeEach(inject(function(_$filter_){
        $filter = _$filter_;
        youtubeTime = $filter('youtubeTime');
    }));

    it("corretly parses PT1M", function () {
        expect(youtubeTime('PT1M')).toBe('1:00');
    });

    it("corretly parses PT1M23S", function () {
        expect(youtubeTime('PT1M23S')).toBe('1:23');
    });

    it("corretly parses PT12M3S", function () {
        expect(youtubeTime('PT12M3S')).toBe('12:03');
    });

    it("corretly parses PT2H12M3S", function () {
        expect(youtubeTime('PT2H12M3S')).toBe('2:12:03');
    });

    it("corretly parses PT2H2M3S", function () {
        expect(youtubeTime('PT2H2M3S')).toBe('2:02:03');
    });
});
