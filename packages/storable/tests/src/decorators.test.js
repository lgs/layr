import {Storable, attribute, loader, isStorableAttribute} from '../../..';

describe('Decorators', () => {
  test('@attribute()', async () => {
    const beforeLoadHook = function() {};
    const beforeSaveHook = function() {};

    class Movie extends Storable {
      @attribute('number', {beforeLoad: beforeLoadHook}) static limit = 100;

      @attribute('string', {beforeSave: beforeSaveHook}) title = '';
    }

    const limitAttribute = Movie.getAttribute('limit');

    expect(isStorableAttribute(limitAttribute)).toBe(true);
    expect(limitAttribute.getName()).toBe('limit');
    expect(limitAttribute.getParent()).toBe(Movie);
    expect(limitAttribute.getHook('beforeLoad')).toBe(beforeLoadHook);
    expect(limitAttribute.hasHook('beforeLoad')).toBe(true);
    expect(limitAttribute.hasHook('beforeSave')).toBe(false);

    const titleAttribute = Movie.prototype.getAttribute('title');

    expect(isStorableAttribute(titleAttribute)).toBe(true);
    expect(titleAttribute.getName()).toBe('title');
    expect(titleAttribute.getParent()).toBe(Movie.prototype);
    expect(titleAttribute.getHook('beforeSave')).toBe(beforeSaveHook);
    expect(titleAttribute.hasHook('beforeSave')).toBe(true);
    expect(titleAttribute.hasHook('beforeLoad')).toBe(false);
  });

  test('@loader()', async () => {
    const limitLoader = function() {};
    const titleLoader = function() {};

    class Movie extends Storable {
      @loader(limitLoader) @attribute('number?') static limit;

      @loader(titleLoader) @attribute('string') title = '';
    }

    const limitAttribute = Movie.getAttribute('limit');

    expect(isStorableAttribute(limitAttribute)).toBe(true);
    expect(limitAttribute.getName()).toBe('limit');
    expect(limitAttribute.getParent()).toBe(Movie);
    expect(limitAttribute.getLoader()).toBe(limitLoader);
    expect(limitAttribute.hasLoader()).toBe(true);

    const titleAttribute = Movie.prototype.getAttribute('title');

    expect(isStorableAttribute(titleAttribute)).toBe(true);
    expect(titleAttribute.getName()).toBe('title');
    expect(titleAttribute.getParent()).toBe(Movie.prototype);
    expect(titleAttribute.getLoader()).toBe(titleLoader);
    expect(titleAttribute.hasLoader()).toBe(true);
  });
});
