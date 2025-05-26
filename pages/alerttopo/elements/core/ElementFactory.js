import $utils from '@/resources/assets/js/util.js';
import elements from '../view/shape';

const ElementFactory = {
  getElement: (name) => {
    for (let i = 0; i < elements.length; i++) {
      const element = elements.find((d) => d.name === name);
      if (element) {
        return $utils.deepClone(element);
      }
    }
    return null;
  }
};

export { ElementFactory };
