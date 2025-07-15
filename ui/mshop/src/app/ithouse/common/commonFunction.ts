export function blockToCamel(value: string) {

    if (value && (value != null && value != 'null')) {
      try {
        const words = value.split(/_| /g);
        const camelCaseWords = words.map((word, index) => index < 0 ? word : word.charAt(0) + word.slice(1).toLowerCase());
        const sts = camelCaseWords.join(' ');
        return sts == 'In Active' ? 'Inactive' : sts;;
      } catch (error) {
        console.log('can not convert: ', value);
        return value;
      }
    } else {
      return '';
    }

  }
