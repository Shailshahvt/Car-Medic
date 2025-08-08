// src/theme.js
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#fff9e6',
      100: '#ffebb3',
      200: '#ffdf80',
      300: '#ffd24d',
      400: '#ffc61a',
      500: '#F2B740', // Primary brand color - yellowish-orange
      600: '#cc9900',
      700: '#997300',
      800: '#664d00',
      900: '#332600',
    },
    darkBg: '#1A1A1A', // Dark background color like your logo background
  },
  components: {
    Button: {
      variants: {
        brand: {
          bg: 'brand.500',
          color: 'black',
          _hover: {
            bg: 'brand.600',
          },
        },
      },
    },
    Input: {
      variants: {
        auth: {
          field: {
            borderColor: 'brand.500',
            _focus: {
              borderColor: 'brand.600',
              boxShadow: '0 0 0 1px var(--chakra-colors-brand-600)',
            },
          },
        },
      },
    },
  },
});

export default theme;