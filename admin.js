function salvarProduto() {
  const loja = document.getElementById('loja').value;
  const nome = document.getElementById('nome').value.trim();
  const link = document.getElementById('link').value.trim();

  if (!nome || !link) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  const produtos = JSON.parse(localStorage.getItem(loja)) || [];
  produtos.push({ nome, link });
  localStorage.setItem(loja, JSON.stringify(produtos));

  alert('Produto salvo com sucesso.');

  document.getElementById('nome').value = '';
  document.getElementById('link').value = '';
}

function carregarProdutos(loja, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = ''; // LIMPA antes de renderizar

  const produtos = JSON.parse(localStorage.getItem(loja)) || [];

  if (produtos.length === 0) {
    container.innerHTML = '<p>Nenhuma oferta cadastrada ainda.</p>';
    return;
  }

  produtos.forEach(produto => {
    const card = document.createElement('div');
    card.className = 'produto';

    card.innerHTML = `
      <h3>${produto.nome}</h3>
      <a href="${produto.link}" target="_blank" rel="noopener" class="btn ${loja}">
        Comprar agora
      </a>
    `;

    container.appendChild(card);
  });
}

/* Executa automaticamente nas páginas certas */
document.addEventListener('DOMContentLoaded', () => {
  carregarProdutos('shopee', 'lista-shopee');
  carregarProdutos('mercado', 'lista-mercado');
});
