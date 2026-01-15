/* ===============================
   CONFIGURAÇÃO
================================ */

const SENHA_HASH = 'b7c1b8c6e4f6fbd9e0f3b9d9f9e5c2f6d8c92d3c0a0e9a4c1f5e0a3b2d1c9e'; 
// hash da senha 15052007 (exemplo)
let produtoEmEdicao = null;

/* ===============================
   LOGIN ADMIN
================================ */

async function verificarSenha() {
  const senha = document.getElementById('senhaAdmin').value;
  const erro = document.getElementById('erro-senha');

  if (!senha) {
    erro.textContent = 'Digite a senha.';
    return;
  }

  const hash = await gerarHash(senha);

  if (hash === SENHA_HASH) {
    localStorage.setItem('adminLogado', 'true');
    liberarPainel();
  } else {
    erro.textContent = 'Senha incorreta.';
  }
}

async function gerarHash(texto) {
  const encoder = new TextEncoder();
  const data = encoder.encode(texto);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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
