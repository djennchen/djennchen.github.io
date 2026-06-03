const headerMenu = [
  { href: '/', text: 'Welcome' },
  { href: '/contact/', text: 'About Me' },
  {
    href: '/trips/',
    text: 'Trips',
    submenu: [
      { href: '/trips/glacier/', text: 'Glacier' },
      { href: '/trips/italy/', text: 'Italy' },
      { href: '/trips/zion/', text: 'Zion' },
      { href: '/trips/patagonia/', text: 'Patagonia: W Trek' },
    ],
  },
];

const normalizePath = (href) => {
  const normalized = href.replace(/\/+$|^\s+|\s+$/g, '');
  return normalized === '' ? '/' : normalized;
};

const currentPath = normalizePath(window.location.pathname);

const isActive = (href) => {
  const target = normalizePath(href);
  if (target === '/') {
    return currentPath === '/';
  }
  return currentPath === target || currentPath.startsWith(`${target}/`);
};

const headerHtml = `
  <h1 id="logo"><a href="/">Travel by Spreadsheets</a></h1>
  <nav id="nav">
    <ul>
      ${headerMenu
        .map((item) => {
          if (item.submenu) {
            const classes = ['submenu'];
            if (isActive(item.href)) {
              classes.push('current');
            }
            return `
          <li class="${classes.join(' ')}">
            <a href="${item.href}">${item.text}</a>
            <ul>
              ${item.submenu
                .map(
                  (subitem) =>
                    `<li${isActive(subitem.href) ? ' class="current"' : ''}><a href="${subitem.href}">${subitem.text}</a></li>`,
                )
                .join('')}
            </ul>
          </li>`;
          }

          return `<li${isActive(item.href) ? ' class="current"' : ''}><a href="${item.href}">${item.text}</a></li>`;
        })
        .join('')}
    </ul>
  </nav>
`;

const renderHeader = () => {
  const header = document.querySelector('#header');
  if (header) {
    header.innerHTML = headerHtml;

    // Initialize dropotron for the injected menu if available and not already done
    try {
      if (window.jQuery && jQuery.fn && jQuery.fn.dropotron) {
        const $nav = jQuery('#nav > ul');
        if (!$nav.data('dropotron-initialized')) {
          $nav.dropotron({
            mode: 'fade',
            noOpenerFade: true,
            expandMode: (window.browser && browser.mobile ? 'click' : 'hover')
          });
          $nav.data('dropotron-initialized', true);
        }
      }
    } catch (e) {
      console.error('dropotron init failed:', e);
    }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderHeader);
} else {
  renderHeader();
}
