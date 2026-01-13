function salvarProduto() {
  const loja = document.getElementById('loja').value;
  const nome = document.getElementById('nome').value;
  const link = document.getElementById('link').value;

  if (!nome || !link) {
    alert('Preencha todos os campos');
    return;
  }

  const produtos = JSON.parse(localStorage.getItem(loja)) || [];
  produtos.push({ nome, link });
  localStorage.setItem(loja, JSON.stringify(produtos));

  alert('Produto salvo com sucesso!');
  document.getElementById('nome').value = '';
  document.getElementById('link').value = '';
}

function carregarProdutos(loja, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const produtos = JSON.parse(localStorage.getItem(loja)) || [];

  produtos.forEach(p => {
    const div = document.createElement('div');
    div.className = 'produto';
    div.innerHTML = `
      <h3>${p.nome}</h3>
      <a href="${p.link}" target="_blank" class="btn ${loja}">
        Comprar
      </a>
    `;
    container.appendChild(div);
  });
}

carregarProdutos('shopee', 'lista-shopee');
carregarProdutos('mercado', 'lista-mercado');
