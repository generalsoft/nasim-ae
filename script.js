
let pageFlip = null;

// 📚 Load library
fetch("library.json")
  .then(res => res.json())
  .then(books => {
    const container = document.getElementById("library");

    books.forEach(book => {
      const div = document.createElement("div");
      div.className = "book";

      const padLength = String(book.pages).length;
      const firstPage = String(1).padStart(padLength, "0");
      const cover = book.cover || `${book.folder}/page-${firstPage}.jpg`;

      div.innerHTML = `
        <img src="${cover}" alt="">
        <div class="title">${book.title}</div>
      `;

      div.onclick = () => openBook(book);
      container.appendChild(div);
    });
  });


// 📖 Open book
function openBook(book) {
  const container = document.getElementById("viewerContainer");

  // Replace the viewer div with a fresh one — never call destroy()
  // because destroy() removes #viewer from the DOM entirely
  const oldViewer = document.getElementById("viewer");
  const newViewer = document.createElement("div");
  newViewer.id = "viewer";
  oldViewer.replaceWith(newViewer);

  pageFlip = new St.PageFlip(newViewer, {
    width: 400,
    height: 600,
    size: "stretch",
    showCover: true,
    mobileScrollSupport: true
  });

  const pages = [];
  const padLength = String(book.pages).length;

  for (let i = 1; i <= book.pages; i++) {
    const pageNum = String(i).padStart(padLength, "0");
    pages.push(`${book.folder}/page-${pageNum}.jpg`);
  }

  pageFlip.loadFromImages(pages);

  container.style.display = "flex";
  container.style.pointerEvents = "auto";
}

// ❌ Close viewer — just hide, never destroy
function closeBook() {
  const container = document.getElementById("viewerContainer");
  container.style.display = "none";
  container.style.pointerEvents = "none";
}