import colorExtensionTemplate from './templates/color-extension';
import customColorTemplate from './templates/custom-color';
import colorTemplate from './templates/color';
import linearGradientTemplate from './templates/linear-gradient';
import radialGradientTemplate from './templates/radial-gradient';
import fontExtensionTemplate from './templates/font-extension';

export function cgColorString(color, project, extensionOptions) {
  const styleguideColor = project.findColorEqual(color);
  const cgColorPostfix = '.cgColor';
  if (extensionOptions.useColorNames && styleguideColor) {
    return `UIColor.${styleguideColor.name}${cgColorPostfix}`;
  }
  if (extensionOptions.useCustomColorInitializer) {
    return customColorTemplate(color) + cgColorPostfix;
  }
  return colorTemplate(color) + cgColorPostfix;
}

const colorStopsString = (colorStops, project, extensionOptions) =>
  colorStops
    .map(colorStop => cgColorString(colorStop.color, project, extensionOptions))
    .join(', ');

export function generateColorExtension(colors, extensionOptions) {
  return {
    code: colorExtensionTemplate(colors, extensionOptions),
    language: 'swift',
    filename: 'UIColor+AppColors.swift',
  };
}

export function generateFontExtension(textStyles) {
  const uniqueFonts = Array.from(
    new Set(textStyles.map(style => style.fontFace))
  ).sort();

  return {
    code: fontExtensionTemplate(uniqueFonts),
    language: 'swift',
    filename: 'UIFont+AppFonts.swift',
  };
}

export function options(context) {
  return {
    useColorNames: context.getOption('use_color_names'),
    useCustomColorInitializer: context.getOption(
      'use_custom_color_initializer'
    ),
  };
}

export function linearGradientLayer(gradient, project, extensionOptions) {
  const { colorStops } = gradient;
  const colorStopsPositionString = colorStops
    .map((colorStop, index) => `${index}`)
    .join(', ');

  return linearGradientTemplate(
    gradient,
    colorStopsString(colorStops, project, extensionOptions),
    colorStopsPositionString
  );
}

export function radialGradientLayer(gradient, project, extensionOptions) {
  const { colorStops } = gradient;
  return radialGradientTemplate(
    colorStopsString(colorStops, project, extensionOptions)
  );
}

export default {
  generateColorExtension,
  cgColorString,
  generateFontExtension,
  options,
  linearGradientLayer,
  radialGradientLayer,
};
