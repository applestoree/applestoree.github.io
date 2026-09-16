const { createElement } = React;

function App() {
  return createElement(
    "main",
    null,
    createElement("h1", null, "Hello React"),
    createElement("p", null, "React berjalan di GitHub Pages.")
  );
}

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(createElement(App));
