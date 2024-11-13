import {describe, it, expect, vi, Mock} from 'vitest';
import { Event } from '../../../src/Core/EventSystem/Event';

describe('Event', () => {

    /**
     * Tests if an observer can be successfully added to the Event instance.
     * After adding, when the event is emitted, the observer should be called
     * with the emitted data.
     */
    it('should add an observer', (): void => {
        const event: Event<string> = new Event<string>();
        const observer: Mock = vi.fn(); // Create a mock function to act as an observer

        event.addObserver(observer);
        event.emit('test');

        expect(observer).toHaveBeenCalledWith('test');
    });

    /**
     * Tests if an observer can be removed from the Event instance.
     * After removal, the observer should not be called when the event is emitted.
     */
    it('should remove an observer', (): void => {
        const event: Event<string> = new Event<string>();
        const observer: Mock = vi.fn(); // Create a mock function to act as an observer

        event.addObserver(observer);
        event.removeObserver(observer);
        event.emit('test');

        expect(observer).not.toHaveBeenCalled();
    });

    /**
     * Tests if all added observers are notified when an event is emitted.
     * After adding two observers, emitting an event should call both with the emitted data.
     */
    it('should call all observers when emitting', (): void => {
        const event: Event<string> = new Event<string>();
        const observer1: Mock = vi.fn(); // Create a mock function to act as an observer
        const observer2: Mock = vi.fn(); // Create a mock function to act as an observer

        event.addObserver(observer1);
        event.addObserver(observer2);
        event.emit('test');

        expect(observer1).toHaveBeenCalledWith('test');
        expect(observer2).toHaveBeenCalledWith('test');
    });

    /**
     * Tests if multiple emits are handled correctly. After emitting multiple
     * events with different data, the observer should receive each event call with the correct data.
     */
    it('should handle multiple emits', (): void => {
        const event: Event<string> = new Event<string>();
        const observer: Mock = vi.fn(); // Create a mock function to act as an observer

        event.addObserver(observer);
        event.emit('test1');
        event.emit('test2');

        expect(observer).toHaveBeenCalledWith('test1');
        expect(observer).toHaveBeenCalledWith('test2');
    });

    /**
     * Tests if removing a non-existent observer does not cause errors or affect existing observers.
     * After attempting to remove a non-existent observer, existing observers should still be notified when emitting.
     */
    it('should not fail if removing a non-existent observer', (): void => {
        const event: Event<string> = new Event<string>();
        const observer: Mock = vi.fn(); // Create a mock function to act as an observer
        const nonExistentObserver: Mock = vi.fn(); // Create a mock function to act as an observer

        event.addObserver(observer);
        event.removeObserver(nonExistentObserver);
        event.emit('test');

        expect(observer).toHaveBeenCalledWith('test');
    });
});
