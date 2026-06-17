import { describe, it, expect } from 'vitest';
import { BrandProfileInputSchema, PostsCreateSchema } from './validate';

describe('Validation Schemas', () => {
  describe('BrandProfileInputSchema', () => {
    it('should validate a correct brand profile', () => {
      const validData = {
        name: 'Eco Brand',
        website: 'https://ecobrand.com',
        industry: 'Fashion',
      };
      
      const result = BrandProfileInputSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail when neither name nor website is provided', () => {
      const invalidData = {
        industry: 'Fashion',
      };
      
      const result = BrandProfileInputSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name or website is required');
      }
    });

    it('should fail with invalid URLs', () => {
      const invalidData = {
        name: 'Eco Brand',
        website: 'not-a-url',
      };
      
      const result = BrandProfileInputSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('PostsCreateSchema', () => {
    it('should validate a valid post payload', () => {
      const validData = {
        platform: 'Instagram',
        title: 'New Product Launch',
        mediaType: 'image',
      };

      const result = PostsCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail on invalid platform', () => {
      const invalidData = {
        platform: 'MySpace',
        title: 'New Product Launch',
      };

      const result = PostsCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});