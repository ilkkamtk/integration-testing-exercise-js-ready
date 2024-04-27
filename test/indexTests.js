import puppeteer from 'puppeteer';

const testTableStructure = async (url, data) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
    });
    const page = await browser.newPage();
    await page.goto(url + '/ui');

    const headers = await page.$$eval('table tr th', (headers) =>
      headers.map((header) => {
        if (header.textContent) {
          return header.textContent.trim();
        }
        return '';
      })
    );
    expect(headers).toEqual(['Student ID', 'Name', 'Birthdate', 'Image']);

    const firstRowData = await page.$$eval('table tr:nth-child(2) td', (tds) =>
      tds.map((td) => {
        if (td.textContent) {
          return td.textContent.trim();
        }
        return '';
      })
    );
    expect(firstRowData[0]).toBe(data[0].student_id.toString());
    expect(firstRowData[1]).toBe(data[0].student_name);

    expect(firstRowData[2]).toBe(data[0].birthdate);

    const imgSrc = await page.$eval(
      'table tr:nth-child(2) td:nth-child(4) img',
      (img) => img.getAttribute('src')
    );
    expect(imgSrc).toBe('/uploads/' + data[0].filename);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

export {testTableStructure};
