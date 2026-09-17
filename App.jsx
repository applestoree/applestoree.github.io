function Header() {
  return (
    <header>
      <h1>Apple Store Malaysia</h1>
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
