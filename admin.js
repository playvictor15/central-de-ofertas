/* ===============================
   CONFIGURAÇÃO
================================ */

// 🔐 HASH SHA-256 da senha: 15052007
const SENHA_HASH =
  '8d6f4c6d98d7a3b2d3a6c0e1f9e2a1c4c6e8b7d9a3e5f2c1b0a9e4d7f3';

let produtoEmEdicao = null;

/* ===============================
   FUNÇÕES GLOBAIS
================================ */

window.liberarPainel = function () {
  const login = document.getElementById('login-admin');
  const painel = document.getElementById('painel-admin');

  if (login) login.style.display = 'none';
  if (painel) painel.style.display = 'block';
};

window.gerarHash = async function (texto) {
  const encoder = new TextEncoder();
  const data = encoder.encode(texto);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};
window.verificarSenha = function () {
  const senha = document.getElementById('senhaAdmin')?.value;
  const erro = document.getElementById('erro-senha');

  if (!senha) {
    if (erro) erro.textContent = 'Digite a senha.';
    return;
  }

  // 🔐 senha real
  if (senha === '15052007') {
    sessionStorage.setItem('adminLogado', 'true');
    liberarPainel();
    if (erro) erro.textContent = '';
  } else {
    if (erro) erro.textContent = 'Senha incorreta.';
  }
};


/* ===============================
   SALVAR / ATUALIZAR PRODUTO
================================ */

window.salvarOuAtualizarProduto = function () {
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
};

/* ===============================
   EDITAR / REMOVER
================================ */

window.editarProduto = function (loja, index) {
  const produtos = JSON.parse(localStorage.getItem(loja)) || [];
  const produto = produtos[index];

  document.getElementById('loja').value = loja;
  document.getElementById('nome').value = produto.nome;
  document.getElementById('imagem').value = produto.imagem || '';
  document.getElementById('link').value = produto.link;

  produtoEmEdicao = { loja, index };
  document.getElementById('btn-salvar-produto').textContent = 'Atualizar produto';
};

window.removerProduto = function (loja, index) {
  const produtos = JSON.parse(localStorage.getItem(loja)) || [];
  produtos.splice(index, 1);
  localStorage.setItem(loja, JSON.stringify(produtos));
  carregarAdmin();
};

/* ===============================
   LISTAR ADMIN
================================ */

window.carregarAdmin = function () {
  const lojaSelect = document.getElementById('loja');
  const lista = document.getElementById('lista-admin');

  if (!lojaSelect || !lista) return;

  const loja = lojaSelect.value;
  lista.innerHTML = '';

  const produtos = JSON.parse(localStorage.getItem(loja)) || [];

  if (produtos.length === 0) {
    lista.innerHTML =
      '<p style="text-align:center;">Nenhum produto cadastrado.</p>';
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
};

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
  const login = document.getElementById('login-admin');
  const painel = document.getElementById('painel-admin');

  // 🔒 SEMPRE começa bloqueado
  if (login) login.style.display = 'block';
  if (painel) painel.style.display = 'none';

  // 🔓 Libera só se já estiver autenticado
  if (sessionStorage.getItem('adminLogado') === 'true') {
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
});
