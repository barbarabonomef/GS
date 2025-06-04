"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import AlertMessage from '../components/alerta';

// Função auxiliar para extrair o ID do token JWT
function obterIdDoToken(token: string): number | null {
  try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    return parseInt(payload.sub); // ID do usuário
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return null;
  }
}

type AlertType = "success" | "error";

export default function AtualizarCadastro() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [categoria, setCategoria] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [erro, setErro] = useState('');
  const [editando, setEditando] = useState(false);
  const [alerta, setAlerta] = useState<{ type: AlertType; message: string } | null>(null);

  useEffect(() => {
    document.title = "Atualizar Cadastro";
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    const id = obterIdDoToken(token);
    if (id) {
      carregarDadosUsuario(id);
    } else {
      setErro("Token inválido.");
    }
  }, [router]);

  const carregarDadosUsuario = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8080/usuario/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setNome(data.nome);
        setEmail(data.email);
        setCategoria(data.categoria || '');
        setTelefone(data.telefone || '');
      } else {
        setErro('Erro ao carregar os dados do usuário.');
      }
    } catch (error) {
      console.error('Erro ao carregar os dados:', error);
      setErro('Erro na requisição');
    }
  };

  const atualizarCadastro = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Usuário não autenticado.");
      return;
    }

    const id = obterIdDoToken(token);
    if (!id) {
      alert("Token inválido.");
      return;
    }

    const bodyContent = JSON.stringify({
      nome,
      email,
      categoria,
      telefone,
      senha,
      confirmaSenha
    });

    try {
      const response = await fetch(`http://localhost:8080/usuario/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: bodyContent
      });

      const data = await response.text();
      console.log(data);

      if (response.ok) {
        setAlerta({ type: "success", message: "Cadastro atualizado com sucesso!" });
      } else {
        setAlerta({ type: "error", message: "Erro na atualização: " + data });
      }
    } catch (error) {
      console.error(error);
      setAlerta({ type: "error", message: "Erro na conexão com o servidor." });
    }
  };

  return (
    <main>
      {alerta && (
              <AlertMessage
                type={alerta.type}
                message={alerta.message}
                onClose={() => setAlerta(null)}
              />
            )}
      <form className="max-w-3xl mx-auto bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-lg mt-8 mb-10">
        <p className="text-2xl font-bold text-gray-700 dark:text-white text-center mb-6">
          Atualize os dados do seu cadastro
        </p>

        {erro && <div className="text-red-500 text-center mb-4">{erro}</div>}

        <div className="space-y-6">

          {/* Botão de Edição */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setEditando(!editando)}
              className="bg-slate-300 px-4 py-1 rounded"
            >
              {editando ? "Salvar" : "Editar"}
            </button>
          </div>

          {/* Nome */}
          <div>
            <label htmlFor="txtNome" className="block text-gray-700 dark:text-white font-medium mb-2">
              Nome Completo
            </label>
            {!editando ? (
              <p className="text-gray-700 dark:text-white">{nome || 'Nenhum nome definido'}</p>
            ) : (
              <input
                type="text"
                id="txtNome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full p-3 border border-blue-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="txtEmail" className="block text-gray-700 dark:text-white font-medium mb-2">
              E-mail
            </label>
            {!editando ? (
              <p className="text-gray-700 dark:text-white">{email || 'Nenhum e-mail definido'}</p>
            ) : (
              <input
                type="email"
                id="txtEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-blue-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            )}
          </div>

          {/* Categoria com sugestões */}
          <div>
            <label htmlFor="txtCategoria" className="block text-gray-700 dark:text-white font-medium mb-2">
              Categoria
            </label>
            {!editando ? (
              <p className="text-gray-700 dark:text-white">{categoria || 'Nenhuma categoria definida'}</p>
            ) : (
              <>
                <input
                  list="categorias"
                  id="txtCategoria"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full p-3 border border-blue-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <datalist id="categorias">
                  <option value="Voluntário" />
                  <option value="Moderador" />
                </datalist>
              </>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label htmlFor="txtTelefone" className="block text-gray-700 dark:text-white font-medium mb-2">
              Telefone
            </label>
            {!editando ? (
              <p className="text-gray-700 dark:text-white">{telefone || 'Nenhum telefone definido'}</p>
            ) : (
              <input
                type="tel"
                id="txtTelefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(99) 99999-9999"
                className="w-full p-3 border border-blue-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            )}
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="txtCriarSenha" className="block text-gray-700 dark:text-white font-medium mb-2">
              Nova Senha
            </label>
            <input
              type="password"
              id="txtCriarSenha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-3 border border-blue-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Confirmar Senha */}
          <div>
            <label htmlFor="txtConfirmarSenha" className="block text-gray-700 dark:text-white font-medium mb-2">
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              id="txtConfirmarSenha"
              value={confirmaSenha}
              onChange={(e) => setConfirmaSenha(e.target.value)}
              className="w-full p-3 border border-blue-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="text-center mt-6">
            <button
              type="button"
              onClick={atualizarCadastro}
              className="inline-block px-6 py-2 bg-green-500 dark:bg-green-600 text-white font-bold rounded-md hover:bg-green-600 transition"
            >
              Atualizar Cadastro
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
