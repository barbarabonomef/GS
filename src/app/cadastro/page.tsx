"use client";

import React, { useEffect, useState } from "react";
import AlertMessage from "../components/alerta";

type AlertType = "success" | "error";

export default function Cadastro() {
  useEffect(() => {
    document.title = "Cadastro";
  }, []);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [categoria, setCategoria] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");

  const [alert, setAlert] = useState<{ type: AlertType; message: string } | null>(null);

  const handleCadastro = async () => {
    const headersList = {
      "Content-Type": "application/json",
    };

    const bodyContent = JSON.stringify({
      nome,
      email,
      categoria,
      telefone,
      senha,
      confirmaSenha,
    });

    try {
      const response = await fetch("https://gs-java-production-9228.up.railway.app/usuario/cadastro", {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      });

      const data = await response.text();
      console.log(data);

      if (response.ok) {
        setAlert({ type: "success", message: "Cadastro realizado com sucesso!" });
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        setAlert({ type: "error", message: "Erro no cadastro: " + data });
      }
    } catch (error) {
      console.error(error);
      setAlert({ type: "error", message: "Erro na conexão com o servidor." });
    }
  };

  return (
    <>
      {alert && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <main>
        <form
          method="post"
          encType="multipart/form-data"
          className="max-w-[400px] sm:max-w-[450px] md:max-w-[580px] lg:max-w-[800px] mx-auto bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md mt-8 mb-10"
        >
          <p className="text-xl font-bold text-gray-700 dark:text-white text-center mb-4">
            Preencha os dados abaixo para realizar o seu cadastro
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="txtNome" className="block text-gray-700 dark:text-white font-medium mt-2 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                name="txtNome"
                id="txtNome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="txtEmail" className="block text-gray-700 dark:text-white font-medium mb-2">
                E-mail
              </label>
              <input
                type="email"
                name="txtEmail"
                id="txtEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="txtCategoria" className="block text-gray-700 dark:text-white font-medium mb-2">
                Categoria
              </label>
              <input
                list="categorias"
                type="text"
                name="txtCategoria"
                id="txtCategoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <datalist id="categorias">
                <option value="Voluntário" />
                <option value="Moderador" />
              </datalist>
            </div>

            <div>
              <label htmlFor="txtTelefone" className="block text-gray-700 dark:text-white font-medium mb-2">
                Telefone
              </label>
              <input
                type="tel"
                name="txtTelefone"
                id="txtTelefone"
                placeholder="(XX) XXXXX-XXXX"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-white font-medium mb-2">
                Digite uma senha
              </label>
              <input
                type="password"
                name="txtCriarSenha"
                id="txtCriarSenha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-white font-medium mb-2">
                Confirme a sua senha
              </label>
              <input
                type="password"
                name="txtConfirmarSenha"
                id="txtConfirmarSenha"
                value={confirmaSenha}
                onChange={(e) => setConfirmaSenha(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleCadastro}
                className="inline-block px-6 py-2 bg-green-500 dark:bg-green-600 text-white font-bold rounded-md hover:bg-green-600 transition"
              >
                Cadastrar
              </button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
