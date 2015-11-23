import {module, inject} from '../mocks';

describe('solPeer service', function () {
    let solPeer;

    beforeEach(module('sol-peerjs'));
    beforeEach(inject((_solPeer_) => {
        solPeer = _solPeer_;
    }));

    describe('interface', () => {
        it('should have a connectToServer method', () => {
            expect(solPeer).toHaveMethod('connectToServer');
        });

        it('should have a createServer method', () => {
            expect(solPeer).toHaveMethod('createServer');
        });
    });
});
