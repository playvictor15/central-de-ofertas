function carregarProdutos(loja, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  const produtos = JSON.parse(localStorage.getItem(loja)) || [];

  if (produtos.length === 0) {
    container.innerHTML = '<p>Nenhuma oferta cadastrada ainda.</p>';
    return;
  }

  produtos.forEach(produto => {
    const card = document.createElement('div');
    card.className = 'produto-card';

    card.innerHTML = `
      ${produto.imagem ? `<img src="${produto.imagem}" alt="${produto.nome}">` : ''}
      <h3>${produto.nome}</h3>
      <a href="${produto.link}" target="_blank" rel="noopener" class="btn ${loja}">
        Comprar agora
      </a>
    `;

    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  carregarProdutos('shopee', 'lista-shopee');
  carregarProdutos('mercado', 'lista-mercado');
});
