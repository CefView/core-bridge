import { describe, expect, test } from '@jest/globals';

import CefViewBridge from '../dist/index';

describe('CefViewBridge', () => {
    let originalWindow: any;
    let mockBridge: any;

    beforeEach(() => {
        originalWindow = global.window;
        mockBridge = {
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            invoke: jest.fn(),
        };
        (global as any).window = {
            CefViewQuery: jest.fn().mockReturnValue(42),
            CefViewCancelQuery: jest.fn(),
            myBridge: mockBridge,
        };
    });

    afterEach(() => {
        global.window = originalWindow;
        jest.clearAllMocks();
    });

    it('should construct with valid bridge', () => {
        expect(() => new CefViewBridge('myBridge')).not.toThrow();
    });

    it('should throw if window is missing', () => {
        (global as any).window = undefined;
        expect(() => new CefViewBridge('myBridge')).toThrow(/window is not defined/);
    });

    it('should throw if bridge is missing', () => {
        delete (global as any).window.myBridge;
        expect(() => new CefViewBridge('myBridge')).toThrow(/was not found/);
    });

    it('should throw if bridge is not object', () => {
        (global as any).window.myBridge = 123;
        expect(() => new CefViewBridge('myBridge')).toThrow(/is not an object/);
    });

    it('should throw if addEventListener is missing', () => {
        delete mockBridge.addEventListener;
        expect(() => new CefViewBridge('myBridge')).toThrow(/addEventListener was missing/);
    });

    it('should throw if removeEventListener is missing', () => {
        mockBridge.addEventListener = jest.fn();
        delete mockBridge.removeEventListener;
        expect(() => new CefViewBridge('myBridge')).toThrow(/removeEventListener was missing/);
    });

    it('should throw if invoke is missing', () => {
        mockBridge.removeEventListener = jest.fn();
        delete mockBridge.invoke;
        expect(() => new CefViewBridge('myBridge')).toThrow(/invoke was missing/);
    });

    it('should throw if CefViewQuery is missing', () => {
        mockBridge.invoke = jest.fn();
        delete (global as any).window.CefViewQuery;
        expect(() => new CefViewBridge('myBridge')).toThrow(/CefViewQuery was missing/);
    });

    it('should throw if CefViewCancelQuery is missing', () => {
        (global as any).window.CefViewQuery = jest.fn();
        delete (global as any).window.CefViewCancelQuery;
        expect(() => new CefViewBridge('myBridge')).toThrow(/CefViewCancelQuery was missing/);
    });

    it('should call addEventListener', () => {
        const bridge = new CefViewBridge('myBridge');
        const handler = jest.fn();
        bridge.addEventListener('evt', handler);
        expect(mockBridge.addEventListener).toHaveBeenCalledWith('evt', handler);
    });

    it('should call removeEventListener', () => {
        const bridge = new CefViewBridge('myBridge');
        const handler = jest.fn();
        bridge.removeEventListener('evt', handler);
        expect(mockBridge.removeEventListener).toHaveBeenCalledWith('evt', handler);
    });

    it('should call invoke', () => {
        const bridge = new CefViewBridge('myBridge');
        bridge.invoke('method', 1, 2, 3);
        expect(mockBridge.invoke).toHaveBeenCalledWith('method', 1, 2, 3);
    });

    it('should call query and return id', () => {
        const bridge = new CefViewBridge('myBridge');
        const onSuccess = jest.fn();
        const onFailure = jest.fn();
        const req = { foo: 'bar' };
        const id = bridge.query(req, onSuccess, onFailure);
        expect(window.CefViewQuery).toHaveBeenCalledWith({
            request: JSON.stringify(req),
            onSuccess,
            onFailure,
        });
        expect(id).toBe(42);
    });

    it('should call cancelQuery', () => {
        const bridge = new CefViewBridge('myBridge');
        bridge.cancelQuery(99);
        expect(window.CefViewCancelQuery).toHaveBeenCalledWith(99);
    });
});
