// create END container for interactive mapping
function createENDContainer() {
  const END_Container = document.getElementById('END_Container');
  END_Container.className = 'END';

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  const headerRow = document.createElement('tr');
  const headers = ['About Montandon', 'Find Out More', 'IFRC GO Helpful links', 'Contact Us'];

  headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const contentRow = document.createElement('tr');
  const aboutGoContent = `
    <td>
      <br />
      Montandon is a Red Cross Red Crescent
      <br />
      platform to make impact information on
      <br />
      emergencies accessible to all.
      <br />
      <br />
    </td>
  `;
  const findOutMoreContent = `
    <td>
      <a href="https://www.ifrc.org">ifrc.org</a>
      <br />
      <a href="https://rcrcsims.org">rcrcsims.org</a>
      <br />
      <a href="https://rcrcsims.org">rcrcsims.org</a>
      <br />
    </td>
  `;
  const helpfulLinksContent = `
    <td>
      <a href="https://github.com/ifrcgo/go-web-app">Open Source Code</a>
      <br />
      <a href="https://goadmin.ifrc.org/docs/">API Documentation</a>
      <br />
      <a href="https://go.ifrc.org/resources">Other Resources</a>
      <br />
    </td>
  `;
  const contactUsContent = '<td><a href="mailto:im@ifrc.org">im@ifrc.org</a></td>';

  contentRow.innerHTML = aboutGoContent + findOutMoreContent + helpfulLinksContent + contactUsContent;
  tbody.appendChild(contentRow);
  table.appendChild(tbody);

  END_Container.appendChild(table);

}

