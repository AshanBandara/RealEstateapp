import { describe, it, expect } from 'vitest';
import data from '../../data/properties.json';

describe('Debug Data Load', () => {
    it('loads properties correctly', () => {
        console.log('Properties length:', data?.properties?.length);
        console.log('First property:', JSON.stringify(data?.properties?.[0]));
        expect(data).toBeDefined();
        expect(data.properties).toBeDefined();
        expect(data.properties.length).toBeGreaterThan(0);
    });
});
