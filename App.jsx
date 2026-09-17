function CartButton() {
  return (
    <button type="button" aria-label="Cart">
      Cart
    </button>
  );
}

function Header() {
  return (
    <header>
      <div>
        <h1>Apple Store Malaysia</h1>
        <p>Apple The Exchange TRX</p>
      </div>
      <CartButton />
    </header>
  );
}

function Content() {
  return (
    <main>
      <p>Welcome</p>
    </main>
  );
}

function BottomNav() {
  return (
    <nav>
      <span>Home</span>
      <span>Product</span>
      <span>Profile</span>
    </nav>
  );
}

function App() {
  return (
    <>
      <Header />
      <Content />
      <BottomNav />
    </>
  );
}
