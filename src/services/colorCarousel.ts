const colorCarousel = (colorId: number): string => {
  const defaultColors = [
    '#1F77B3',
    '#FF7E0E',
    '#2BA02B',
    '#9367BC',
    '#8C564B',
    '#E277C1',
    '#BCBC21',
    '#16BDCF',
    '#3A0182',
    '#AC8944',
    '#FF6E75',
    '#798CFF',
    '#FFBF60',
    '#1CD646',
    '#FF018C',
    '#018267',
    '#8EAECD',
    '#1C5BFF',
  ];
  return defaultColors[colorId % defaultColors.length];
};

export { colorCarousel };
