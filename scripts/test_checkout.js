(async () => {
  try {
    const base = 'http://localhost:3000';
    console.log('Logging in...');
    const loginRes = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'owner@brewops.com', password: 'password123' })
    });
    const ct = loginRes.headers.get('content-type') || '';
    let loginData = null;
    if (ct.includes('application/json')) {
      loginData = await loginRes.json();
    } else {
      const text = await loginRes.text();
      console.error('Login returned non-json response. Status:', loginRes.status);
      console.error(text.substring(0, 200));
      process.exit(1);
    }
    if (!loginRes.ok) {
      console.error('Login failed:', loginData);
      process.exit(1);
    }
    console.log('Login success:', loginData.user?.email);

    // Extract cookie from set-cookie header
    const setCookie = loginRes.headers.get('set-cookie') || loginRes.headers.get('Set-Cookie');
    const cookie = setCookie ? setCookie.split(';')[0] : null;
    if (!cookie) {
      console.warn('No cookie received from login. Continuing without cookie.');
    } else {
      console.log('Session cookie:', cookie);
    }

    // Prepare a simple cart item using mock-products from /api/pos/products
    const prodRes = await fetch(`${base}/api/pos/products`, { headers: cookie ? { cookie } : {} });
    const products = await prodRes.json();
    const first = (products && products.length) ? products[0] : null;
    if (!first) {
      console.error('No products available to create order.');
      process.exit(1);
    }

    const payload = {
      customerId: null,
      cartItems: [{ id: first.id, price: first.price, quantity: 1, totalPrice: first.price, selectedModifiers: [], name: first.name, category: first.category }],
      discountAmount: 0,
      paymentMethod: 'CASH',
      payments: null,
      tableNumber: '1',
      source: 'POS'
    };

    console.log('Submitting order...');
    const orderRes = await fetch(`${base}/api/pos/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(cookie ? { cookie } : {}) },
      body: JSON.stringify(payload)
    });
    const orderData = await orderRes.json();
    if (!orderRes.ok) {
      console.error('Order failed:', orderData);
      process.exit(1);
    }
    console.log('Order placed. ID:', orderData.order?.id || orderData.order?.orderNumber);

    // Fetch recent orders
    const ordersRes = await fetch(`${base}/api/pos/orders`, { headers: cookie ? { cookie } : {} });
    const orders = await ordersRes.json();
    console.log('Recent orders count:', Array.isArray(orders) ? orders.length : 'N/A');

    // Check inventory endpoint
    const invRes = await fetch(`${base}/api/inventory`, { headers: cookie ? { cookie } : {} });
    const inv = await invRes.json();
    console.log('Inventory response keys:', Object.keys(inv || {}));

    process.exit(0);
  } catch (err) {
    console.error('Script error:', err);
    process.exit(1);
  }
})();
