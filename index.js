const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true
  });
    
  const page = await browser.newPage();

  await page.setViewport({
    width: 1280,
    height: 1080,
    deviceScaleFactor: 1,
  });

  await page.goto('https://www.canadacomputers.com/index.php?cPath=43_557&sf=:3_8&mfr=&pr=')

  const checkStore = async () => {
    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] })
    const products = await page.evaluate(() => {
      const productNodeList = document.querySelectorAll('#product-list .toggleBox')
      const productList = [...productNodeList]
      return productList.map(product => {
        return {
          name: product.querySelector('.text-truncate_3').innerText,
          price: product.querySelector('.pq-hdr-product_price').innerText,
          stock: {
            online: product.querySelectorAll('.stock-popup .line-height')[0].innerText.trim(),
            instore: product.querySelectorAll('.stock-popup .line-height')[1].innerText.trim()
          }
        }
      })
    })
    console.table(products)
  }
  
  setInterval(checkStore, 10000);
})();