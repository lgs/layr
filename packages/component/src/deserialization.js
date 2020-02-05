import {deserialize as simpleDeserialize} from 'simple-serialization';
import {possiblyAsync} from 'possibly-async';
import ow from 'ow';

import {createComponentMap, getComponentFromComponentMap} from './utilities';

export function deserialize(value, options) {
  ow(options, 'options', ow.optional.object.partialShape({knownComponents: ow.optional.array}));

  const knownComponentMap = createComponentMap(options?.knownComponents);

  const objectHandler = function(value) {
    const {__Component, __component, __new, ...attributes} = value;

    let componentName;
    let isComponentClass;

    if (__Component !== undefined) {
      // The value is a serialized component class
      componentName = __Component;
      isComponentClass = true;
    } else if (__component !== undefined) {
      componentName = __component;
      isComponentClass = false;
    }

    if (!componentName) {
      return undefined;
    }

    const Component = getComponentFromComponentMap(knownComponentMap, componentName);

    let deserializedComponent;

    if (isComponentClass) {
      deserializedComponent = Component;
    } else {
      deserializedComponent = __new === true ? new Component() : Component.instantiate();
    }

    return possiblyAsync.forEach(
      Object.entries(attributes),
      ([key, value]) =>
        possiblyAsync(simpleDeserialize(value, options), {
          then: deserializedValue => {
            deserializedComponent[key] = deserializedValue;
          }
        }),
      {then: () => deserializedComponent}
    );
  };

  options = {...options, objectHandler};

  return simpleDeserialize(value, options);
}
