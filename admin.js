/* ===============================
   CONFIGURAÇÃO
================================ */

const SENHA_ADMIN = '15052007';
let produtoEmEdicao = null;

/* ===============================
   LOGIN ADMIN
================================ */

function verificarSenha() {
  const senha = document.getElementById('senhaAdmin')?.value;
  const erro = document.getElementById('erro-senha');

  if (senha === SENHA_ADMIN) {
    localStorage.setItem('adminLogado', 'true');
    liberarPainel();
  } else if (erro) {
    erro.textContent = 'Senha incorreta.';
  }
}

function liberarPainel() {
  const login = document.getElementById('login-admin');
  const painel = document.getElementById('painel-admin');

  if (!login || !painel) return; // 👈 evita erro fora do admin

  login.style.display = 'none';
  painel.style.display = 'block';
}

function logoutAdmin() {
  localStorage.removeItem('adminLogado');
  location.reload();
}

/* ===============================
   SALVAR / ATUALIZAR PRODUTO
================================ */

function salvarOuAtualizarProduto() {
  const loja = document.getElementById('loja').value;
  const nome = document.getElementById('nome').value.trim();
  const imagem = document.getElementById('imagem').value.trim();
  const link = document.getElementById('link').value.trim();

  if (!nome || !link) {
    alert('Preencha nome e link.');
    return;
  }

  const produtos = JSON.parse(localStorage.getItem(loja)) || [];

  if (produtoEmEdicao) {
    produtos[produtoEmEdicao.index] = { nome, imagem, link };
    produtoEmEdicao = null;
    document.getElementById('btn-salvar-produto').textContent = 'Salvar produto';
  } else {
    produtos.push({ nome, imagem, link });
  }

  localStorage.setItem(loja, JSON.stringify(produtos));
  limparFormulario();
  carregarAdmin();
}

/* ===============================
   EDITAR PRODUTO
================================ */

function editarProduto(loja, index) {
  const produtos = JSON.parse(localStorage.getItem(loja)) || [];
  const produto = produtos[index];

  document.getElementById('loja').value = loja;
  document.getElementById('nome').value = produto.nome;
  document.getElementById('imagem').value = produto.imagem || '';
  document.getElementById('link').value = produto.link;

  produtoEmEdicao = { loja, index };
  document.getElementById('btn-salvar-produto').textContent = 'Atualizar produto';
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
   LISTAR PRODUTOS (ADMIN)
================================ */

function carregarAdmin() {
  const loja = document.getElementById('loja').value;
  const lista = document.getElementById('lista-admin');
  lista.innerHTML = '';

  const produtos = JSON.parse(localStorage.getItem(loja)) || [];

  if (produtos.length === 0) {
    lista.innerHTML = '<p style="text-align:center;">Nenhum produto cadastrado.</p>';
    return;
  }

  produtos.forEach((produto, index) => {
    const div = document.createElement('div');
    div.className = 'admin-item';

    div.innerHTML = `
      <span>${produto.nome}</span>
      <div>
        <button onclick="editarProduto('${loja}', ${index})">Editar</button>
        <button onclick="removerProduto('${loja}', ${index})">Remover</button>
      </div>
    `;

    lista.appendChild(div);
  });
}

/* ===============================
   UTIL
================================ */

function limparFormulario() {
  document.getElementById('nome').value = '';
  document.getElementById('imagem').value = '';
  document.getElementById('link').value = '';
}

/* ===============================
   INIT
================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ===============================
     🔐 SOMENTE NO ADMIN
  ================================ */

  const existeLoginAdmin = document.getElementById('login-admin');
  const existePainelAdmin = document.getElementById('painel-admin');

  if (existeLoginAdmin && existePainelAdmin) {

    if (localStorage.getItem('adminLogado') === 'true') {
      liberarPainel();
    }

    document
      .getElementById('btn-login')
      ?.addEventListener('click', verificarSenha);

    document
      .getElementById('btn-salvar-produto')
      ?.addEventListener('click', salvarOuAtualizarProduto);

    document
      .getElementById('loja')
      ?.addEventListener('change', carregarAdmin);

    carregarAdmin();
  }

  /* ===============================
     🌐 PÁGINAS PÚBLICAS
  ================================ */

  carregarProdutos('shopee', 'lista-shopee');
  carregarProdutos('mercado', 'lista-mercado');
});
