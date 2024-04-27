import puppeteer from 'puppeteer';

const testPostingStudent = async (url, student) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      devtools: true,
    });
    const page = await browser.newPage();
    await page.goto(url + '/ui');

    await page.click('a[href="/ui/post"]');
    await page.waitForSelector('input[name="student_name"]');
    await page.type('input[name="student_name"]', student.student_name);
    await page.type('input[name="birthdate"]', '12031997'); // note finnish browser date format
    const inputUploadHandle = await page.$('input[type=file]');
    await inputUploadHandle?.uploadFile('test/' + student.filename);
    await page.click('button[type="submit"]');
    await page.waitForSelector('dialog');
    const dialogMessage = await page.$eval(
      'dialog #message',
      (el) => el.textContent
    );
    if (!dialogMessage) {
      throw new Error('No dialog message');
    }
    expect(dialogMessage).toBe('Student created successfully');
    await page.keyboard.press('Escape');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

export {testPostingStudent};
