/* ===============================
   SALVAR PRODUTO
================================ */

function salvarProduto() {
  const loja = document.getElementById('loja')?.value;
  const nome = document.getElementById('nome')?.value.trim();
  const imagem = document.getElementById('imagem')?.value.trim();
  const link = document.getElementById('link')?.value.trim();

  if (!nome || !link || !loja) {
    alert('Preencha todos os campos obrigatórios.');
    return;
  }

  const produtos = JSON.parse(localStorage.getItem(loja)) || [];

  produtos.push({
    nome,
    imagem,
    link
  });

  localStorage.setItem(loja, JSON.stringify(produtos));

  alert('Produto salvo com sucesso.');

  // Limpa formulário
  document.getElementById('nome').value = '';
  document.getElementById('imagem').value = '';
  document.getElementById('link').value = '';

  // Atualiza lista do admin
  carregarAdmin();
}

/* ===============================
   CARREGAR PRODUTOS (PÁGINAS PÚBLICAS)
================================ */

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

/* ===============================
   ÁREA ADMIN — LISTAR PRODUTOS
================================ */

function carregarAdmin() {
  const lojaSelect = document.getElementById('loja');
  const lista = document.getElementById('lista-admin');

  if (!lojaSelect || !lista) return;

  const loja = lojaSelect.value;
  lista.innerHTML = '';

  const produtos = JSON.parse(localStorage.getItem(loja)) || [];

  if (produtos.length === 0) {
    lista.innerHTML = '<p style="text-align:center;">Nenhum produto cadastrado.</p>';
    return;
  }

  produtos.forEach((produto, index) => {
    const item = document.createElement('div');
    item.className = 'admin-item';

    item.innerHTML = `
      <span title="${produto.nome}">${produto.nome}</span>
      <button onclick="removerProduto('${loja}', ${index})">
        Remover
      </button>
    `;

    lista.appendChild(item);
  });
}

/* ===============================
   REMOVER PRODUTO
================================ */

function removerProduto(loja, index) {
  const produtos = JSON.parse(localStorage.getItem(loja)) || [];

  produtos.splice(index, 1);
  localStorage.setItem(loja, JSON.stringify(produtos));

  carregarAdmin();
}

/* ===============================
   INIT
================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Páginas públicas
  carregarProdutos('shopee', 'lista-shopee');
  carregarProdutos('mercado', 'lista-mercado');

  // Admin
  const lojaSelect = document.getElementById('loja');
  if (lojaSelect) {
    carregarAdmin();

     const SENHA_ADMIN = '15052007'; // troque quando quiser

function verificarSenha() {
  const senha = document.getElementById('senhaAdmin').value;
  const erro = document.getElementById('erro-senha');

  if (senha === SENHA_ADMIN) {
    localStorage.setItem('adminLogado', 'true');
    liberarPainel();
  } else {
    erro.textContent = 'Senha incorreta.';
  }
}

function liberarPainel() {
  document.getElementById('login-admin').style.display = 'none';
  document.getElementById('painel-admin').style.display = 'block';
}

function logoutAdmin() {
  localStorage.removeItem('adminLogado');
  location.reload();
}

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('adminLogado') === 'true') {
    liberarPainel();
  }
});

    lojaSelect.addEventListener('change', carregarAdmin);
  }
});

