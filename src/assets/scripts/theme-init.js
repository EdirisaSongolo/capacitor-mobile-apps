(() => {
  const storedTheme = localStorage.getItem('ThemePreference');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  let theme = 'light';
  if (systemDark) theme = 'dark';
  if (storedTheme === 'DARK') theme = 'dark';
  if (storedTheme === 'LIGHT') theme = 'light';

  document.documentElement.dataset.theme = theme;
})();
