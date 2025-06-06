"use client";

import Card from "./components/card";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import '@fontsource/poppins';

export default function Login() {
  const router = useRouter();
  const [tipoSelecionado, setTipoSelecionado] = useState<"Voluntário" | "Moderador" | null>(null);
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    document.title = "Login";
    const tipoSalvo = localStorage.getItem("tipoUsuario") as "Voluntário" | "Moderador" | null;
    if (tipoSalvo) {
      setTipoSelecionado(tipoSalvo);
    }
  }, []);

  const selecionarTipo = (tipo: "Voluntário" | "Moderador") => {
    localStorage.setItem("tipoUsuario", tipo);
    setTipoSelecionado(tipo);

    // Dispara evento personalizado para avisar o layout que mudou
    window.dispatchEvent(new Event("tipoUsuarioChange"));
  };

  const entrar = async () => {
    if (tipoSelecionado && usuario && senha) {
      try {
        const headersList = {
          "Content-Type": "application/json",
        };

        const bodyContent = JSON.stringify({
          email: usuario,
          senha: senha,
        });

        const response = await fetch("https://gs-java-production-9228.up.railway.app/usuario/login", {
          method: "POST",
          body: bodyContent,
          headers: headersList,
        });

        const data = await response.json(); // Importante: parsear como JSON

        if (response.ok) {
          // Armazena o token no localStorage
          localStorage.setItem("token", data.token);
          router.push("/home");
        } else {
          setErro(data.message || "Erro ao realizar login");
        }
      } catch (error) {
        setErro("Erro na requisição");
        console.error(error);
      }
    } else {
      alert("Por favor, preencha o email e a senha.");
    }
  };

  return (
    <>
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-1 p-4">
        <div className="flex flex-col lg:mt-16 lg:ml-28 lg:mr-0 sm:ml-14 sm:mr-14 md:mr-16 mt-5">
          <h1 className="text-5xl text-cyan-950 font-poppins font-black">
            <span className="text-cyan-950 bg-slate-200 rounded-full pr-4 pl-4 leading-tight">elo:</span>{' '}
            <span className="leading-none dark:text-white">quando cada conexão vira um ato de esperança.</span>
          </h1>
          <div className="grid grid-cols-1 items-center md:grid-cols-2 lg:grid-cols-2 gap-2 mt-10 font-poppins">
            <Card
              icone="🤝" 
              titulo="Missões" 
              descricao="Voluntários visualizam missões abertas e assumem tarefas com poucos cliques."
            />
            <Card 
              icone="🚨" 
              titulo="Alertas" 
              descricao="Receba notificações em tempo real sobre enchentes. Antecipe riscos."
            />
          </div>
        </div>
        <div className="flex flex-col items-center mt-5 lg:mt-10 mr-10">
          <div className="flex justify-center gap-5">
            <button
              onClick={() => selecionarTipo("Voluntário")}
              className="bg-cyan-800 dark:border-2 dark:border-white text-white px-4 py-2 rounded-full hover:bg-cyan-600 transition font-poppins"
            >
              Voluntário
            </button>
            <button
              onClick={() => selecionarTipo("Moderador")}
              className="bg-cyan-950 dark:border-2 dark:border-white text-white px-4 py-2 rounded-full hover:bg-cyan-900 transition font-poppins"
            >
              Moderador
            </button>
          </div>

          <form
            method="post"
            encType="multipart/form-data"
            className="w-full max-w-sm bg-slate-50 dark:bg-gray-700 p-6 rounded-lg shadow-md mt-10"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="mb-4 font-poppins">
              <label htmlFor="txtUsuario" className="block text-gray-700 dark:text-white font-bold mb-2">
                Usuário
              </label>
              <input
                type="text"
                name="txtUsuario"
                required
                placeholder="Digite seu usuário"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4 font-poppins">
              <label htmlFor="txtSenha" className="block text-gray-700 dark:text-white font-bold mb-2">
                Senha
              </label>
              <input
                type="password"
                name="txtSenha"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>

          {erro && (
            <div className="text-red-500 text-center mt-2">
              <p>{erro}</p>
            </div>
          )}

          <div className="flex justify-center gap-5 mt-5 font-poppins">
            <a href="/cadastro" className="bg-gray-300 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-400 transition">
              Cadastrar
            </a>
            <button
              onClick={entrar}
              className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-700 transition"
            >
              Entrar
            </button>
          </div>
          <div className="mt-3 text-center mb-10 font-poppins">
            <a href="/esqueciSenha" className="text-sm text-blue-500 hover:underline">
              Esqueci minha senha...
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
