import { describe, it, expect } from 'vitest';
import data from '../../data/properties.json';

describe('Data Integrity Tests', () => {
    it('1. should load properties data correctly', () => {
        expect(data).toBeDefined();
        expect(data.properties).toBeDefined();
        expect(Array.isArray(data.properties)).toBe(true);
    });

    it('2. should have exactly 7 properties as required', () => {
        expect(data.properties.length).toBe(7);
    });

    it('3. should have unique IDs for all properties', () => {
        const ids = data.properties.map(p => p.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
    });

    it('4. should ensure all properties have valid price and type', () => {
        data.properties.forEach(property => {
            expect(property.price).toBeGreaterThan(0);
            expect(typeof property.price).toBe('number');
            expect(['house', 'flat', 'apartment']).toContain(property.type.toLowerCase());
        });
    });

    it('5. should ensure all properties have location and image preview', () => {
        data.properties.forEach(property => {
            expect(property.location).toBeDefined();
            expect(property.location.length).toBeGreaterThan(0);

            const img = property.previewPicture || property.picture;
            expect(img).toBeDefined();
            expect(typeof img).toBe('string');
        });
    });
});
