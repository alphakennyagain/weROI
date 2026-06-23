const CASE_STUDIES_SECTION = '#case-studies';

export { CASE_STUDIES_SECTION };

export function scrollToSection(section, { navigate, pathname } = {}) {
  const hash = section.startsWith('#') ? section : `#${section}`;
  const isHome = pathname === '/';

  if (isHome) {
    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  if (navigate) {
    navigate(`/${hash}`);
    return;
  }

  document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
}
