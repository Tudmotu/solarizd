import {module, inject} from '../mocks';

describe('solPeer service', function () {
    let solPeer;

    beforeEach(module($provide => {
        $provide.service('peerJS', () => {
            this.getPeer = createSpy('getPeer').and.returnValue($q(resolve => {
                resolve({
                    //call: createSpy('call'),
                    //disconnect: createSpy('disconnect'),
                    //reconnect: createSpy('reconnect'),
                    //destroy: createSpy('destroy'),
                    connect: createSpy('connect'),
                    on: createSpy('on')
                });
            }));
        });
    }));
    beforeEach(module('sol-peerjs'));
    beforeEach(inject((_solPeer_) => {
        solPeer = _solPeer_;
    }));

    describe('server behavior', () => {
        beforeEach();
    });

    describe('interface', () => {
        it('should have a connectToServer method', () => {
            expect(solPeer).toHaveMethod('connectToServer');
        });

        it('should have a createServer method', () => {
            expect(solPeer).toHaveMethod('createServer');
        });
    });
});
