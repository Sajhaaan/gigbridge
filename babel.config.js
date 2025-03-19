module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': '.',
            '@components': './app/components',
            '@screens': './app/screens',
            '@navigation': './app/navigation',
            '@assets': './assets',
            '@utils': './app/utils',
            '@hooks': './app/hooks',
            '@types': './app/types',
            '@constants': './app/constants',
            '@services': './app/services',
            '@providers': './app/providers'
          },
        },
      ],
      'react-native-reanimated/plugin',
    ]
  };
}; 