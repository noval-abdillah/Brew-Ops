(async () => {
  try {
    const res = await fetch('http://localhost:3000/', { redirect: 'manual' });
    console.log('Status:', res.status);
    const location = res.headers.get('location');
    console.log('Location header:', location);
    const text = await res.text();
    console.log('Body snippet:', text.substring(0, 200));
  } catch (err) {
    console.error(err);
  }
})();
