import { it, expect, describe } from 'vitest';
import { jsonMapReplacer, jsonMapReviver } from '../src/utils'; // Update this import path

describe('jsonMapReplacer', () => {
    it('should replace a Map with an object containing dataType "Map" and entries', () => {
        // Create a sample Map
        const sampleMap = new Map([
            ['key1', 'value1'],
            ['key2', 'value2'],
        ]);
        // Call the jsonMapReplacer method with the sample Map
        const result = JSON.stringify(sampleMap, jsonMapReplacer);
        // Parse the result to get the object
        const parsedResult = JSON.parse(result);
        // Assert the parsed object
        expect(parsedResult.dataType).toBe('Map');
        expect(parsedResult.value).toEqual(Array.from(sampleMap.entries()));
    });

    it('should not modify non-Map values', () => {
        const nonMapValue = { key: 'value' };
        // Call the jsonMapReplacer method with a non-Map value
        const result = JSON.stringify(nonMapValue, jsonMapReplacer);
        // Parse the result to get the object
        const parsedResult = JSON.parse(result);
        // Assert that the parsed object is the same as the input
        expect(parsedResult).toEqual(nonMapValue);
    });
});

describe('jsonMapReviver', () => {
    it('should revive an object with dataType "Map" back to a Map', () => {
        // Create an object with dataType "Map" and entries
        const sampleMapObject = {
            dataType: 'Map',
            value: [['key1', 'value1'], ['key2', 'value2']],
        };
        // Call the jsonMapReviver method with the sample object
        const result = JSON.parse(JSON.stringify(sampleMapObject), jsonMapReviver);
        // Assert the revived object is an instance of Map
        expect(result instanceof Map).toBe(true);
        // Assert the Map entries
        expect(Array.from(result.entries())).toEqual(sampleMapObject.value);
    });

    it('should not modify objects without dataType "Map"', () => {
        const nonMapObject = { key: 'value' };
        // Call the jsonMapReviver method with a non-Map object
        const result = JSON.parse(JSON.stringify(nonMapObject), jsonMapReviver);
        // Assert that the revived object is the same as the input
        expect(result).toEqual(nonMapObject);
    });
});
