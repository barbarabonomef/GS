"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlertMessage from "../components/alerta";

export default function CriarMissao() {
  const router = useRouter();

  useEffect(() => {
    document.title = "Criar Missão";
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }
  }, [router]);

  const [titulo, setTitulo] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [organizacao, setOrganizacao] = useState("");
  const [descricao, setDescricao] = useState("");

  const [alerta, setAlerta] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (alerta) {
      const timer = setTimeout(() => setAlerta(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alerta]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const agora = new Date();
    const dataCriacaoFormata = agora.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const novaMissao = {
      titulo,
      localizacao,
      organizacao,
      descricao,
      dataCriacaoFormata,
    };

    try {
      const resposta = await fetch("http://localhost:8080/missao/criar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novaMissao),
      });

      const data = await resposta.text();
      console.log(data);

      if (resposta.ok) {
        setAlerta({ type: "success", message: "Missão criada com sucesso!" });
        setTitulo("");
        setLocalizacao("");
        setOrganizacao("");
        setDescricao("");
      } else {
        setAlerta({ type: "error", message: "Erro ao criar missão: " + data });
      }
    } catch (error) {
      console.error("Erro:", error);
      setAlerta({ type: "error", message: "Erro ao conectar com o servidor." });
    }
  };

  return (
    <>
      {alerta && (
        <AlertMessage
          type={alerta.type}
          message={alerta.message}
          onClose={() => setAlerta(null)}
        />
      )}

      <main>
        <form
          onSubmit={handleSubmit}
          className="max-w-[400px] sm:max-w-[450px] md:max-w-[580px] lg:max-w-[800px] mx-auto bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md mt-8 mb-10"
        >
          <p className="text-xl font-bold text-gray-700 dark:text-white text-center mb-4">
            Preencha os dados abaixo para criar uma Missão
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-white font-medium mt-2 mb-2">
                Título da Missão
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-white font-medium mt-2 mb-2">
                Localização
              </label>
              <input
                type="text"
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                placeholder="Digite a localização da missão"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-white font-medium mt-2 mb-2">
                Organização Responsável
              </label>
              <input
                type="text"
                value={organizacao}
                onChange={(e) => setOrganizacao(e.target.value)}
                placeholder="Nome da ONG ou grupo responsável"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-white font-medium mb-2">
                Descrição
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={5}
                placeholder="Detalhe o que será feito na missão"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                required
              />
            </div>

            <div className="text-center mt-4">
              <button
                type="submit"
                className="inline-block px-6 py-2 bg-green-500 dark:bg-green-600 text-white font-bold rounded-md hover:bg-green-600 transition"
              >
                Criar Missão
              </button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
