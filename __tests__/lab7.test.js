describe('Basic user flow for Website', () => {
  // First, visit the lab 7 website
  beforeAll(async () => {
    await page.goto('https://cse110-sp25.github.io/CSE110-Shop/', {
      waitUntil: 'domcontentloaded',
    });

    // Start with a clean cart so old localStorage does not affect the tests
    await page.evaluate(() => {
      localStorage.clear();
    });

    await page.reload({ waitUntil: 'domcontentloaded' });

    // Wait until all products are loaded onto the page
    await page.waitForFunction(() => {
      return document.querySelectorAll('product-item').length === 20;
    });
  });

  // Each it() call is a separate test
  // Here, we check to make sure that all 20 <product-item> elements have loaded
  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');

    // Query select all of the <product-item> elements and return the length of that array
    const numProducts = await page.$$eval('product-item', prodItems => {
      return prodItems.length;
    });

    // Expect that array from earlier to be length 20, meaning 20 <product-item> elements were found
    expect(numProducts).toBe(20);
  });

  // STEP 1: Check to make sure that all 20 <product-item> elements have data in them
  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');

    // Start as true, if any product does not have data, swap to false
    let allArePopulated = true;

    // Query select all of the <product-item> elements
    const prodItemsData = await page.$$eval('product-item', prodItems => {
      return prodItems.map(item => {
        // Grab all of the JSON data stored inside
        return item.data;
      });
    });

    // Check every product item instead of only the first one
    for (let i = 0; i < prodItemsData.length; i++) {
      console.log(`Checking product item ${i + 1}/${prodItemsData.length}`);

      const product = prodItemsData[i];

      // Make sure the title, price, and image are populated in the JSON
      if (!product.title || product.title.length === 0) {
        allArePopulated = false;
      }

      if (!product.price || Number(product.price) <= 0) {
        allArePopulated = false;
      }

      if (!product.image || product.image.length === 0) {
        allArePopulated = false;
      }
    }

    // Expect allArePopulated to still be true
    expect(allArePopulated).toBe(true);
  }, 10000);

  // STEP 2: Check that clicking "Add to Cart" changes the button text
  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');

    const productItem = await page.$('product-item');
    const shadowRoot = await productItem.getProperty('shadowRoot');
    const button = await shadowRoot.$('button');

    await button.click();

    const innerText = await button.getProperty('innerText');
    const buttonText = await innerText.jsonValue();

    expect(buttonText.trim()).toBe('Remove from Cart');

    // Reset the first product so the next test starts with an empty cart
    await button.click();
  }, 5000);

  // STEP 3: Add every product to the cart and check that the cart count is 20
  it('Checking number of items in cart on screen', async () => {
    console.log('Checking number of items in cart on screen...');

    const numProducts = await page.$$eval('product-item', prodItems => {
      prodItems.forEach(item => {
        const button = item.shadowRoot.querySelector('button');
        button.click();
      });

      return prodItems.length;
    });

    expect(numProducts).toBe(20);

    const cartCount = await page.$eval('#cart-count', cart => {
      return cart.innerText.trim();
    });

    expect(cartCount).toBe('20');
  }, 10000);

  // STEP 4: Reload the page and check that all products are still in the cart
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    await page.reload({ waitUntil: 'domcontentloaded' });

  
    const buttonTexts = await page.$$eval('product-item', prodItems => {
      return prodItems.map(item => {
        return item.shadowRoot.querySelector('button').innerText.trim();
      });
    });

    for (let i = 0; i < buttonTexts.length; i++) {
      expect(buttonTexts[i]).toBe('Remove from Cart');
    }

    const cartCount = await page.$eval('#cart-count', cart => {
      return cart.innerText.trim();
    });

    expect(cartCount).toBe('20');
  }, 20000);

  // STEP 5: Check to make sure that the cart in localStorage is what we expect
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');

    const cart = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });

    expect(cart).toBe('[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]');
  });

  // STEP 6: Remove every product from the cart and check that the cart count is 0
  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Checking number of items in cart on screen after removing from cart...');

    const numProducts = await page.$$eval('product-item', prodItems => {
      prodItems.forEach(item => {
        const button = item.shadowRoot.querySelector('button');
        button.click();
      });

      return prodItems.length;
    });

    expect(numProducts).toBe(20);

    
    const cartCount = await page.$eval('#cart-count', cart => {
      return cart.innerText.trim();
    });

    expect(cartCount).toBe('0');
  }, 10000);

  // STEP 7: Reload the page and check that the cart is still empty
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    await page.reload({ waitUntil: 'domcontentloaded' });


    const buttonTexts = await page.$$eval('product-item', prodItems => {
      return prodItems.map(item => {
        return item.shadowRoot.querySelector('button').innerText.trim();
      });
    });

    for (let i = 0; i < buttonTexts.length; i++) {
      expect(buttonTexts[i]).toBe('Add to Cart');
    }

    const cartCount = await page.$eval('#cart-count', cart => {
      return cart.innerText.trim();
    });

    expect(cartCount).toBe('0');
  }, 20000);

  // STEP 8: Check to make sure localStorage has an empty cart
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');

    const cart = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });

    expect(cart).toBe('[]');
  });
});